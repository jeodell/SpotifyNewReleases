import React from "react";

export default function Albums(props) {
    let artist = props.artists;
    let filterDate = props.filterDate;
    let albumsFiltered = artist.albums.filter(function(album) {
        return album.releaseDate >= filterDate;
    });
    return (
        <>
            {albumsFiltered.map((albums, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                    <div className="album-content">
                        <img
                            src={albums.coverArt.url}
                            className="album-cover"
                            alt={albums.name}
                        />
                        <div className="description">
                            <div className="artist-name">{artist.name}</div>
                            <div className="album-title">{albums.name}</div>
                            <div className="release-date">
                                Release Date: {albums.releaseDate}
                            </div>
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
