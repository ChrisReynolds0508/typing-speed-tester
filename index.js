import {sentences} from './sentences.js';

const container = document.createElement('div');// holds the app layout
container.classList.add('container'); 
document.body.appendChild(container); 

const sampleSentence = document.createElement('div');//section to display the sample sentence for the user to type 
sampleSentence.classList.add('sampleSentence');
container.appendChild(sampleSentence);

const textArea = document.createElement('textarea'); // section where the user will type the test sentence 
textArea.classList.add('textArea');
container.appendChild(textArea); 

const timer = document.createElement('div') // section where the timer will display 
timer.classList.add('timer');
container.appendChild(timer);

const wpmDisplay = document.createElement('div')// section to display how many words per minute were typed 
wpmDisplay.classList.add('wpmDisplay');
container.appendChild(wpmDisplay);

const accuracy = document.createElement('div')// section to display how accurate the user was at retyping the sample sentence 
accuracy.classList.add('accuracy');
container.appendChild(accuracy);

const resetBtn = document.createElement('button');// button to begin the test again
resetBtn.classList.add('resetBtn'); 
resetBtn.textContent = 'Begin Test';
container.appendChild(resetBtn);

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
    //if the user reaches the end of the current shuffled list
    if(currentIndex >= shuffledSentences.length){
        //reshuffle the original sentence array to get a new random order
        shuffledSentences = shuffleArray(sentences);
        // reset the index to start at the beginning of the new shuffled list
        currentIndex = 0; 
    }
    // return the next sentence and then increment the index for the next call 
    return shuffledSentences[currentIndex++]; 
}

let timerStarted = false; 
let startTime;
let interval;

let currentSentence = '';

const startTest = () => { 
    currentSentence = getNextSentence(); //this will make sure the current sentence is always new until the entire array of sentences has been used 
    sampleSentence.textContent = currentSentence; // appends the current sentence to the sampleSentence div 
    textArea.value = ''; //makes sure the text area is blank 
    timer.textContent = 'Time: 0.00s';//sets the default time to 0.00s
    wpmDisplay.textContent = ''; //set the words per minute div to an empty string which will be invisible to the user 
    accuracy.textContent = ''; //set the accuracy div to an empty string which will be invisible to the user 
    timerStarted = false; //makes sure the timer has not started until the user starts typing 
    clearInterval(interval);//stops the timer 
};

textArea.addEventListener('input', () => { 
    if(!timerStarted){ //has the timer started? 
        timerStarted = true; //start it 
        startTime = Date.now(); //stores the current time in milliseconds 

        interval = setInterval(() => {//set interval runs the function inside again and again every 50 milliseconds 
            const elapsed = (Date.now() - startTime) / 1000; // gets the elapsed time from the start time minus finish time
            timer.textContent = `Time: ${elapsed.toFixed(2)}s`; //appends the time message to the timer div to two decimal points 
        }, 50);
    }
    if(textArea.value.trim() === currentSentence && timerStarted){ //if the text area's value with whitespace removed is equal to currentSentence and the timer is running
        clearInterval(interval); //stop the setInterval function 
        timerStarted = false; // turn timer off 
        const endTime = Date.now(); // record the time in milliseconds 
        const timeTaken = (endTime - startTime) / 1000; 

        const wordCount = currentSentence.split(' ').length; 
        const wpm = (wordCount/timeTaken) * 60;
        wpmDisplay.textContent = `WPM: ${wpm.toFixed(2)}`;

        const typed = textArea.value;
        let correctChars = 0;
        for(let i = 0; i < typed.length; i++){
            if(typed[i] === currentSentence[i]){
                correctChars++;
            }
        }
        const accuracyPercent = (correctChars / currentSentence.length) * 100;
        accuracy.textContent = `Accuracy: ${accuracyPercent.toFixed(2)}%`;
    }
})

resetBtn.addEventListener('click', startTest);

shuffledSentences = shuffleArray(sentences);
startTest(); 