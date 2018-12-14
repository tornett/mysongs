/*
 * mysongs server
 */
const express = require('express')
const cors = require('cors')
const fs = require('fs')

const MYSONGS_SONGS_DIR = process.env.MYSONGS_SONGS_DIR || 'songs'
const MYSONGS_HOST_NAME = process.env.MYSONGS_HOST_NAME || 'localhost'
const MYSONGS_HOST_SCHEME = process.env.MYSONGS_HOST_SCHEME || 'http://'
const MYSONGS_HOST_PORT = process.env.MYSONGS_HOST_PORT || 3000
const MYSONGS_DEFAULT_SONG_COUNT = parseInt(process.env.MYSONGS_DEFAULT_SONG_COUNT) || 20

// for now loading song information entirely in memory,
// future change would be utilizing a db such as mongodb
let songs = []

// load the songs directory
!(() => {
  let songsFound = true
  try {
    songsFound = fs.lstatSync(MYSONGS_SONGS_DIR).isDirectory();
  } catch (err) {
    songsFound = false
  }
  if (songsFound) {
    fs.readdir(MYSONGS_SONGS_DIR, (err, items) => {
      for (let item of items) {
        // break fields, begin chopping off the filename extension
        const [artist, album, track, title] = item.split(/[.-]/)
        songs.push({
          artist: artist,
          album: album,
          track: track,
          title: title,
          url: `${MYSONGS_HOST_SCHEME}${MYSONGS_HOST_NAME}:${MYSONGS_HOST_PORT}/${item}`
        })
      }
      console.log(`${songs.length} songs loaded from directory "${MYSONGS_SONGS_DIR}"`)
    })
  } else {
    console.error(`"${MYSONGS_SONGS_DIR}" is not a readable directory, please see README.md`)
    process.exit(1)
  }
})()


const app = express()

// cors to allow flexibility with accessing resources
// from clients outside this domain
app.use(cors())

// songs statically stored and served from SONGS_DIR
app.use(express.static(MYSONGS_SONGS_DIR))

// Load tracks from songs directory
app.get('/v1/songs', (req, res) => {
  let begin = parseInt(req.query.begin) || 1
  let end = parseInt(req.query.end) || songs.length
  let requestedSongs = [...songs]
  let reversed = ''

  // normalize begin and end to within limits of available songs
  if (begin < 1 || begin > requestedSongs.length) {
    begin = 1
  }
  if (end < 1 || end > requestedSongs.length) {
    end = requestedSongs.length
  }

  // reverse order request
  if (begin > end) {
    requestedSongs.reverse()
    const t = begin
    begin = end
    end = t
    reversed = ' reversed'
  }

  // limit to maximum of 20 songs
  if ((end - begin) > MYSONGS_DEFAULT_SONG_COUNT) {
    end = begin + MYSONGS_DEFAULT_SONG_COUNT - 1
  }

  console.log(`request songs ${begin} to ${end}${reversed}`)

  res.json(requestedSongs.slice((begin - 1), end))
})

app.get('/v1/songcount', (req, res) => {
  console.log(`request songcount => ${songs.length}`)
  res.json(
    {
      begin: 1,
      end: songs.length
    }
  )
})

app.listen(MYSONGS_HOST_PORT, () => {
  console.log(`Server running on port ${MYSONGS_HOST_PORT}`)
})
