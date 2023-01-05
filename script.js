import { words } from './words/words.js'

let letters = []    // available letters
let guesses = []    // letters guessed so far
let lives = 0       // lives remaining
let word = ""       // the word to guess

resetGame()

// resets/starts the game, initializes letters, guesses, lives and gets a new word
function resetGame() {

  // initialize variables
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  guesses = []
  word = getRandomWord()
  lives = 6

  // render lives and blanks to the screen
  renderLives()
  renderWord()

  // initialize reveal and new word buttons  
  document.getElementById("reveal").addEventListener("click", revealWord)
  document.getElementById("new-word").addEventListener("click", resetGame)

  // initialize buttons and event listeners
  let alpha = document.getElementById("alpha")
  let half1 = document.getElementById("half1")
  let half2 = document.getElementById("half2")
  half1.innerHTML = ''
  half2.innerHTML = ''

  for (let i = 0; i < 13; i++) {
    let letter = letters[i]
    let button = document.createElement("button")
    button.classList.add("alphabet")
    button.innerText = letter
    button.addEventListener("click", () => guess(letter))
    half1.appendChild(button)
  }

  for (let i = 13; i < 26; i++) {
    let letter = letters[i]
    let button = document.createElement("button")
    button.classList.add("alphabet")
    button.innerText = letter
    button.addEventListener("click", () => guess(letter))
    half2.appendChild(button)
  }

  alpha.appendChild(half1)
  alpha.appendChild(half2)
}

// gets a random word for the game
function getRandomWord() {
  let index = Math.floor(Math.random() * words.length)
  while (words[index].length > 10) {
    index = Math.floor(Math.random() * words.length)
  }
  return words[index]
}

// removes the letter from the list of available letters.
// if letter is in the word, add it, otherwise remove a life
function guess(letter) {

  // check if letter has already been guessed
  if (guesses.includes(letter)) {
    return
  }

  // add letter to guesses
  guesses.push(letter)

  // remove letter from possible selections
  removeLetter(letter)

  // remove letter from list of available letters
  for (let i = 0; i < letters.length; i++) {
    if (letter === letters[i]) {
      letters.splice(i, 1)
    }
  }

  // if letter is in the word don't subtract a life
  let inWord = false
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      inWord = true
      break
    }
  }

  // subtract a life if the letter is not in the word
  // otherwise fill it in on the screen
  if (!inWord) {
    lives -= 1
    renderLives()
  } else {
    renderWord()
  }

  if (guessed()) {
    victory()
  }

  // lose if you run out of lives
  if (lives <= 0) {
    loseGame()
  }
}

// updates the lives count
function renderLives() {
  let livesCount = document.getElementById("lives--count")
  let children = document.getElementById("lives").children

  livesCount.innerText = lives

  for (let i = 0; i < 6; i++) {
    if (i < lives) {
      children[i].style.backgroundColor = "red"
    } else {
      children[i].style.backgroundColor = "transparent"
    }
  }
}

// renders the current state of the word (blanks and guessed letters) to the screen
function renderWord() {
  let wordEl = document.getElementById("word")
  wordEl.innerHTML = ''

  for (let i = 0; i < word.length; i++) {
    let newSpan = document.createElement("span")
    newSpan.classList.add("letter")

    if (guesses.includes(word[i])) {

      let newP = document.createElement("p")
      newP.classList.add("let")
      newP.innerText = word[i]
      newSpan.appendChild(newP)
    }

    wordEl.appendChild(newSpan)
  }
}

// reveals the answer
function revealWord() {
  let wordEl = document.getElementById("word")
  let children = wordEl.children

  for (let i = 0; i < word.length; i++) {
    if (!children[i].firstChild) {
      let newP = document.createElement("p")
      newP.classList.add("let")
      newP.innerText = word[i]
      children[i].appendChild(newP)
    }
  }
}

function guessed() {
  for (let i = 0; i < word.length; i++) {
    if (!guesses.includes(word[i])) {
      return false
    }
  }
  return true
}

// prints victory image when game has been won
function victory() {
  alert("Congratulations you won!")
}

// stops the game and reveals the answer
function loseGame() {
  alert("Sorry you lost!")
  revealWord()
}

// removes the given letter from the keyword
function removeLetter(letter) {
  let half1 = document.getElementById("half1")
  let half2 = document.getElementById("half2")
  let children1 = half1.children
  let children2 = half2.children

  for (let i = 0; i < 13; i++) {
    if (children1[i].innerText === letter) {
      children1[i].classList.add('chosen')
    } else if (children2[i].innerText === letter) {
      children2[i].classList.add('chosen')
    }
  }
}
