import './style.css'


let playing = false;
var timeline = null;

let bars = 16
const TRACKS = 4
let bpm = 120

const setBpm = (_bpm) => bpm = _bpm; 

const playBtn = document.getElementById("playBtn")
const clearBtn = document.getElementById("clearBtn")
const beatMachine = document.getElementById("beatMachine")
const barsInput = document.getElementById("barsInput")
const bpmInput = document.getElementById("bpmInput")

const kickSound = new Audio('./sounds/kick.mp3');
const snareSound = new Audio('./sounds/snare.mp3');
const openHatSound = new Audio('./sounds/openhat.mp3');
const hiHatSound = new Audio('./sounds/hihat.mp3');
kickSound.preload = 'auto'
kickSound.load()

document.addEventListener('keyup', e => {
  e.preventDefault()
  playing = !playing
  if(e.code == 'Space') {
    if (!playing) return stop()
    play()
  }
})

barsInput.addEventListener('change', (e) => {
  bars = e.target.value
  buildBoard()
})

bpmInput.addEventListener("change", (e) => setBpm(e.target.value))

for (var i = 0; i < TRACKS; i++) {
  // const row = document.createElement('div')
  // row.className = "track"
  // row.id = "track" + i
  // beatMachine.appendChild(row)
}

function findBeat(row, col) {
  return document.querySelector(`[data-row="${row}"][data-column="${col}"]`)
}

function togglePaintCell(row, col) {
  const thisCell = findBeat(row,col)
  thisCell.classList.toggle("painted")
}

clearBtn.addEventListener('click', clearBoard)
function clearBoard() {
  const paintedBeats = document.querySelectorAll(`.painted`)
  paintedBeats.forEach(beat => beat.classList.remove("painted"))
}

const tracks = document.querySelectorAll('.track')
const beats = document.getElementsByClassName('beat')

buildBoard()

function buildBoard() {
  document.querySelectorAll('.beat').forEach(beat => beat.remove())

  tracks.forEach((track, row) => {
    for (var i = 0; i < bars; i++) {
      const beat = document.createElement('button')
      beat.id = "beat" + i
      beat.dataset.row = row
      beat.dataset.column = i
      beat.onclick = () => togglePaintCell(beat.dataset.row, beat.dataset.column)
      if (i % 4 == 0) {
        beat.classList.add("beat-fourth")
      }
      else beat.className = "beat"
      track.appendChild(beat)
    }
  })
}

function playSound(sound) {
  var _sound = sound.cloneNode()
  _sound.play()
}

function play() {

  const time = 60_000 / bpm;
  const step = time / 4;

  playBtn.innerText = "Stop"

  timeline = setInterval(() => {

    var columns = document.querySelectorAll(`[data-column="${i}"]`)

    columns.forEach(beat => {
      beat.classList.add("playing")
      if (beat.classList.contains("painted")) {
        console.log(beat)
        switch (beat.dataset.row) {
          case "0":
            playSound(kickSound)
            break;
          case "1":
            playSound(snareSound)
            break;
          case "2":
            playSound(openHatSound)
            break;
          case "3":
            playSound(hiHatSound)
            break;
          default:
            break;
        }
        console.log("- - - row", beat.dataset.row)
        console.log("PLAY SOUND")
      }
      setTimeout(() => {
        if (i >= bars) i = 0;
        beat.classList.remove("playing")
      }, step)
    })

    i++
  }, step)
}

function stop() {
  playBtn.textContent = "Play"
  clearInterval(timeline)
}

playBtn.addEventListener('click', () => {
  playing = !playing

  if (!playing) return stop()

  play()

})