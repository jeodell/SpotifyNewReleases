import React, { Component, useState, useEffect } from 'react'
import queryString from 'query-string'
import axios from 'axios'

// Uses axios and react hooks to fetch and store data
export default function Hooks() {
  let today = new Date()
  const [user, setUser] = useState({
    name: ''
  })
  const [artists, setArtists] = useState( [{
    name: '',
    href: '',
    albums: [],
  }])
  const[filterString, setFilterString] = useState('')
  const[filterDate, setFilterDate] = useState('2019-01-01')
  const[currentDate, setCurrentDate] = useState(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
  const [currentPageURL, setCurrentPageURL] = useState('https://api.spotify.com/v1/me/following?limit=50&type=artist')
  const [nextPageURL, setNextPageURL] = useState('')
  const [prevPageURL, setPrevPageURL] = useState('')

  useEffect(() => {
    let parsedURI = queryString.parse(window.location.search)
    let accessToken = parsedURI.access_token
    if(!accessToken)
      return
    
    // fetch user info
    axios.get('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(res => {
      setUser({
        name: res.data.display_name
    })

    // fetch followed artists album info
    axios.get(currentPageURL, {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(res => {
      setNextPageURL(res.artists.next)
      setArtists(res.artists.items)
    })

    // fetch recent albums of followed artists
    let albumDataPromises = artists.map(artist => {   // map over each artist and fetch albums
      let albumDataPromise = axios.get(artist.href + '/albums?offset=0&limit=20&include_groups=album,single', {
        headers: {'Authorization': 'Bearer ' + accessToken}
        })
      return albumDataPromise
    })
    let allAlbumDataPromises = Promise.all(albumDataPromises)
    let albumsPromise = allAlbumDataPromises.then(albumDatas => {
      albumDatas.forEach((albumData, i) => {
        artists[i].albums = albumData.items
          .map(albumData => ({
            name: albumData.name.includes('(') ? albumData.name.substring(0, albumData.name.indexOf('(')) : albumData.name,
            releaseDate: albumData.release_date,
            url: albumData.external_urls.spotify,
            coverArt: albumData.images[0],
          }))
      })
      return artists
    })
    return albumsPromise
  })
  .then(artists => this.setState({
    artists: artists.sort((a, b) => {
      let nameA = a.name.toLowerCase()
      let nameB = b.name.toLowerCase()
      if (nameA < nameB)  //sort string ascending
      return -1;
      if (nameA > nameB)
      return 1;
      return 0; //default return value (no sorting)
    }).map(item => {
      return {
        name: item.name,
        albums: item.albums
      }
  })
  }))})

  function gotoNextPage() {
    setCurrentPageURL(nextPageURL)
  }

  function gotoPrevPage() {
    setCurrentPageURL(prevPageURL)
  }

  // array of followed artists
  let artistsToRender =
    this.state.user &&    // checks if there is a user that follows at least one artist
    this.state.artists
      ? this.state.artists.filter(artists =>
        artists.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []

  /*artistToRender = artistToRender.map(artists => 
    artists.albums.forEach((albums, i) => {
      artists[i].albums = artists.albums.filter(artists.albums[i].releaseDate > this.state.filterDate)
    }))*/

    return
  }