// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000);
    this.name = name;
    this.author = author;
    this.image = image;
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image);
    this.#list.push(newTrack);
    return newTrack;
  };

  static getList() {
    return this.#list.reverse();
  }

  static getById(id) {
    const track = this.#list.find((track) => track.id === id);
    return track
  }
}

Track.create(
  'In Yan',
  'Monatik i ROXOLANA',
  'https://picsum.photos/seed/picsum/100/100',
)
Track.create(
  'Baila Comingo',
  'Selena Gomez',
  'https://picsum.photos/seed/picsum/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/seed/picsum/100/100',
)
Track.create(
  'DAKITI',
  'Bad Bunny',
  'https://picsum.photos/seed/picsum/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/seed/picsum/100/100',
)
Track.create(
  'Another Love',
  'Enlco',
  'https://picsum.photos/seed/picsum/100/100'
)

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000);
    this.name = name;
    this.tracks = [];
    this.image = 'https://picsum.photos/seed/picsum/100/100';
  }

  static create(name) {
    const newPlaylist = new Playlist(name);
    this.#list.push(newPlaylist);
    return newPlaylist;
  }

  static getList() {
    return this.#list.reverse();
  }

  static makeMix(playlist) {
    const allTracks = Track.getList();
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks);
  }

  static getById(id) {
    return (
      Playlist.#list.find((playlist) => playlist.id === id)
    ) || null
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter((track) => track.id !== trackId)
  }

  addTrack(trackId) {
    const track = Track.getById(trackId)
    return this.tracks.push(track)
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) => playlist.name
      .toLowerCase()
      .includes(value.toLowerCase())
    )
  }
}

Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    }
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;
  const name = req.body.name
  if (!name) {
    return res.render('alert', {
    style: 'alert',
      data: {
        message: 'Error',
        info: 'Name is required',
        link: isMix ? '/spotify-create?isMix=true' : '/spotify-create',
    }
  })
  }
  const playlist = Playlist.create(name);
  if (isMix) {
    Playlist.makeMix(playlist);
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    }
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id);
  if (!playlist) {
    return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Error',
      info: 'Not found',
      link: '/'
    }
  })
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    }
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)
  if (!playlist) {
    return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Error',
      info: 'Not found',
      link: `/spotify-playlist?id=${playlist.id}`,
    }
  })
  }
  playlist.deleteTrackById(trackId);
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    }
  })
})

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Playlist not found',
        link: '/',
      }
    });
  }
  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
        playlistId: playlist.id,
        tracks: Track.getList(),
    }
})
})

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  console.log(playlistId)
  const trackId = Number(req.query.trackId);
  console.log(trackId)
  const playlist = Playlist.getById(playlistId);
  console.log(playlist);
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Playlist not found',
        link: '/',
      }
    });
  }
  playlist.addTrack(trackId);
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    }
  });
});

router.get('/', function (req, res) {
  const list = Playlist.getList(); 
  console.log(list)
  res.render('mylibrary', {
    style: 'mylibrary',
    data: {
      list: list.map(playlist => ({
        ...playlist,
        amount: playlist.tracks.length
      })),
    }
  })
})

router.get('/spotify-search', function (req, res) {
  const value = '';
  const list = Playlist.findListByValue(value);
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    }
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || '';
  const list = Playlist.findListByValue(value);
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    }
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router


