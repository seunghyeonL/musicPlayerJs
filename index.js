// const musics = require('./dummyMusicDatas.js');
// console.log(musics);

const musics = [
    {
        title: 'music1',
        cover: 'https://image.bugsm.co.kr/album/images/500/1512/151262.jpg',
        singer: 'Nell',
        singerCover:'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2mfB/image/R8GLZlp58OLS1ozlZS5wvyqA5_Y.jpg',
        genre: 'genre1',
        album: 'album1',
        musicFile: './music/music1.mp3',
        heart: 10,
    },
    {
        title: 'music2',
        cover: 'https://image.bugsm.co.kr/album/images/500/1512/151262.jpg',
        singer: 'Nell',
        singerCover:'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2mfB/image/R8GLZlp58OLS1ozlZS5wvyqA5_Y.jpg',
        genre: 'genre2',
        album: 'album1',
        musicFile: './music/music1.mp3',
        heart: 10,
    },
    {
        title: 'music3',
        cover: 'https://image.aladin.co.kr/product/3718/88/cover500/4775054147_1.jpg',
        singer: 'Nell',
        singerCover:'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2mfB/image/R8GLZlp58OLS1ozlZS5wvyqA5_Y.jpg',
        genre: 'genre3',
        album: 'album1',
        musicFile: './music/music1.mp3',
        heart: 10,
    },
    {
        title: 'music4',
        cover: 'https://i.ytimg.com/vi/WNjZbszU7eY/hqdefault.jpg',
        singer: 'Nell',
        singerCover:'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2mfB/image/R8GLZlp58OLS1ozlZS5wvyqA5_Y.jpg',
        genre: 'genre4',
        album: 'album1',
        musicFile: './music/music1.mp3',
        heart: 10,
    },
    {
        title: 'music5',
        cover: 'https://i.ytimg.com/vi/WNjZbszU7eY/hqdefault.jpg',
        singer: 'Nell',
        singerCover:'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2mfB/image/R8GLZlp58OLS1ozlZS5wvyqA5_Y.jpg',
        genre: 'genre5',
        album: 'album1',
        musicFile: './music/music1.mp3',
        heart: 10,
    }
]

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
const btnPlay = player.children[1];
const btnPause = player.children[2];

// <이벤트 등록>

document.addEventListener('DOMContentLoaded', function() {
    leftMainChange();
    rightMainChange();
    musicListMake();
    audioMake();
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
btnPause.addEventListener('click', pauseHandler);

function audioMake() {
    const audioElement = new Audio(musics[musicState.curIdx].musicFile);
    // rightMainBox.append(audioElement);
    musicState.audio = audioElement;
    musicState.audio.addEventListener('progress', audioProgressHandler);
}


// 이벤트 함수

function shuffleClickHandler(event) {
    while(1) {
        const nextMusicIdx = Math.floor((Math.random() * musics.length));
        if(musicState.curIdx !== nextMusicIdx) {
            musicState.curIdx = nextMusicIdx;
            break;
        }
    }
    leftMainChange();
    rightMainChange();
    musicListChange();
}



function heartClickHandler(event) {
    musics[musicState.curIdx].heart++;
    heartChange();
}



function musicListClickHandler(event) {
    musicState.curIdx = Number(event.target.children[1].textContent);

    leftMainChange();
    rightMainChange();
    musicListChange();
}

function playHandler() {
    musicState.audio.play();
    musicState.onPlay = true;
    btnPlay.classList.add('hide');
    btnPause.classList.remove('hide');
    console.log(musicState.audio.duration);
}

function pauseHandler() {
    musicState.audio.pause();
    musicState.onPlay = false;
    btnPlay.classList.remove('hide');
    btnPause.classList.add('hide');
    console.log(musicState.audio.duration);
}

function audioProgressHandler() {

}
// 기능 함수
// <left 조작>
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



