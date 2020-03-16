import React, { useState, useEffect } from "react";
import "./App.css";
import queryString from "query-string";
import axios from "axios";
import Albums from "./Albums";
import FilterArtist from "./FilterArtist";
import FilterDate from "./FilterDate";

// Uses axios and react hooks to fetch and store data
export default function App() {
    let today = new Date();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: ""
    });
    const [numFollowed, setNumFollowed] = useState(0);
    const [artistsArray, setArtistsArray] = useState([{}]);
    const [artists, setArtists] = useState([
        {
            name: "",
            href: "",
            albums: []
        }
    ]);
    const [filterString, setFilterString] = useState("");
    const [filterDate, setFilterDate] = useState("2019-01-01");
    const [currentDate, setCurrentDate] = useState(
        today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate()
    );
    const [nextPageURL, setNextPageURL] = useState(
        "https://api.spotify.com/v1/me/following?limit=50&type=artist"
    );

    useEffect(() => {
        let parsedURI = queryString.parse(window.location.search);
        let accessToken = parsedURI.access_token;
        if (!accessToken) return;
        setLoading(true);

        // fetch user info
        axios
            .get("https://api.spotify.com/v1/me", {
                headers: { Authorization: "Bearer " + accessToken }
            })
            .then(res => {
                setUser({
                    name: res.data.display_name
                });

                if (nextPageURL != null) {
                    // fetch followed artists album info
                    axios
                        .get(nextPageURL, {
                            headers: { Authorization: "Bearer " + accessToken }
                        })
                        .then(res => {
                            setNumFollowed(res.data.artists.total);
                            setNextPageURL(res.data.artists.next);
                            console.log(artistsArray)

                            setArtistsArray(prevArtistsArray => {
                                console.log(prevArtistsArray)
                                return [...prevArtistsArray, ...res.data.artists.items]
                            });
                        })
                        .catch(error => console.log(error));
                }

                // fetch recent albums of followed artists
                // CONVERT ALBUMS TO A SET TO GET RID OF DUPLICATES
                let albumDataPromises = artistsArray.map(artist => {
                    // map over each artist and fetch albums
                    let albumDataPromise = axios.get(
                        artist.href +
                            "/albums?offset=0&limit=20&include_groups=album,single",
                        {
                            headers: { Authorization: "Bearer " + accessToken }
                        }
                    );
                    return albumDataPromise;
                });
                let allAlbumDataPromises = Promise.all(albumDataPromises);
                let albumsPromise = allAlbumDataPromises.then(albumDatas => {
                    albumDatas.forEach((albumData, i) => {
                        artists[i].albums = albumData.items.map(albumData => ({
                            name: albumData.name.includes("(")
                                ? albumData.name.substring(
                                      0,
                                      albumData.name.indexOf("(")
                                  )
                                : albumData.name,
                            releaseDate: albumData.release_date,
                            url: albumData.external_urls.spotify,
                            coverArt: albumData.images[0]
                        }));
                    });
                    return artists;
                });
                return albumsPromise;
            })
            .then(artists => {
                setArtists({
                    artists: artists
                        .sort((a, b) => {
                            let nameA = a.name.toLowerCase();
                            let nameB = b.name.toLowerCase();
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                            return 0; //default return value (no sorting)
                        })
                        .map(item => {
                            return setArtists({
                                name: item.name,
                                albums: item.albums
                            });
                        })
                });
            });
    }, [artists, artistsArray, nextPageURL]);

    // array of followed artists
    let artistsToRender =
        user && artists // checks if there is a user that follows at least one artist
            ? artists.filter(artists =>
                  artists.name
                      .toLowerCase()
                      .includes(filterString.toLowerCase())
              )
            : [];

    /*artistToRender = artistToRender.map(artists => 
        artists.albums.forEach((albums, i) => {
        artists[i].albums = artists.albums.filter(artists.albums[i].releaseDate > this.state.filterDate)
        }))*/

    return (
        <>
            <div className="app">
                {user.name ? (
                    <div>
                        <h1 className="home-page-header">
                            {user.name}'s New Releases
                        </h1>
                        <h2 className="artist-counter">
                            {numFollowed} followed artists
                        </h2>
                        <div className="filter">
                            <FilterArtist
                                onTextChange={text => {
                                    setFilterString(text);
                                }}
                            />
                            <FilterDate
                                onChange={date => setFilterDate(date)}
                            />
                        </div>
                        {artistsToRender.map(artists => (
                            <Albums artists={artists}/>
                        ))}
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            window.location = window.location.href.includes(
                                "localhost"
                            )
                                ? "http://localhost:8888/login"
                                : "https://spotifynewreleasesbackend.herokuapp.com/login";
                        }}
                        className="sign-in-button"
                    >
                        Sign in with Spotify
                    </button>
                )}
            </div>
            <div>{loading && "Loading..."}</div>
        </>
    );
}
