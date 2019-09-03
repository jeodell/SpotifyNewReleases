import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

class ArtistCounter extends Component {
  render() {
    let artists = this.props.artists
    return (
      <div className='artist-counter'>
        <h2>{artists.length} followed artists</h2>
      </div>
    );
  }
}

class NewAlbumsCounter extends Component {

}

class FilterArtist extends Component {
  render() {
    return (
      <div className='filter'>
        <span>Filter by Artist:</span>
        <input className='filter-input' type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}


class FilterDate extends Component {
  render() {
    return (
      <div className='filter'>
        <span>Filter by Date:</span>
        <input className='filter-input' type="date" onChange={event =>
          this.props.onChange(event.target.value)}/>
      </div>
    );
  }
}

class Albums extends Component {
  render() {
    let artist = this.props.artists
    return (
      <div className='album-layout'>
        <h3 className='artist-name'>{artist.name}</h3>
        <ul>
          {artist.albums.slice(0,1).map(albums => 
            <li style={{'list-style': 'none'}}>
              <span className='album-title'>{albums.name}</span>
              <br></br>
              <span>  Release Date: {albums.releaseDate}</span>
              <br></br>
              <img src={albums.coverArt.url} className='album-cover'/>
              <br></br>
              <a href={albums.url} target='_blank' rel='noopener noreferrer'>
                <button className='open-in-spotify-button'>Open In Spotify</button>
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    let today = new Date()
    this.state = {
      user: {
        name: '',
      },
      artists: [{
        name: '',
        href: '',
        albums: [],
      }],
      next: 'https://api.spotify.com/v1/me/following?limit=50&type=artist',
      filterString: '',
      filterDate: '2018-01-01',
      currentDate: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
    }
  }

  componentDidMount() {
    let parsedURI = queryString.parse(window.location.search)
    let accessToken = parsedURI.access_token
    if(!accessToken)
      return
    
    // fetch user info
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name,
      }
    }))
    
    // fetch followed artist album info
    fetch(this.state.next, {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(artistData => {
      this.setState({
        next: artistData.artists.next
      })
      let artists = artistData.artists.items  // artist data as json
      let albumDataPromises = artists.map(artist => {   // map over each artist and fetch albums
        let responsePromise = fetch(artist.href + '/albums?offset=0&limit=50&include_groups=album,single', {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let albumDataPromise = responsePromise.then(response => response.json())  // album data as json
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
        if (nameA < nameB) //sort string ascending
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
    }))
  }
  
  render() {
    console.log(this.state)
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

    return (
      <div className="app">
        {this.state.user.name ?
        <div>
          <h1 className='home-page-header'>
            {this.state.user.name}'s Playlists
          </h1>
          <ArtistCounter artists={this.state.artists}/>
          <div className='filter'>
            <FilterArtist onTextChange={text => {
                this.setState({filterString: text})
              }}/>
            <FilterDate onChange={date =>
              this.setState({filterDate: date})
            }/>
          </div>
          {artistsToRender.map(artists => 
            <Albums artists={artists} />
          )}
        </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://spotifynewreleasesbackend.herokuapp.com/login' }
          }
          className='sign-in-button'>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
