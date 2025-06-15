
import { sentences } from './sentences.js';

const container = document.createElement('div'); // holds the app layout
container.classList.add('container');
document.body.appendChild(container);

const heading = document.createElement('h1');
heading.classList.add('heading');
heading.textContent = 'Typing Speed Test';
container.appendChild(heading);

const sampleSentence = document.createElement('div'); // section to display the sample sentence
sampleSentence.classList.add('sampleSentence');
container.appendChild(sampleSentence);

const textArea = document.createElement('textarea'); // where user types
textArea.classList.add('textArea');
container.appendChild(textArea);

const timer = document.createElement('div'); // timer display
timer.classList.add('timer');
container.appendChild(timer);

const wpmDisplay = document.createElement('div'); // words per minute display
wpmDisplay.classList.add('wpmDisplay');
container.appendChild(wpmDisplay);

const accuracy = document.createElement('div'); // accuracy display
accuracy.classList.add('accuracy');
container.appendChild(accuracy);

const resetBtn = document.createElement('button'); // button to begin/restart test
resetBtn.classList.add('resetBtn');
resetBtn.textContent = 'Begin Test';
container.appendChild(resetBtn);

// Variables for the test state
let shuffledSentences = [];
let sentencesToType = []; // the 10 random sentences to use
let currentIndex = 0;

let timerStarted = false;
let startTime;
let interval;

let totalTypedChars = 0;
let totalCorrectChars = 0;

let currentSentence = '';

// Shuffle the original sentences array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Initialize or reset the test
const startTest = () => {
  shuffledSentences = shuffleArray(sentences);
  sentencesToType = shuffledSentences.slice(0, 10); // pick 10 random sentences

  currentIndex = 0;
  totalTypedChars = 0;
  totalCorrectChars = 0;

  currentSentence = sentencesToType[currentIndex];
  sampleSentence.textContent = currentSentence;

  textArea.value = '';
  textArea.disabled = false;

  timer.textContent = 'Time: 0.00s';
  wpmDisplay.textContent = '';
  accuracy.textContent = '';

  timerStarted = false;
  clearInterval(interval);
};

// Start timer on first input
textArea.addEventListener('input', () => {
  if (!timerStarted) {
    timerStarted = true;
    startTime = Date.now();

    interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      timer.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }, 50);
  }
});

// Handle pressing Enter to move to next sentence (or finish test)
textArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // prevent newline

    const typed = textArea.value.trim();

    // Count correct chars
    let correctChars = 0;
    for (let i = 0; i < typed.length && i < currentSentence.length; i++) {
      if (typed[i] === currentSentence[i]) correctChars++;
    }

    totalTypedChars += typed.length;
    totalCorrectChars += correctChars;

    currentIndex++;

    if (currentIndex >= sentencesToType.length) {
      // Test complete
      clearInterval(interval);
      timerStarted = false;

      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;

      // Calculate total words typed (sum of words in sentences used)
      const totalWords = sentencesToType.reduce(
        (sum, sentence) => sum + sentence.split(' ').length,
        0
      );

      const wpm = (totalWords / timeTaken) * 60;
      const accuracyPercent = (totalCorrectChars / totalTypedChars) * 100;

      wpmDisplay.textContent = `WPM: ${wpm.toFixed(2)}`;
      accuracy.textContent = `Accuracy: ${accuracyPercent.toFixed(2)}%`;

      sampleSentence.textContent = 'Test complete! Press "Begin Test" to try again.';
      textArea.disabled = true;
      textArea.value = '';
    } else {
      // Next sentence
      currentSentence = sentencesToType[currentIndex];
      sampleSentence.textContent = currentSentence;
      textArea.value = '';
    }
  }
});

resetBtn.addEventListener('click', startTest);

// Start the first test on page load
startTest();
