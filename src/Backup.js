import React, { Component, useState, useEffect } from 'react'
import './App.css'
import queryString from 'query-string'
import Albums from './Albums'
import FilterArtist from './FilterArtist'
import FilterDate from './FilterDate'
import FilterBy from './FilterBy'
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination'

class App extends Component {
  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      isLoading: false,
      numFollowed: 0,
      user: {
        name: '',
      },
      artists: [
        {
          name: '',
          href: '',
          albums: [],
        },
      ],
      next: 'https://api.spotify.com/v1/me/following?limit=50&type=artist',
      filterString: '',
      filterDate:
        (today.getMonth() - 2 === 0
          ? today.getFullYear() - 1
          : today.getFullYear()) +
        '-' +
        (today.getMonth() - 2 === 0
          ? 12
          : today.getMonth() - 2 < 10
          ? '0' + (today.getMonth() - 2)
          : today.getMonth() - 2) +
        '-' +
        (today.getDate() >= 10 ? today.getDate() : '0' + today.getDate()),
      filterBy: 'artist',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.next !== prevState.next) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    let parsedURI = queryString.parse(window.location.search)
    let accessToken = parsedURI.access_token
    if (!accessToken) return
    this.setState({ isLoading: true })

    // fetch user info
    fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          user: {
            isLoading: false,
            name: data.display_name,
          },
        })
      })
      .catch((error) => {
        this.setState({
          error,
          isLoading: false,
        })
        console.log(error)
      })

    // fetch followed artist album info
    this.setState({ isLoading: true })
    if (this.state.next !== null) {
      fetch(this.state.next, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
        .then((response) => response.json())
        .then((artistData) => {
          if (artistData.artists) {
            this.setState({
              isLoading: false,
              numFollowed: artistData.artists.total,
              next: artistData.artists.next,
            })
          } else {
            this.setState({
              isLoading: false,
            })
          }
          // artists data
          let artists
          if (artistData.artists) {
            artists = artistData.artists.items // a.artists is undefined
          } else {
            console.log(artistData)
            return
          }

          // map over each artist and fetch albums
          let albumDataPromises = artists.map((artist) => {
            let responsePromise = fetch(
              artist.href +
                '/albums?offset=0&limit=50&include_groups=album,single',
              {
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                },
              },
            )
            let albumDataPromise = responsePromise.then((response) =>
              response.json(),
            )
            return albumDataPromise
          })
          let allAlbumDataPromises = Promise.all(albumDataPromises)
          let albumsPromise = allAlbumDataPromises.then((albumDatas) => {
            albumDatas.forEach((albumData, i) => {
              if (!albumData.items) {
                console.log(albumData)
                return
              }
              try {
                artists[i].albums = albumData.items.map((albumData) => ({
                  name: albumData.name.includes('(')
                    ? albumData.name.substring(0, albumData.name.indexOf('('))
                    : albumData.name, // e.items is undefined
                  releaseDate: albumData.release_date,
                  url: albumData.external_urls.spotify,
                  coverArt: albumData.images[0],
                }))
              } catch (error) {
                console.log(error)
              }
            })
            return artists
          })
          return albumsPromise
        })
        .then((fetchedArtists) => {
          let currentFilterDate = this.state.filterDate
          this.setState({
            artists: [
              ...this.state.artists,
              ...fetchedArtists.map((item) => {
                if (item.albums) {
                  return {
                    name: item.name,
                    albums: item.albums.filter(function (currentAlbum) {
                      return currentAlbum.releaseDate >= currentFilterDate
                    }),
                  }
                } else {
                  return {
                    name: item.name,
                    albums: [],
                  }
                }
              }),
            ],
          })
          this.setState({
            artists: this.state.artists.sort((a, b) => {
              let nameA = a.name.toLowerCase()
              let nameB = b.name.toLowerCase()
              if (nameA < nameB) return -1
              if (nameA > nameB) return 1
              return 0
            }),
          })
        })
        .catch((error) => {
          this.setState({
            error,
            isLoading: false,
          })
          console.log(error)
        })
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    // array of followed artists
    let artistsToRender =
      this.state.user && this.state.artists
        ? this.state.artists.filter((artists) =>
            artists.name
              .toLowerCase()
              .includes(this.state.filterString.toLowerCase()),
          )
        : []

    if (this.state.isLoading) {
      return <p className='loading'>Loading...</p>
    }

    return (
      <div className='app'>
        {this.state.user.name ? (
          <div>
            <h1 className='home-page-header'>
              {this.state.user.name}'s New Releases
            </h1>
            <h2 className='artist-counter'>
              {this.state.numFollowed} followed artists
            </h2>
            <div className='filter'>
              <FilterArtist
                onTextChange={(text) => {
                  this.setState({ filterString: text })
                }}
              />
              {/* <FilterBy
                                onChange={(filter) =>
                                    this.setState({ filterBy: filter })
                                }
                            /> */}
              <FilterDate
                onChange={(date) => this.setState({ filterDate: date })}
              />
            </div>
            <div className='album-layout'>
              {artistsToRender.map((artists, index) => (
                <Albums
                  key={index}
                  artists={artists}
                  filterDate={this.state.filterDate}
                />
              ))}
            </div>
            <div>
              <Pagination color='primary' />
            </div>
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
    )
  }
}

export default App
