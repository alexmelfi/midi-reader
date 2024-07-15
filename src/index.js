import * as MidiPlayer from 'midi-player-js'


const body = document.body
const playPauseButton = document.querySelector('.play-pause-button')
const seekSlider = document.querySelector('.seek-slider')
const currentTime = document.getElementById('current-time')
const duration = document.getElementById('duration')
const songSelector = document.querySelector('.song-selector')
const pianoDiv = document.getElementById('piano')

let isPlaying = false
let playingMusic = document.createElement('audio')

let updateTimer

const loadMusic = music => {
    playingMusic.src = music
    playingMusic.load()

    isPlaying = false
    playPauseButton.src = '../icons/play-button.svg'

    updateTimer = setInterval(seekUpdate)
}

const togglePlay = () => {
    if (isPlaying) {
        pause()
    }
    else {
        play()
    }
    isPlaying = !isPlaying

    isPlaying ? playPauseButton.src = '../icons/pause-button.svg'
        : playPauseButton.src = '../icons/play-button.svg'
}

const play = () => {
    playingMusic.play()
    Player.play()
}

const pause = () => {
    playingMusic.pause()
    Player.pause()
}

playPauseButton.addEventListener('click', togglePlay)

seekSlider.addEventListener('change', () => {
    const seconds = playingMusic.duration * (seekSlider.value / 100)

    if (isPlaying) pause()

    playingMusic.currentTime = seconds

    Player.skipToSeconds(seconds)
    clearKeys()
    
    if (isPlaying) play()
})

const seekUpdate = () => {
    if (!isNaN(playingMusic.duration)) {
        seekSlider.value = playingMusic.currentTime * (100 / playingMusic.duration)

        let currentMin = Math.floor(playingMusic.currentTime / 60)
        let currentSec = Math.floor(playingMusic.currentTime - currentMin * 60)
        let durationMin = Math.floor(playingMusic.duration / 60)
        let durationSec = Math.floor(playingMusic.duration - durationMin * 60)

        if (currentSec < 10) {
            currentSec = '0' + currentSec
        }
        if (durationSec < 10) {
            durationSec = '0' + durationSec
        }

        currentTime.textContent = currentMin + ':' + currentSec
        duration.textContent = durationMin + ':' + durationSec
    }
}

songSelector.addEventListener('change', () => {
    if (isPlaying) togglePlay()

    loadMusic('../songs/' + songSelector.value + '.wav')
    loadMIDI(songSelector.value)
    clearKeys()
})

loadMusic('../songs/' + songSelector.value + '.wav')

const calcNotePosition = noteName => {
    const note = noteName.slice(0, noteName.length - 1)
    const octave = noteName[noteName.length - 1] - 1

    // console.log(note)
    // console.log(octave)

    let position
    let color = true;
    switch(note) {
        case 'A':
            position = ((octave + 1) * 7)
            break
        case 'B':
            position = ((octave + 1) * 7) + 1
            break
        case 'C':
            position = (octave * 7) + 2
            break
        case 'D':
            position = (octave * 7) + 3
            break
        case 'E':
            position = (octave * 7) + 4
            break
        case 'F':
            position = (octave * 7) + 5
            break
        case 'G':
            position = (octave * 7) + 6
            break
        case 'Db':
            position = (octave * 7) + 3
            color = false
            break
        case 'Eb':
            position = (octave * 7) + 4
            color = false
            break
        case 'Gb':
            position = (octave * 7) + 6
            color = false
            break
        case 'Ab':
            position = ((octave + 1) * 7)
            color = false
            break
        case 'Bb':
            position = ((octave + 1) * 7) + 1
            color = false
            break
    }

    // console.log(noteName + ' at ' + position)
    return { position: position, white: color }
}

// calcNotePosition('Ab1')
// calcNotePosition('Bb1')
// calcNotePosition('Db1')
// calcNotePosition('Eb1')
// calcNotePosition('Gb1')

// Initialize player and register event handler
const Player = new MidiPlayer.default.Player(event => {
	console.log(event)
})

Player.on('midiEvent', event => {
    if (event.noteName) generateKeys(calcNotePosition(event.noteName),
        event.noteNumber, event.name === 'Note on', event.noteName)
    else if (event.name === 'Set Tempo') {
        Player.setTempo(event.data)
    }
})

let numKeys = 0

const generateKeys = (position, noteNumber, noteOn, noteName) => {
    if (noteOn) {
        const key = document.createElement('div')
        key.classList += "key"

        const cWidth = document.body.clientWidth
        const cHeight = document.body.clientHeight

        if (position.white) {
            key.style = `height: ${(cHeight / 8.3) / cHeight * 100}vw;
            left:${(((cWidth / 52) * position.position) / cWidth * 100) + 0.1}vw;
            width: ${(cWidth / 52) / cWidth * 100}vw;
            background-color: rgb(101, 216, 116);
            border-radius: 3px;
            border-color: black;`
        }
        else {
            key.style = `height: ${(cHeight / 12.5) / cHeight * 100}vw;
            bottom: ${(cHeight / 25) / cHeight * 100}vw;
            left:${(((cWidth / 52) * position.position)/ cWidth * 100) - 0.5}vw;
            width: ${(cWidth / 100) / cWidth * 100}vw;
            background-color: rgb(7, 102, 20);`
        }
        key.innerText = noteName
        key.id = noteNumber
        pianoDiv.appendChild(key)
        numKeys++
    }
    else {
        if (document.getElementById(noteNumber)) {
            pianoDiv.removeChild(document.getElementById(noteNumber))
            numKeys--
        }
    }
}

const clearKeys = () => {
    while (document.querySelector('.key')) {
        pianoDiv.removeChild(document.querySelector('.key'))
    }
}

// console.log(innerWidth)

const songURIs = {
    Inquisitive: 'https://s3.amazonaws.com/alexmelfi.com/music/midi/Inquisitive.uri',
    'New Joy': 'https://s3.amazonaws.com/alexmelfi.com/music/midi/New+Joy.uri',
    'Chord Experiments': 'https://s3.amazonaws.com/alexmelfi.com/music/midi/Chord+Experiments.uri',
    'Procrastination': 'https://s3.amazonaws.com/alexmelfi.com/music/midi/Procrastination.uri',
}

// Load a MIDI file
const loadMIDI = songName => {
    return fetch(songURIs[songName])
    .then(res => {
        return res.text()
    })
    .then(data => {
        Player.loadDataUri(data)
    })
}

loadMIDI(songSelector.value)
// Player.play()