import React, { useState, useEffect } from 'react'
import './App.css'
import queryString from 'query-string'
import axios from 'axios'
import Albums from './Albums'
import FilterArtist from './FilterArtist'
import FilterDate from './FilterDate'

// Uses axios and react hooks to fetch and store data
export default function App() {
  let today = new Date()
  const [loading, setLoading] = useState(false)
  const [numFollowed, setNumFollowed] = useState(0)
  const [user, setUser] = useState({
    name: '',
  })
  const [artists, setArtists] = useState([
    {
      name: '',
      href: '',
      albums: [],
    },
  ])
  const [nextPageURL, setNextPageURL] = useState(
    'https://api.spotify.com/v1/me/following?limit=50&type=artist',
  )
  const [filterString, setFilterString] = useState('')
  const [filterDate, setFilterDate] = useState('2019-01-01')
  const [currentDate, setCurrentDate] = useState(
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
  )
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    fetchData()
  }, [nextPageURL])

  const fetchData = async () => {
    let parsedURI = queryString.parse(window.location.search)
    let accessToken = parsedURI.access_token
    if (!accessToken) return
    setLoading(true)

    // Fetch user info
    const userInfo = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken },
    })
    setUser({
      name: userInfo.data.display_name,
    })

    if (nextPageURL != null) {
      try {
        // fetch followed artists album info
        const nextPage = await axios.get(nextPageURL, {
          headers: { Authorization: 'Bearer ' + accessToken },
        })
        setNumFollowed(nextPage.data.artists.total)
        setNextPageURL(nextPage.data.artists.next)
        setArtists((artists) => [...artists, ...nextPage.data.artists.items])
      } catch (error) {
        console.log(error)
      }
    }

    if (pageNumber === 1) {
      artists.shift()
    }
    setPageNumber(pageNumber + 1)

    // TO RETURN NO DUPLICATE ALBUMS, USE SETALBUMS(PREVALBUMS => { RETURN [...NEW SET([...PREVALBUMS, NEWALBUMS])]})
    await Promise.all(
      artists.map(async (artist) => {
        try {
          let artistAlbums = await axios.get(
            artist.href +
              '/albums?offset=0&limit=5&include_groups=album,single',
            {
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
            },
          )
          return artistAlbums
        } catch (error) {
          console.log(error)
        }
      }),
    ).then((albumDatas) => {
      albumDatas.forEach((albumData, i) => {
        try {
          artists[i].albums = albumData.items.map((albumData) => ({
            name: albumData.name.includes('(')
              ? albumData.name.substring(0, albumData.name.indexOf('('))
              : albumData.name,
            releaseDate: albumData.release_date,
            url: albumData.external_urls.spotify,
            coverArt: albumData.images[0],
          }))
        } catch (error) {
          console.log(error)
        }
      })
    })

    artists.forEach((artists) => {
      try {
        setArtists({
          artists: artists
            .sort((a, b) => {
              let nameA = a.name.toLowerCase()
              let nameB = b.name.toLowerCase()
              if (nameA < nameB) return -1
              if (nameA > nameB) return 1
              return 0 //default return value (no sorting)
            })
            .map((item) => {
              return setArtists({
                name: item.name,
                albums: item.albums,
              })
            }),
        })
      } catch (error) {
        console.log(error)
      }
    })

    // fetch recent albums of followed artists
    // CONVERT ALBUMS TO A SET TO GET RID OF DUPLICATES
  }

  // array of followed artists
  // let artistsToRender =
  //   user && artists // checks if there is a user that follows at least one artist
  //     ? artists.filter((artists) =>
  //         artists.name.toLowerCase().includes(filterString.toLowerCase()),
  //       )
  //     : []

  /*artistToRender = artistToRender.map(artists => 
        artists.albums.forEach((albums, i) => {
        artists[i].albums = artists.albums.filter(artists.albums[i].releaseDate > this.state.filterDate)
        }))*/

  return (
    <>
      <div className='app'>
        {user.name ? (
          <div>
            <h1 className='home-page-header'>{user.name}'s New Releases</h1>
            <h2 className='artist-counter'>{numFollowed} followed artists</h2>
            <div className='filter'>
              <FilterArtist
                onTextChange={(text) => {
                  setFilterString(text)
                }}
              />
              <FilterDate onChange={(date) => setFilterDate(date)} />
            </div>
            {/* {artistsToRender.map((artists) => (
              <Albums artists={artists} />
            ))} */}
          </div>
        ) : (
          <button
            onClick={() => {
              window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login'
                : 'https://spotifynewreleasesbackend.herokuapp.com/login'
            }}
            className='sign-in-button'
          >
            Sign in with Spotify
          </button>
        )}
      </div>
      <div>{loading && 'Loading...'}</div>
    </>
  )
}
