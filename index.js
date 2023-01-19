import { musics } from "./dummyMusicDatas.js"
console.log(musics);

// <상태정보>
const musicState = {
    curIdx : 0,
    audio : null,
    onPlay : false
}

const playState = {
    default : true,
    repeat : false,
    shuffle : false,
}

// <조작할 엘리먼트>
const leftMainBox = document.querySelector('.left-box__main');
const leftListWrapBox = document.querySelector('.left-box__list');
const rightMainBox = document.querySelector('.player__body');
const leftListBox = document.querySelector('.left-box__lists');
const leftHeart = document.querySelector('.left-box__heart');
leftListBox.remove();
const spinDiv = makeSpinDiv();

function makeSpinDiv() {
    const spinDiv = document.createElement('div');
    spinDiv.classList.add('loadingBox');
    const dimDiv = document.createElement('div');
    dimDiv.classList.add('dim');
    const circleDiv = document.createElement('div');
    circleDiv.classList.add('circle')
    spinDiv.append(dimDiv);
    spinDiv.append(circleDiv);
    return spinDiv;
}

const btnLeftShuffle = document.querySelector('.left-box__shuffle');
const btnHeart = document.querySelector('.left-box__heart');

const player = document.querySelector('.list--buttons');
const btnPrevMusic = player.children[0];
const btnPlay = player.children[1];
const btnPlayIcon = document.querySelector('.play--button');
const btnNextMusic = player.children[2];

const playScrollBar = document.querySelector('input[type=range]');
const musicTime = document.querySelector('.right-box__time');

const footer = document.querySelector('.list--footer');
const btnRightHeart = footer.children[0];
const btnRightShuffle = footer.children[1];
const btnRightRepeat = footer.children[2];
// <이벤트 등록>

document.addEventListener('DOMContentLoaded', function() {
    audioControllerInit();
    leftMainChange();
    rightMainChange();
    musicListMake();
    audioCreate();
    setTimeout(() => {
        playHandler();
    }, 0)
})

function musicListMake() {
    musics.forEach((music, idx) => {
        const musicListNode = leftListBox.cloneNode(true);

        musicListNode.children[0].children[0].src = music.cover;
        musicListNode.children[0].children[1].children[0].textContent = music.singer;
        musicListNode.children[0].children[1].children[1].textContent = music.title;
        musicListNode.children[1].textContent = idx;

        if(idx === musicState.curIdx) {
            musicListNode.children[0].children[1].before(spinDiv);
        }
        
        // console.log(musicListNode);
        musicListNode.addEventListener('click', musicListClickHandler);
        leftListWrapBox.append(musicListNode);
    })
}
btnLeftShuffle.addEventListener('click', shuffleClickHandler);
btnHeart.addEventListener('click', heartClickHandler);

btnPlay.addEventListener('click', playHandler);

btnPrevMusic.addEventListener('click', () => {
    musicState.curIdx = (musicState.curIdx === 0 ? musics.length-1 : musicState.curIdx-1);
    musicChange();
})
btnNextMusic.addEventListener('click', () => {
    musicState.curIdx = (musicState.curIdx === musics.length-1 ? 0 : musicState.curIdx+1);
    musicChange();
})

btnRightHeart.addEventListener('click', heartClickHandler);
btnRightShuffle.addEventListener('click', () => {
    if(!playState.shuffle) {
        btnRightShuffle.children[0].children[0].classList.add('picked');
        playState.default = false;
        playState.shuffle = true;
    }
    else {
        btnRightShuffle.children[0].children[0].classList.remove('picked');
        playState.shuffle = false;
    }
    
    if(!playState.shuffle && !playState.repeat) playState.default = true;
    console.log(playState);
})
btnRightRepeat.addEventListener('click', () => {
    if(!playState.repeat) {
        btnRightRepeat.children[0].children[0].classList.add('picked');
        playState.default = false;
        playState.repeat = true;
    }
    else {
        btnRightRepeat.children[0].children[0].classList.remove('picked');
        playState.repeat = false;
    }
    
    if(!playState.shuffle && !playState.repeat) playState.default = true;
    console.log(playState);
})

playScrollBar.addEventListener('input', playScrollBarHandler);

function audioCreate() {
    const audioElement = new Audio(musics[musicState.curIdx].musicFile);
    // rightMainBox.append(audioElement);
    musicState.audio = audioElement;

    musicState.audio.addEventListener('canplaythrough', audioLoadedHandler );
    musicState.audio.addEventListener('timeupdate', audioTimeUpdateHandler);
    musicState.audio.addEventListener('ended', audioEndHandler);
}

function audioRemove() {
    musicState.audio.pause();
    audioControllerInit();
    musicState.audio.removeEventListener('canplaythrough', audioLoadedHandler);
    musicState.audio.removeEventListener('timeupdate', audioTimeUpdateHandler);
    musicState.audio.removeEventListener('ended', audioEndHandler);
    musicState.audio = null;
}


// 이벤트 함수

function audioEndHandler() {
    if(playState.default) {
        musicState.curIdx = (musicState.curIdx === musics.length-1 ? 0 : musicState.curIdx+1);
        musicChange();
    }
    else if(playState.repeat) {
        musicChange();
    }
    else if(playState.shuffle) {
        shuffleClickHandler();
    }
}
 
function shuffleClickHandler() {
    while(1) {
        const nextMusicIdx = Math.floor((Math.random() * musics.length));
        if(musicState.curIdx !== nextMusicIdx) {
            musicState.curIdx = nextMusicIdx;
            break;
        }
    }
    musicChange();
}



function heartClickHandler(event) {
    musics[musicState.curIdx].heart++;
    heartChange();
}



function musicListClickHandler(event) {
    musicState.curIdx = Number(event.target.children[1].textContent);

    musicChange();
}

function playHandler() {
    if(!musicState.onPlay) {
        musicState.onPlay = true;
        musicState.audio.play();
        btnPlayIcon.classList.remove('fa-play');
        btnPlayIcon.classList.add('fa-pause');
    }
    else {
        musicState.onPlay = false;
        musicState.audio.pause();
        btnPlayIcon.classList.remove('fa-pause');
        btnPlayIcon.classList.add('fa-play');
    }
}

function audioLoadedHandler() {
    // const playScrollBar = document.querySelector('input[type=range]');
    // const musicTime = document.querySelector('.right-box__time');
    playScrollBar.max = musicState.audio.duration;
    
    musicTime.children[1].textContent = makeMinuteSecond(musicState.audio.duration);
}

function audioTimeUpdateHandler() {
    console.log(musicState.audio.currentTime);
    const currentTime = musicState.audio.currentTime;
    const maxTime = playScrollBar.max;
    playScrollBar.value = currentTime;
    musicTime.children[0].textContent = makeMinuteSecond(musicState.audio.currentTime);

    playScrollBar.style.backgroundSize = (currentTime) * 100 / (maxTime) + '% 100%';
}

function playScrollBarHandler() {
    const currentTime = playScrollBar.value
    const maxTime = playScrollBar.max;
    musicState.audio.currentTime = currentTime;
    
    playScrollBar.style.backgroundSize = (currentTime) * 100 / (maxTime) + '% 100%';
}

// 기능 함수
// <left 조작>
function musicChange() {
    audioRemove();
    leftMainChange();
    rightMainChange();
    musicListChange();
    audioCreate();
    setTimeout(() => {
        playHandler();
    }, 0)
    
}

function musicListChange() {
    spinDiv.remove();
    const leftLists = leftListWrapBox.children;

    for(let idx=0 ; idx<leftLists.length ; idx++) {
        const musicListNode = leftLists[idx];
        if(idx === musicState.curIdx) {
            musicListNode.children[0].children[1].before(spinDiv);
        }
    }
}

function leftMainChange() {
    const leftMainNodes = leftMainBox.children;
    
    leftMainNodes[0].src = musics[musicState.curIdx].singerCover;
    leftMainNodes[1].textContent = musics[musicState.curIdx].singer;
    leftMainNodes[2].textContent = musics[musicState.curIdx].genre;

    heartChange();
}

function rightMainChange() {
    const rightMainNodes = rightMainBox.children;
    rightMainNodes[0].children[0].src = musics[musicState.curIdx].cover;

    rightMainNodes[1].children[0].textContent = musics[musicState.curIdx].album;
    rightMainNodes[1].children[1].textContent = musics[musicState.curIdx].title;
    rightMainNodes[1].children[2].textContent = musics[musicState.curIdx].singer;
}

function heartChange() {
    leftHeart.childNodes[1].textContent = musics[musicState.curIdx].heart;
}

// <right 조작>
function makeMinuteSecond(time) {
    const minute = Math.floor(time/60);
    const second = Math.floor(time%60);
    const digit2Minute = minute < 10 ? `0${minute}` : `${minute}`;
    const digit2Second = second < 10 ? `0${second}` : `${second}`;
    return digit2Minute + ':' + digit2Second;
}

function audioControllerInit() {
    // const playScrollBar = document.querySelector('input[type=range]');
// const musicTime = document.querySelector('.right-box__time');
    musicState.onPlay = false;
    playScrollBar.value = 0;
    btnPlayIcon.classList.remove('fa-pause');
    btnPlayIcon.classList.add('fa-play');
    musicTime.children[0].textContent = '00:00';
}