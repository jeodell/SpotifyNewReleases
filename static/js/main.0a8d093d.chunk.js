(window.webpackJsonpspotify_new_releases=window.webpackJsonpspotify_new_releases||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(7),i=n.n(s),o=(n(14),n(1)),l=n(5),c=n(3),u=n(2),m=n(4),h=(n(15),n(8)),f=n.n(h),p=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this.props.artists;return r.a.createElement("div",{className:"artist-counter"},r.a.createElement("h2",null,e.length," followed artists"))}}]),t}(a.Component),b=(a.Component,function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"filter"},r.a.createElement("span",null,"Filter by Artist:"),r.a.createElement("input",{className:"filter-input",type:"text",onKeyUp:function(t){return e.props.onTextChange(t.target.value)}}))}}]),t}(a.Component)),d=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"filter"},r.a.createElement("span",null,"Filter by Date:"),r.a.createElement("input",{className:"filter-input",type:"date",onChange:function(t){return e.props.onChange(t.target.value)}}))}}]),t}(a.Component),v=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this.props.artists;return r.a.createElement("div",{className:"album-layout"},r.a.createElement("h3",{className:"artist-name"},e.name),r.a.createElement("ul",null,e.albums.slice(0,1).map(function(e){return r.a.createElement("li",{style:{"list-style":"none"}},r.a.createElement("span",{className:"album-title"},e.name),r.a.createElement("br",null),r.a.createElement("span",null,"  Release Date: ",e.releaseDate),r.a.createElement("br",null),r.a.createElement("img",{src:e.coverArt.url,className:"album-cover"}),r.a.createElement("br",null),r.a.createElement("a",{href:e.url,target:"_blank",rel:"noopener noreferrer"},r.a.createElement("button",{className:"open-in-spotify-button"},"Open In Spotify")))})))}}]),t}(a.Component),y=function(e){function t(){var e;Object(o.a)(this,t),e=Object(c.a)(this,Object(u.a)(t).call(this));var n=new Date;return e.state={user:{name:""},artists:[{name:"",href:"",albums:[]}],next:"https://api.spotify.com/v1/me/following?limit=50&type=artist",filterString:"",filterDate:"2018-01-01",currentDate:n.getFullYear()+"-"+(n.getMonth()+1)+"-"+n.getDate()},e}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=f.a.parse(window.location.search).access_token;t&&(fetch("https://api.spotify.com/v1/me",{headers:{Authorization:"Bearer "+t}}).then(function(e){return e.json()}).then(function(t){return e.setState({user:{name:t.display_name}})}),fetch(this.state.next,{headers:{Authorization:"Bearer "+t}}).then(function(e){return e.json()}).then(function(n){e.setState({next:n.artists.next});var a=n.artists.items,r=a.map(function(e){return fetch(e.href+"/albums?offset=0&limit=50&include_groups=album,single",{headers:{Authorization:"Bearer "+t}}).then(function(e){return e.json()})});return Promise.all(r).then(function(e){return e.forEach(function(e,t){a[t].albums=e.items.map(function(e){return{name:e.name.includes("(")?e.name.substring(0,e.name.indexOf("(")):e.name,releaseDate:e.release_date,url:e.external_urls.spotify,coverArt:e.images[0]}})}),a})}).then(function(t){return e.setState({artists:t.sort(function(e,t){var n=e.name.toLowerCase(),a=t.name.toLowerCase();return n<a?-1:n>a?1:0}).map(function(e){return{name:e.name,albums:e.albums}})})}))}},{key:"render",value:function(){var e=this;console.log(this.state);var t=this.state.user&&this.state.artists?this.state.artists.filter(function(t){return t.name.toLowerCase().includes(e.state.filterString.toLowerCase())}):[];return r.a.createElement("div",{className:"app"},this.state.user.name?r.a.createElement("div",null,r.a.createElement("h1",{className:"home-page-header"},this.state.user.name,"'s Playlists"),r.a.createElement(p,{artists:this.state.artists}),r.a.createElement("div",{className:"filter"},r.a.createElement(b,{onTextChange:function(t){e.setState({filterString:t})}}),r.a.createElement(d,{onChange:function(t){return e.setState({filterDate:t})}})),t.map(function(e){return r.a.createElement(v,{artists:e})})):r.a.createElement("button",{onClick:function(){window.location=window.location.href.includes("localhost")?"http://localhost:8888/login":"https://spotifynewreleasesbackend.herokuapp.com/login"},className:"sign-in-button"},"Sign in with Spotify"))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},9:function(e,t,n){e.exports=n(17)}},[[9,1,2]]]);
//# sourceMappingURL=main.0a8d093d.chunk.js.map