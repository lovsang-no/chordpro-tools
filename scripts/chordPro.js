/* String utils */
String.prototype.splice = function (index, string, remove = 0) {
  /* As suggested in https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index */
  return this.slice(0, index) + string + this.slice(index + Math.abs(remove));
};

String.prototype.wrapChord = function () {
  return '[' + this + ']';
};

String.prototype.wrapHTML = function (DOMElement, elClass = '') {
  return '<' + DOMElement + ' class="' + elClass + '">' + this + '</' + DOMElement + '>';
};

String.prototype.unwrapChord = function () {
  return this.slice(1, -1);
};

String.prototype.erase = function (from, to = 1) {
  return (
    this.slice(0, from) +
    ' '.repeat(to + from <= this.length ? to : this.length - from) +
    this.slice(from + Math.abs(to))
  );
};

const isCPOneLiner = (line) => {
  const items = line.replace(/ +/, ' ').split(' ');
  for (let i = 0; i < items.length; i++) {
    let chord = items[i];
    if (!(chord.startsWith('[') && chord.endsWith(']'))) return false;
  }
  return true;
};

const all_chords = [
  'A',
  'A#',
  'Bb',
  'B',
  'Cb',
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'E#',
  'Fb',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
];

const chordColoring = [
  'sus',
  'add',
  'maj',
  'min',
  '/',
  '(',
  'dim',
  '+',
  'omit',
  'M',
  'ø',
  'o',
  'aug',
  '-',
];

const isChord = (word) => {
  if (word)
    for (let i = 0; i < all_chords.length; i++) {
      let chord = all_chords[i];
      if (word.startsWith(chord)) {
        if (word === chord || word === chord + 'm') {
          return true;
        }

        for (let n = 0; n <= 10; n++) {
          if (word.startsWith(chord + n) || word.startsWith(chord + 'm' + n)) {
            return true;
          }
        }

        for (let j = 0; j < chordColoring.length; j++) {
          let currentColor = chordColoring[j];
          if (
            word.startsWith(chord + currentColor) ||
            word.startsWith(chord + 'm' + currentColor)
          ) {
            return true;
          }
        }
      }
    }
  return false;
};

const spaces = (number, space = ' ') => {
  return space.repeat(number);
};

class Song {
  constructor(template, bypassMeta = false) {
    this.logicWrapper = new TransposeLogic();
    this.metadata = new MetaData();
    this.sections = [];
    this.parseTargets = new Map();
    if (template) this.intialize(template, bypassMeta);
  }

  transposeUp(by = 1) {
    this.logicWrapper.transposeUp(by);
    this.reRender();
  }

  transposeDown(by = 1) {
    this.logicWrapper.transposeDown(by);
    this.reRender();
  }

  transposeReset(to = 0) {
    this.logicWrapper.transposeReset(to);
    this.reRender();
  }

  reRender = () => {
    for (let [target, parseTable] of this.parseTargets) {
      this.parseToTarget(target, parseTable);
    }
  };

  getCurrentSection = () => {
    if (this.sections.length === 0) this.newSection();
    return this.sections[this.sections.length - 1];
  };

  newSection(title = null) {
    this.sections.push(new Section(title, this.logicWrapper));
  }

  addOneLiner(list) {
    if (this.getCurrentSection() === null) this.newSection();
    this.getCurrentSection().addOneLiner(list);
  }

  parseNashville() {
    this.logicWrapper.parseSTATE = 'NASHVILLE';
    this.reRender();
  }

  parseChords() {
    this.logicWrapper.parseSTATE = 'CHORDS';
    this.reRender();
  }

  parseLyrics() {
    this.logicWrapper.parseSTATE = 'LYRICS';
    this.reRender();
  }

  intialize(template, bypassMeta = false) {
    if (template === true) template = this.sampleTemplate;
    template = template.trim();
    this.intialized = true;

    var chordRegex = /\[([^\]]*)\]/;

    // Await reading of chords if bypassMeta is false until meta data section is passed
    let meta_section_passed = bypassMeta;
    template
      .trim()
      .split('\n')
      .forEach((line, linenum) => {
        /* One liner */
        if (isCPOneLiner(line)) {
          let oneLineBuffer = [];
          line.split(' ').forEach((chord) => {
            chord = isChord(chord.unwrapChord())
              ? newChordObjectFromString(chord.unwrapChord(), this.logicWrapper)
              : chord.unwrapChord();
            oneLineBuffer.push(chord);
          });
          this.addOneLiner(oneLineBuffer);
        } /* If line has chords */ else if (line.trim().match(chordRegex)) {
          const songLine = new SongLine(this.logicWrapper);
          let lineList = line.split(chordRegex);
          const pairs = [{}];
          if (!line.trim().startsWith('[')) pairs[0]['chord'] = null;
          const pushIfNeeded = () => {
            let last = pairs[pairs.length - 1];
            if (last['chord'] !== undefined && last['lyrics'] !== undefined) pairs.push({});
          };
          lineList.forEach((word, index) => {
            pushIfNeeded();
            let pair = pairs[pairs.length - 1];
            if (isChord(word) && index % 2 !== 0) {
              /* Chords */
              pair['chord'] = word;
            } else {
              /* Lyrics */
              pair['lyrics'] = word === '' ? undefined : word;
            }
          });
          pairs.forEach((pair) => {
            songLine.addLyricPair(pair.chord, pair.lyrics);
          });
          this.getCurrentSection().addLine(songLine);
        } /* Line is blank or not containing chords */ else {
          /* Format meta data in a nice way */
          const metaRegex = /^(key|tempo|time|published|copyright|web|album):\s*(.*)/i;
          if (!meta_section_passed && line.match(metaRegex)) {
            const matches = line.match(metaRegex, 'i');

            if (matches.length >= 3) {
              let command = matches[1];
              let text = matches[2];
              if (command.toUpperCase() == 'KEY') text = text;
              //transpose_chord(text, transpose, transposed_is_b); // TODO: Transpose in correct way
              else if (command.toUpperCase() == 'TEMPO') text = text.split(' ')[0];
              //add more non-wrapping commands with this switch
              switch (command) {
                case 'Key':
                case 'key':
                  if (text.trim() !== '') {
                    this.logicWrapper.setKey(text.trim());
                  }
                  break;
                case 'Tempo':
                case 'tempo':
                  this.metadata.tempo = text;
                  break;
                case 'Time':
                case 'time':
                  this.metadata.time = text;
                  break;
                case 'Published':
                case 'published':
                  this.metadata.published = text;
                  break;
                case 'Web':
                case 'web':
                  this.metadata.web = text;
                  break;
                case 'Copyright':
                case 'copyright':
                  this.metadata.copyright = text;
                  break;
                case 'Album':
                case 'album':
                  this.metadata.album = text;
                  break;
              }
            }
          } /* For everything else  */ else {
            let LINETYPE;
            if (!meta_section_passed && linenum === 0) LINETYPE = 'SONG_TITLE';
            else if (!meta_section_passed && linenum === 1) LINETYPE = 'SONG_ARTIST';
            else if (line.trim().endsWith(':')) LINETYPE = 'SECTION_START';
            else if (line.trim() === '' && !meta_section_passed) {
              LINETYPE = 'META_END';
              meta_section_passed = true;
            } else if (line.trim() === '') LINETYPE = 'EMPTY';
            else LINETYPE = 'NONE';

            switch (LINETYPE) {
              case 'SONG_TITLE':
                this.metadata.title = line;
                break;
              case 'SONG_ARTIST':
                this.metadata.artist = line;
                break;
              case 'META_END':
                break;
              case 'SECTION_START':
                this.getCurrentSection().setTitle(line);
                break;
              case 'EMPTY':
                meta_section_passed = true;
                // Don't make empty sections
                if (template.split('\n')[linenum - 1].trim() != '') {
                  this.newSection();
                }
                break;
              case 'NONE':
                if (meta_section_passed) {
                  this.getCurrentSection().addLyrics(line);
                } else {
                  this.metadata.extra.set(
                    line.split(':')[0].trim(),
                    line.split(':')[1]?.trim() ?? ''
                  );
                }
                break;
              default:
                break;
            }
          }
        }
      });
  }

  reInitialize(template) {
    this.sections = [];
    this.logicWrapper = new TransposeLogic();
    this.metadata = new MetaData();
    this.intialize(template);
    this.reRender();
  }

  parsePlainHTML(target, autoParse = true) {
    if (autoParse) this.parseTargets.set(target, false);
    this.parseToTarget(target, false);
  }

  parseHTMLTable(target, autoParse = true) {
    if (autoParse) this.parseTargets.set(target, true);
    this.parseToTarget(target, true);
  }

  parseToTarget(target, parseTable = true, plainText = false) {
    if (!target) {
      console.error('No target is set');
      return;
    }
    const mainBuffer = [];
    const br = '<br>';

    if (this.intialized) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title)
        metaBuffer.push(this.metadata.title.wrapHTML('div', 'cp-song-title'));
      if (this.metadata.artist)
        metaBuffer.push(this.metadata.artist.wrapHTML('div', 'cp-song-artist'));
      if (this.logicWrapper.currentKey)
        metaBuffer.push(('Toneart: ' + this.logicWrapper.currentKey).wrapHTML('div'));
      if (this.metadata.tempo)
        metaBuffer.push(
          (this.metadata.tempo + ' BPM ' + (this.metadata.time ?? '')).wrapHTML('div')
        );
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push((key + ': ' + value).wrapHTML('div'));
      }

      mainBuffer.push(metaBuffer.join('\n').wrapHTML('div', 'cp-meta-wrapper') + br);
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKeyObject) {
        this.sections.forEach((section) => {
          if (
            !(
              section.logicWrapper.parseSTATE === 'LYRICS' &&
              section.lines.length === 1 &&
              section.lines[0].TYPE === 'ONELINE'
            )
          )
            mainBuffer.push(section.parse(parseTable) + br);
        });
      }
    } else {
      console.error('Chords not initialized yet.');
    }
    target.innerHTML = mainBuffer.join('\n');
    /* Append to target */
  }
  getTransposedChordPro(ignoreMeta = false) {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized) {
      /* Add meta data */
      if (!ignoreMeta) {
        const metaBuffer = [];
        if (this.metadata.title) metaBuffer.push(this.metadata.title);
        if (this.metadata.artist) metaBuffer.push(this.metadata.artist);
        if (this.logicWrapper.getKey()) metaBuffer.push('Key: ' + this.logicWrapper.getKey());
        if (this.metadata.tempo) metaBuffer.push('Tempo: ' + this.metadata.tempo);
        if (this.metadata.time) metaBuffer.push('Time: ' + this.metadata.time);
        for (let [key, value] of this.metadata.extra) {
          metaBuffer.push(key + ': ' + value);
        }
        mainBuffer.push(metaBuffer.join('\n'));
      }
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKeyObject) {
        this.sections.forEach((section) => {
          mainBuffer.push('');
          if (section.title) mainBuffer.push(section.title);
          section.lines?.forEach((line) => {
            let lineBuffer = [];
            switch (line.TYPE) {
              case 'ONELINE':
                lineBuffer = [];
                line.oneLine.forEach((oneLineObject) => {
                  lineBuffer.push('[' + chordObjectToTransposedString(oneLineObject) + ']');
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                line.pairs.forEach((pair) => {
                  lineBuffer.push('[' + chordObjectToTransposedString(pair.chord) + ']');
                  if (pair.lyrics) lineBuffer.push(pair.lyrics);
                });
                mainBuffer.push(lineBuffer.join(''));
            }
          });
        });
      }
      return mainBuffer.join('\n').trim();
    }
  }
}

class MetaData {
  constructor() {
    this.extra = new Map();
  }

  newOtherMetaData(property, data) {
    this.extra.set(property, data);
  }
}

class Section {
  constructor(title, logicWrapper) {
    this.title = title;
    this.lines = [];
    this.logicWrapper = logicWrapper;
  }

  addOneLiner(list) {
    let line = new SongLine(this.logicWrapper);
    line.addOneLiner(list);
    this.lines.push(line);
  }

  addLine(line) {
    this.lines.push(line);
  }

  addLyrics(lyrics) {
    let line = new SongLine(this.logicWrapper);
    line.addLyrics(lyrics);
    this.lines.push(line);
  }

  setTitle(title) {
    this.title = title;
  }

  parse(parseTable) {
    const br = '<br>';
    let sectionBuffer = [];
    if (this.title) sectionBuffer.push(this.title.wrapHTML('div', 'cp-heading'));
    this.lines.forEach((line) => {
      sectionBuffer.push(line.parse(parseTable));
    });
    return sectionBuffer.join('\n').wrapHTML('div', 'cp-section');
  }
}

class SongLine {
  constructor(logicWrapper) {
    this.pairs = [];
    this.logicWrapper = logicWrapper;
  }

  addLyricPair(chord, lyrics) {
    this.TYPE = 'LYRICS_AND_CHORDS';
    let crd = null;
    if (chord) crd = newChordObjectFromString(chord, this.logicWrapper);
    let pair = { chord: crd, lyrics: lyrics };
    this.pairs.push(pair);
  }

  addOneLiner(line) {
    this.TYPE = 'ONELINE';
    this.oneLine = line;
  }

  addLyrics(lyrics) {
    this.TYPE = 'LYRICS';
    this.lyrics = lyrics;
  }

  parse(parseTable) {
    const br = '<br>';
    let lineBuffer = [];
    switch (this.TYPE) {
      case 'ONELINE':
        let oneLineBuffer = [];
        this.oneLine.forEach((chordObject) => {
          // WARN
          let e = chordObjectToTransposedString(chordObject).wrapHTML('span', 'cp-chord');
          oneLineBuffer.push(e);
        });
        lineBuffer.push(oneLineBuffer.join(' ').wrapHTML('div'));

        break;
      case 'LYRICS_AND_CHORDS':
        let pairs = this.pairs;
        let lyricsLine = '';
        if (this.logicWrapper.parseSTATE === 'LYRICS') {
          for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            let lyrics = pair.lyrics;
            lyricsLine += lyrics ?? '';
          }
          lineBuffer.push(lyricsLine + br);
        } else {
          let chordLine = '';
          if (parseTable) {
            let tableBuffer = [];
            for (let i = 0; i < pairs.length; i++) {
              let pair = pairs[i];
              let chordObject = pair.chord;
              let lyrics = pair.lyrics;
              chordLine = chordObject
                ? chordObject.transposedChord().wrapHTML('span', 'cp-chord')
                : '';
              lyricsLine = lyrics ? lyrics.replaceAll(' ', '&nbsp') : '&nbsp';
              tableBuffer.push('<td>');
              tableBuffer.push(chordLine + br + lyricsLine);
              tableBuffer.push('</td>');
            }
            lineBuffer.push(
              tableBuffer.join('\n').wrapHTML('tr').wrapHTML('tbody').wrapHTML('table')
            );
          } else {
            for (let i = 0; i < pairs.length; i++) {
              let pair = pairs[i];
              let chord = pair.chord;
              let lyrics = pair.lyrics;
              chordLine += chord ? chord.parse() : '';
              lyricsLine += lyrics ?? '';
              let diff = (lyrics?.length ?? 0) - (chord?.length ?? 0);
              if (i + 1 !== length && diff > 0) chordLine += spaces(diff, '&nbsp');
            }
            lineBuffer.push(chordLine + br);
            lineBuffer.push(lyricsLine + br);
          }
        }
        break;
      case 'LYRICS':
        lineBuffer.push(this.lyrics);
        break;
    }
    return lineBuffer.join('\n').wrapHTML('div');
  }
}

/**
 * Suggestion for Chord object for fixing alt.
 * Equals `Amaj7/C#`
 */
const chordObject = {
  rootNote: 'A',
  quality: 'maj7',
  baseNote: {
    rootNote: 'C#',
    quality: null,
    baseNote: null,
  },
};

class Chord {
  constructor(chordString, transposeLogic) {
    this.transposeLogic = transposeLogic;
    if (!transposeLogic) console.error('Transpose logic object not set');

    this.originalString = chordString;
    this.root = undefined;
    this.bass = undefined;

    this.readChordString();
  }

  readChordString() {
    const chordParts = this.originalString.split('/');
    const rootChordString = chordParts[0];
    const bassChordString = chordParts[1];

    this.root = rootChordString ? chordPartObjectFromString(rootChordString) : null;
    this.bass = bassChordString ? chordPartObjectFromString(bassChordString) : null;
  }

  transposedChord() {
    return chordObjectToString(transposeChordObject(this));
  }

  getNashvilleString() {
    return chordObjectToNashvilleString(this);
  }
}

class TransposeLogic {
  constructor(key) {
    this.transposeStep = 0;
    this.keyIsMinor = undefined;
    this.key = undefined;
    this.keys = undefined;
    this.setTranspose(this.transposeStep);
    this.originalKeyObject = undefined;
    this.currentKeyObject = undefined;

    if (key) this.setKey(key);
  }

  transposeUp(by = 1) {
    this.transposeStep += by;
    this.handleChange();
  }

  transposeDown(by = 1) {
    this.transposeStep -= by;
    this.handleChange();
  }

  transposeReset(to = 0) {
    this.transposeStep = to;
    this.handleChange();
  }

  handleChange() {
    this.updateTransposedKeyObject();
  }

  getKeyObjectFromKey(key) {
    return this.keys.find((x) => x.key === key);
  }

  setKey(key) {
    try {
      this.key = key;
      this.keyIsMinor = key.endsWith('m');
      this.keys = this.keyIsMinor ? keyObjects.minor : keyObjects.major;
      this.originalKeyObject = this.getKeyObjectFromKey(key);
      this.currentKeyObject = this.originalKeyObject;
      this.handleChange();
    } catch (e) {}
  }

  updateTransposedKeyObject() {
    const originalIndex = this.keys.map((x) => x.key).indexOf(this.key); // TODO: Kan mulig erstattes siden vi allerede har akkorden
    if (originalIndex === -1) return null;
    let indexShift = this.transposeStep + originalIndex;
    indexShift = modifiedModulo(this.transposeStep + originalIndex, this.keys.length);
    const transposedKeyObject = this.keys[indexShift];
    this.currentKeyObject = transposedKeyObject;
  }

  setTranspose(transpose) {
    this.transposeStep = transpose;
    if (transpose) this.updateTransposedKeyObject();
    else this.currentKeyObject = this.originalKeyObject;
  }

  getTransposedKey() {
    this.updateTransposedKeyObject();
    return this.currentKeyObject.key;
  }

  getKey() {
    return this.currentKeyObject?.key;
  }
}

/* console.log(
  transposeChordObject(newChordObjectFromString('Dm', new TransposeLogic('Dm')))
); */
const javel = {
  root: {
    noteObject: {
      halfNotesFromC: 2,
      variants: ['D'],
      sharp: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      flat: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
      nashville: {
        major: {
          sharp: '2',
          flat: '2',
        },
        minor: {
          sharp: '2',
          flat: '2',
        },
      },
      solfege: {
        major: {
          sharp: 'Re',
          flat: 'Re',
        },
        minor: {
          sharp: 'Ti',
          flat: 'Ti',
        },
      },
    },
    quality: 'm',
  },
  bass: null,
  transposeLogic: {
    transposeStep: 0,
    keyIsMinor: true,
    key: 'Dm',
    keys: [
      {
        key: 'Cm',
        index: 0,
        listIndex: 0,
        flats: 3,
        isMinor: true,
      },
      {
        key: 'C#m',
        index: 1,
        listIndex: 1,
        sharps: 4,
        isMinor: true,
      },
      {
        key: 'Dm',
        index: 2,
        listIndex: 2,
        flats: 2,
        isMinor: true,
      },
      {
        key: 'D#m',
        index: 3,
        listIndex: 3,
        sharps: 6,
        isMinor: true,
      },
      {
        key: 'Ebm',
        index: 3,
        listIndex: 4,
        flats: 6,
        isMinor: true,
      },
      {
        key: 'Em',
        index: 4,
        listIndex: 5,
        sharps: 1,
        isMinor: true,
      },
      {
        key: 'Fm',
        index: 5,
        listIndex: 6,
        flats: 4,
        isMinor: true,
      },
      {
        key: 'F#m',
        index: 6,
        listIndex: 7,
        sharps: 3,
        isMinor: true,
      },
      {
        key: 'Gm',
        index: 7,
        listIndex: 8,
        flats: 2,
        isMinor: true,
      },
      {
        key: 'G#m',
        index: 8,
        listIndex: 9,
        sharps: 5,
        isMinor: true,
      },
      {
        key: 'Am',
        index: 9,
        listIndex: 10,
        sharps: 0,
        isMinor: true,
      },
      {
        key: 'Bbm',
        index: 10,
        listIndex: 11,
        flats: 5,
        isMinor: true,
      },
      {
        key: 'Bm',
        index: 11,
        listIndex: 12,
        sharps: 2,
        isMinor: true,
      },
    ],
    currentKeyObject: {
      key: 'Dm',
      index: 2,
      listIndex: 2,
      flats: 2,
      isMinor: true,
    },
    originalKeyObject: {
      key: 'Dm',
      index: 2,
      listIndex: 2,
      flats: 2,
      isMinor: true,
    },
  },
};

const templateTest = `Jeg vil følge
Impuls
Key: D
Tempo: 86 BPM
Time: 4/4
Heisann: Key

[|] [H] [-] [-] [-] [|] [D/C#] [-] [-] [-] [|] [Bm7] [-] [-] [-] [|] [G] [-] [-] [-] [|]

Vers 1:
D[D]u kom til m[D/C#]eg og jeg fikk s[G]e hvem du var
[Em]Jesus Guds sønn
[Bm7]Du viste m[Bm7/A]eg veien du g[G]ikk for min skyld 
Din d[Em]ød ble mitt liv

Bro:
[Magnus]Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du [D/C#]kaller navnet m[Bm7]itt
Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du k[G]aller meg, k[F#sus]aller me[F#]g

Refreng:
Til å fø[Hm7]lge deg hvor e[G]nn du går
Jesus [D]du ga meg alt å [Asus4]leve for[A]
Da d[Bm7]u ble korsfestet ble je[G]g satt fri
For [E]se jeg var død men har [Asus4]nå fått li[A]v
Jeg vil [E]følge deg, 
Jesus [G]du som har all fremtid for m[D]eg[D/C#]afsdf[Bm7]fdkljds [G]

Vers 2:
D[D]u som kom [D/C#]fra, et liv i h[G]erlighet, 
[Em]fornedret deg selv
[Bm7]Du forlot a[Bm7/A]lt, himmel og t[G]rone for meg, 
en f[Em]remmed du ble

Her er jeg
Her er jeg   
Her er jeg
Her er jeg
Her er jeg   
Her er jeg
  `;
