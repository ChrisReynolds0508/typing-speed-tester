import {sentences} from './sentences.js';

const container = document.createElement('div');
container.classList.add('container'); 
document.body.appendChild(container); 

const sampleSentence = document.createElement('div');
sampleSentence.classList.add('sampleSentence');
container.appendChild(sampleSentence);

const textArea = document.createElement('input'); 
textArea.classList.add('textArea');
container.appendChild(textArea); 

const timer = document.createElement('div')
timer.classList.add('timer');
container.appendChild(timer);

const wpmDisplay = document.createElement('div')
wpmDisplay.classList.add('wpmDisplay');
container.appendChild(wpmDisplay);

const accuracy = document.createElement('div')
accuracy.classList.add('accuracy');
container.appendChild(accuracy);

const beginBtn = document.createElement('button');
beginBtn.classList.add('beginBtn'); 
beginBtn.textContent = 'Begin Test';
container.appendChild(beginBtn);

let shuffledSentences = [];// initialises empty array 
let currentIndex = 0; //initialises count to start at 0 

const shuffleArray = array => {
    const shuffled = [...array];//makes a copy of the array so it doesnt affect the original array of sentences
    for(let i=shuffled.length - 1; i > 0; i--){// loops backwards through the array stopping at index[1] because index[0] is already 'shuffled'
        const j = Math.floor(Math.random() * (i+1)); //generates a random number between 0-1 and multiplys it by index + 1 and rounds it down to the nearest integer
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
return shuffled; 
}

const getNextSentence = () =>{
    if(currentIndex >= shuffledSentences.length){
        shuffledSentences = shuffleArray(sentences);
        currentIndex = 0; 
    }
    return shuffledSentences[currentIndex++]; 
}