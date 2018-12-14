## mysongs

mysongs is a client-server solution for listing and playing back songs stored in a directory on the server.

Ouf-of-the-box, pnpm install or preferred package manager will install all
dependencies. It is written with a default configuration for a server runniing on localhost at port 3000. Configuration details are shown later and all values can be overriden.

### Pre-Requisites

#### Store Desired Songs in "songs" Directory

Song tracks should be stored in the "songs" directory with the following filename format:

```
  Artist-Album-dd-Title

  where dd is the 2 digit track number on the Album (e.g. 01)
```

The track number is currently ignored but should be included as a placeholder for future capabilities such as supporting album play order.

### API

#### Get library size
/v1/songcount

Will return JSON containing the range of valid [begin] and [end] song numbers.

#### Get list of songs including metadata with playback URL
/v1/songs[query parameters]
  [begin]
  [end]

  /v1/songs?begin=5&end=10
    returns song 5, 6, 7, 8, 9, and 10 as available in the library


  /v1/songs?begin=4&end=1
    returns song 4, 3, 2, and 1 as available in the library


The default is to return the JSON metadata of up to 20 songs in the default configuration

#### Default configuration

```
MYSONGS_SONGS_DIR=songs
MYSONGS_HOST_NAME=localhost
MYSONGS_HOST_SCHEME=http://
MYSONGS_HOST_PORT=3000
MYSONGS_DEFAULT_SONG_COUNT=20
```

See [dotenv](https://www.npmjs.com/package/dotenv) for overriding these parameters.
