import React from "react";

export default function Albums(props) {
    let artist = props.artists;
    let albums = artist.albums
    return (
        <>
            {albums.map((albums, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                    <div className="album-content">
                        <img
                            src={albums.coverArt.url}
                            className="album-cover"
                            alt={albums.name}
                        />
                        <div className="description">
                            <h1 className="artist-name">{artist.name}</h1>
                            <br></br>
                            <h1 className="album-title">{albums.name}</h1>
                            <br></br>
                            <h1 className="release-date">
                                Release Date: {albums.releaseDate}
                            </h1>
                            <br></br>
                            <a
                                className="spotify-btn-bg"
                                href={albums.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="open-in-spotify-btn">
                                    Open In Spotify
                                </button>
                            </a>
                        </div>
                    </div>
                </li>
            ))}
        </>
    );
}
