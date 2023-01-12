// const musics = require('./dummyMusicDatas.js');
// console.log(musics);

const musics = [
    {
        title: 'music1',
        singer: 'Nell',
        cover: 'https://image.bugsm.co.kr/album/images/500/1512/151262.jpg',
        category: 'category1',
        musicFile: './music/music1.mp3',
        heart: '10',
    },
    {
        title: 'music2',
        singer: 'Nell',
        cover: 'https://image.bugsm.co.kr/album/images/500/1512/151262.jpg',
        category: 'category2',
        musicFile: './music/music1.mp3',
        heart: '10',
    },
    {
        title: 'music3',
        singer: 'Nell',
        cover: 'https://image.aladin.co.kr/product/3718/88/cover500/4775054147_1.jpg',
        category: 'category3',
        musicFile: './music/music1.mp3',
        heart: '10',
    },
    {
        title: 'music4',
        singer: 'Nell',
        cover: 'https://i.ytimg.com/vi/WNjZbszU7eY/hqdefault.jpg',
        category: 'category4',
        musicFile: './music/music1.mp3',
        heart: '10',
    }
]

// <상태정보>
let currentMusicIdx = 0;

const playState = {
    default : true,
    repeat : false,
    shuffle : false,
}

// <조작할 엘리먼트>
const leftMainBox = document.querySelector('.left-box__main');
const leftListWrapBox = document.querySelector('.left-box__list');
const rightMainBox = document.querySelector('.right-box__main');
const leftListBox = document.querySelector('.left-box__lists');
leftListBox.remove();

// <이벤트 등록>
const btnLeftShuffle = document.querySelector('.left-box__shuffle');
const btnHeart = document.querySelector('.left-box__heart');

document.addEventListener('DOMContentLoaded', function() {
    const leftMainNodes = leftMainBox.children;
    const rightMainNodes = rightMainBox.children;
    leftMainChange(leftMainNodes);
    rightMainChange(rightMainNodes);
    musicListChange();
})


function musicListChange() {
    musics.forEach((music, idx) => {
        const musicListNode = leftListBox.cloneNode(true);

        musicListNode.children[0].children[0].src = music.cover;
        musicListNode.children[0].children[1].children[0].textContent = music.singer;
        musicListNode.children[0].children[1].children[1].textContent = music.title;
        musicListNode.children[1].textContent = idx;

        // console.log(musicListNode);
        musicListNode.addEventListener('click', musicListClickHandler);
        leftListWrapBox.append(musicListNode);
    })
}

function musicListClickHandler(event) {
    console.log(event.target);
    currentMusicIdx = event.target.children[1].textContent;
    const leftMainNodes = leftMainBox.children;
    const rightMainNodes = rightMainBox.children;
    leftMainChange(leftMainNodes);
    rightMainChange(rightMainNodes);
}


function leftMainChange(leftMainNodes) {
    leftMainNodes[0].src = musics[currentMusicIdx].cover;
    leftMainNodes[1].textContent = musics[currentMusicIdx].singer;
    leftMainNodes[2].textContent = musics[currentMusicIdx].category;
}

function rightMainChange(rightMainNodes) {
    rightMainNodes[0].src = musics[currentMusicIdx].cover;
    rightMainNodes[1].textContent = musics[currentMusicIdx].title;
    rightMainNodes[2].textContent = musics[currentMusicIdx].singer;
}

