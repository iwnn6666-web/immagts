const { createElement } = require("react");

const cardGrid = document.querySelector('.card-grid');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

let score = 0;
let time = 60;
let cards = [];
let flippedCards= [];
let matchedPairs= 0;
let level = 1;
let gameStarted = false;
let timer = null;

const allImages = [ 'DriftMaster.jpg', 'MuscleOutlaw.jpg', 'StreetKing.jpg', 'TorqueLegend.jpg', 'AmericanClassic.jpg', 'BlueLighting.jpg',
  'GreenMachine.jpg', 'HyperDrift.jpg', 'PinkFlaminggo.jpg', 'RallyLegend.jpg', 'SpeedDemon.jpg', 'SupraKing.jpg']


const overlay = createElement('div');
overlay.classList.add('overlay');
overlay.innerHTML = `<div class="overlay-content">
                    <h1 id="overlayText"></h1>
                    <button id="playAgainBtn"> Main Lagi</button>`;
document.body.appendChild(overlay);

const overlayText = document.getElementById('overlayText');
const playAgainBtn = document.getElementById('playAgainBtn');

function startLevel() {
    resetGame();

// level (level1:4, level2:5, ...max12)
const pairs = Math.min(4 + (level-1), 12);
//ambil gambar di folder
const selectedImages = allImages.slice(0, pairs);
// aturan waktu
time =Math.max(60-(level-1)* 10, 30);
timeElement.textContent = `Waktu:${time} detik`;

//buat karu jadi 2
selectedImages.forEach((img, index) => {
    for (let i =0; i<2;i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.pair = index;
        //sebelum di balik
const front = document.createElement("div");
front.classList.add('front');

//balik & tampilkan kartu
const back = document.createElement('div');
back.classList.add('back');
back.style.backgroundImage = url('Card/${img}');

card.appendChild(front);
card.appendChild(back);
cards.push(card);

    }
});

cards = shuffle(cards);
cards.forEach(card=>{
    cardGrid.appendChild(card);
    card.addEventListener('click', flipCard);
});
 gameStarted= false;
}

function resetGame(){
    clearInterval(timer);
    cardGrid.innerHTML = '';
    cards =[];
    flippedCards = [];
    matchedPairs =0;
    gameStarted = false;
    overlay.style.display = 'none';
}

//balik kartu dan mulai waktu
function flipCard() {
    if(!gameStarted){
        startTimer();
        gameStarted = true;
    }

    if (flipCard.length<2&&! this.classList.contains('flipped')){
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 800);
        }
    }
}

function checkMatch(){
    const card1 = flipCard[0];
    const card2 = flipCard[1];

    if(card1.dataset.pair===card2.dataset.pair){
        score++;
        matchedPairs++;
        scoreElement.textContent= `Skor: ${score}`;

        setTimeout(()=> {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
        }, 400);

        if(matchedPairs=== cards.length / 2){
            clearInterval(timer);
            if(level ===5){
                showOverlay("YOU WINN");
            } else {
                setTimeout(()=> {
                    alert(`Level ${level} selesai`);
                    level++;
                    startLevel();
                })
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards=[];
    } 
}

//acak gambar
function shuffle(array){
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]]=[array[j],array[i]];
    }
    return array;
}


function startTimer(){
    clearInterval(timer);
    timer = setInterval(()=> {
        time--;
        timeElement.textContent = `Waktu: ${time} detik`;
        if(time === 0){
            clearInterval(timer);
            showOverlay("Game Over");
        }
    }, 1000)
}

function showOverlay(message){
    overlay.textContent = message;
    overlay.style.display='flex';
    scoreElement.textContent = `Skor: ${score}`;
}

const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    score = 0;
    level = 1;
    scoreElement.textContent = `Skor: ${score}`;
    startLevel();
  });
}

startLevel();
