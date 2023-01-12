import musics from './dummyMusicDatas.mjs'
console.log(musics);

// <상태정보>
const musicState = {
    musics,
    currentMusicIdx : 0
}

const playState = {
    default : true,
    repeat : false,
    shuffle : false,
}

// <조작할 엘리먼트>
