const song = newSongObjectFromTemplate(templateTest);
const target = document.getElementById('target');
const songWrapper = document.createElement('DIV');

const callback = () => {
  songWrapper.innerHTML = songObjectToHtmlTable(song);
  console.log(song);
};

song.setRenderCallback(callback);

target.innerHTML += `Capo<br>`;
target.innerHTML += `<button onclick="song.capoUp()">+</button>`;
target.innerHTML += `<button onclick="song.capoDown()">-</button>`;
target.innerHTML += `<button onclick="song.capoReset()">Reset</button>`;
target.innerHTML += `<br><br>`;
target.innerHTML += `Transponer<br>`;
target.innerHTML += `<button onclick="song.transposeUp()">+</button>`;
target.innerHTML += `<button onclick="song.transposeDown()">-</button>`;
target.innerHTML += `<button onclick="song.transposeReset()">Reset</button>`;
target.innerHTML += `<br><br>`;
target.innerHTML += `<button onclick="song.setDisplayH(true)">Bruk H</button>`;
target.innerHTML += `<button onclick="song.setDisplayH(false)">Bruk B</button>`;
target.appendChild(songWrapper);
