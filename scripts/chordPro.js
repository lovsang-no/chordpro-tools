/* String utils */

String.prototype.splice = function (index, string, remove = 0) {
  /* As suggested in https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index */
  return this.slice(0, index) + string + this.slice(index + Math.abs(remove));
};

String.prototype.wrapChord = function () {
  return '[' + this + ']';
};

String.prototype.wrapHTML = function (DOMElement, elClass = '') {
  return (
    '<' +
    DOMElement +
    ' class="' +
    elClass +
    '">' +
    this +
    '</' +
    DOMElement +
    '>'
  );
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

const all_keys = [
  'C',
  'C#',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
  'Cb',
  // Minor
  'Cm',
  'C#m',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Abm',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
];

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
    this.logicWrapper = new LogicWrapper();
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
              ? new Chord(chord.unwrapChord(), this.logicWrapper)
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
            if (last['chord'] !== undefined && last['lyrics'] !== undefined)
              pairs.push({});
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
              else if (command.toUpperCase() == 'TEMPO')
                text = text.split(' ')[0];
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
            else if (!meta_section_passed && linenum === 1)
              LINETYPE = 'SONG_ARTIST';
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
    this.logicWrapper = new LogicWrapper();
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
        metaBuffer.push(
          ('Toneart: ' + this.logicWrapper.currentKey).wrapHTML('div')
        );
      if (this.metadata.tempo)
        metaBuffer.push(
          (this.metadata.tempo + ' BPM ' + (this.metadata.time ?? '')).wrapHTML(
            'div'
          )
        );
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push((key + ': ' + value).wrapHTML('div'));
      }

      mainBuffer.push(
        metaBuffer.join('\n').wrapHTML('div', 'cp-meta-wrapper') + br
      );
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
        if (this.logicWrapper.getKey())
          metaBuffer.push('Key: ' + this.logicWrapper.getKey());
        if (this.metadata.tempo)
          metaBuffer.push('Tempo: ' + this.metadata.tempo);
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
                line.oneLine.forEach((e) => {
                  if (e instanceof Chord)
                    lineBuffer.push('[' + e.transposedChord() + ']');
                  else lineBuffer.push('[' + e + ']');
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                line.pairs.forEach((pair) => {
                  if (pair.chord)
                    lineBuffer.push('[' + pair.chord.transposedChord() + ']');
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
    if (this.title)
      sectionBuffer.push(this.title.wrapHTML('div', 'cp-heading'));
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
    if (chord) crd = new Chord(chord, this.logicWrapper);
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
        this.oneLine.forEach((chord) => {
          let e =
            chord instanceof Chord
              ? chord.parse()
              : chord.wrapHTML('span', 'cp-chord');
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
              let chord = pair.chord;
              let lyrics = pair.lyrics;
              chordLine = chord ? chord.parse() : '';
              lyricsLine = lyrics ? lyrics.replaceAll(' ', '&nbsp') : '&nbsp';
              tableBuffer.push('<td>');
              tableBuffer.push(chordLine + br + lyricsLine);
              tableBuffer.push('</td>');
            }
            lineBuffer.push(
              tableBuffer
                .join('\n')
                .wrapHTML('tr')
                .wrapHTML('tbody')
                .wrapHTML('table')
            );
          } else {
            for (let i = 0; i < pairs.length; i++) {
              let pair = pairs[i];
              let chord = pair.chord;
              let lyrics = pair.lyrics;
              chordLine += chord ? chord.parse() : '';
              lyricsLine += lyrics ?? '';
              let diff = (lyrics?.length ?? 0) - (chord?.length ?? 0);
              if (i + 1 !== length && diff > 0)
                chordLine += spaces(diff, '&nbsp');
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

// SIMON
const initialChordList = [
  {
    halfNotesFromC: 0,
    variants: ['B#', 'C'],
  },
  {
    halfNotesFromC: 1,
    variants: ['C#', 'Db'],
  },
  {
    halfNotesFromC: 2,
    variants: ['D'],
  },
  {
    halfNotesFromC: 3,
    variants: ['D#', 'Eb'],
  },
  {
    halfNotesFromC: 4,
    variants: ['E', 'Fb'],
  },
  {
    halfNotesFromC: 5,
    variants: ['E#', 'F'],
  },
  {
    halfNotesFromC: 6,
    variants: ['F#', 'Gb'],
  },
  {
    halfNotesFromC: 7,
    variants: ['G'],
  },
  {
    halfNotesFromC: 8,
    variants: ['G#', 'Ab'],
  },
  {
    halfNotesFromC: 9,
    variants: ['A'],
  },
  {
    halfNotesFromC: 10,
    variants: ['A#', 'Bb'],
  },
  {
    halfNotesFromC: 11,
    variants: ['B', 'Cb'],
  }
];

const getInitialChordObjectFromString = (chordString) => {
  // Handle potential H

  // Get root note
  const regex = /([CDEFGABC][b#]?)/g;
  const rootNoteFromString = chordString.match(regex)[0];
  const quality = chordString.split(regex);

  if (!rootNoteFromString) console.log('Could not find root note');

  // Find initial chord with matching chord
  for (const chordObject of initialChordList) {
    for (const noteVariant of chordObject.variants) {
      if (noteVariant === rootNoteFromString) {
        return {
          initialChordObject: chordObject,
          originalChord: chordObject,
          quality: quality,
        };
      }
    }
  }
  // Nothing is found
  return null;
};

class Cård {
  constructor(chordString) {
    this.rootNote = undefined;
    this.quality = undefined;
    this.bassNote = undefined;

    this.readChordString(chordString);
  }

  readChordString(chordString) {
    const chordParts = chordString.split('/');
    const rootChordString = chordParts[0];
    const bassChordString = chordParts[1];

    this.rootNote = getInitialChordObjectFromString(rootChordString);
    this.bassNote = getInitialChordObjectFromString(bassChordString);

    console.log(this);
  }
}

const cård = new Cård('Csus3/B#');

class Chord {
  constructor(chord, logicWrapper) {
    this.logicWrapper = logicWrapper;
    if (!logicWrapper) console.error('Transpose state not set');
    this.orig = chord;
    this.nashvilleChord = this.logicWrapper.nashvilleChord(this.orig);
  }

  transposedChord() {
    return this.logicWrapper.transposeChord(this.orig);
  }

  parse() {
    return (this.logicWrapper.parseSTATE === 'NASHVILLE'
      ? this.nashvilleChord
      : this.transposedChord() + '&nbsp'
    ).wrapHTML('span', 'cp-chord');
  }
}

class LogicWrapper {
  constructor() {
    /* Revidert statsbudsjett */
    this.keysObject = {
      major: [
        { key: 'C', index: 0, isBKey: false, listIndex: 0 },
        { key: 'C#', index: 1, isBKey: false, listIndex: 1, sharps: 7 }, // under tvil
        { key: 'Db', index: 1, isBKey: true, listIndex: 2, flats: 5 },
        { key: 'D', index: 2, isBKey: false, listIndex: 3, sharps: 2 },
        { key: 'Eb', index: 3, isBKey: true, listIndex: 4, flats: 3 },
        { key: 'E', index: 4, isBKey: false, listIndex: 5, sharps: 4 },
        { key: 'F', index: 5, isBKey: true, listIndex: 6, flats: 1 },
        { key: 'F#', index: 6, isBKey: false, listIndex: 7, sharps: 6 },
        { key: 'Gb', index: 6, isBKey: true, listIndex: 8, flats: 6 },
        { key: 'G', index: 7, isBKey: false, listIndex: 9, sharps: 1 },
        { key: 'Ab', index: 8, isBKey: true, listIndex: 10, flats: 4 },
        { key: 'A', index: 9, isBKey: false, listIndex: 11, sharps: 3 },
        { key: 'Bb', index: 10, isBKey: true, listIndex: 12, flats: 2 },
        { key: 'B', index: 11, isBKey: false, listIndex: 13, sharps: 5 },
      ],
      minor: [
        { key: 'Cm', index: 0, isBKey: true, listIndex: 0, flats: 3 },
        { key: 'C#m', index: 1, isBKey: false, listIndex: 1, sharps: 4 },
        { key: 'Dm', index: 2, isBKey: true, listIndex: 2, sharps: 2 },
        { key: 'D#m', index: 3, isBKey: false, listIndex: 3, sharps: 6 },
        { key: 'Ebm', index: 3, isBKey: true, listIndex: 4, flats: 6 },
        { key: 'Em', index: 4, isBKey: false, listIndex: 5, sharps: 1 },
        { key: 'Fm', index: 5, isBKey: true, listIndex: 6, flats: 4 },
        { key: 'F#m', index: 6, isBKey: false, listIndex: 7, sharps: 3 },
        { key: 'Gm', index: 7, isBKey: true, listIndex: 8, flats: 2 },
        { key: 'G#m', index: 8, isBKey: false, listIndex: 9, sharps: 5 },
        { key: 'Am', index: 9, isBKey: false, listIndex: 10 },
        { key: 'Bbm', index: 10, isBKey: true, listIndex: 11, flats: 5 },
        { key: 'Bm', index: 11, isBKey: false, listIndex: 12, sharps: 2 },
      ],
    };

    this.akkorder = [
      ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
    ];

    this.keyIsMinor = false;
    this.keys = undefined;
    this.transpose = 0;
    this.setTranspose(0);
    this.key = undefined;
    this.originalKeyObject = undefined;
    this.currentKeyObject = undefined;
    //this.transposedKeyObject = undefined;
    this.nashvilleLogic = this.getNasvilleList();
    this.parseSTATE = false;
  }
  // nashville -> transp til C også se i liste
  /* 

moll
1. sjekk om moll
2. bruk annen toneartliste
*/

  updateTransposedKeyObject() {
    const originalIndex = this.keys.map((x) => x.key).indexOf(this.key); // TODO: Kan mulig erstattes siden vi allerede har akkorden
    if (originalIndex === -1) return null;
    let indexShift = this.transpose + originalIndex;
    indexShift = this.modifiedModulo(
      this.transpose + originalIndex,
      this.keys.length
    );
    const transposedKeyObject = this.keys[indexShift];
    this.currentKeyObject = transposedKeyObject;
  }

  getTransposedKey() {
    this.updateTransposedKeyObject();
    return this.currentKeyObject.key;
  }

  modifiedModulo(number, modulo) {
    number = number % modulo;
    while (number < 0) number += modulo;
    return number;
  }

  getChordShiftLength() {
    return this.currentKeyObject.index - this.originalKeyObject.index;
  }

  transposeChord(chord, logRes = false) {
    if (!this.transpose) return chord;
    const regex = /([CDEFGABC][b#]?)/g;
    const isBKey = this.currentKeyObject.isBKey;

    const getExtraShiftLength = (c) => (['Fb'].indexOf(c) === -1 ? 2 : 1);
    const adjustChord = (c) => (c === 'Fb' ? 'E' : c);

    return chord.replace(regex, ($1) => {
      let chordBase = $1;
      chordBase = chordBase.replace('Cb', 'B');
      let findChordInList = this.akkorder[
        this.originalKeyObject.isBKey ? 1 : 0
      ];
      let origChordIndex = -1;

      const findChordIndex = (chord) =>
        (origChordIndex = findChordInList.indexOf(chordBase));

      findChordIndex(chordBase);
      if (logRes) {
        console.log('-'.repeat(10));
        console.log(origChordIndex, this.getChordShiftLength());
        console.log('OriginalKey: ', this.originalKeyObject.key);
        console.log('CurrentKey: ', this.currentKeyObject.key);
        console.log('Orig list: ', findChordInList);
        console.log('ChordBase: ', chordBase); /**/
      }
      if (origChordIndex === -1) {
        chordBase = adjustChord(chordBase);
        findChordIndex(chordBase);
      }

      /* If something wild happends */
      if (origChordIndex === -1) {
        /* If isBkey and suddenly wild # appears */
        if (this.originalKeyObject.isBKey) {
          chordBase = chordBase.replace('#', 'b');
          findChordIndex(chordBase);
          origChordIndex += getExtraShiftLength(chordBase);
        } else {
          chordBase = chordBase.replace('b', '#');
          findChordIndex(chordBase);
          origChordIndex -= getExtraShiftLength(chordBase);
        }
      }

      let newIndex = this.modifiedModulo(
        origChordIndex + this.getChordShiftLength(),
        this.akkorder[this.originalKeyObject.isBKey ? 1 : 0].length
      );

      if (logRes) {
        console.log('Etter bearbeiding');
        console.log('ChordBase: ', chordBase); /**/
        console.log(origChordIndex, this.getChordShiftLength());
        console.log('OriginalKey: ', this.originalKeyObject.key);
        console.log('CurrentKey: ', this.currentKeyObject.key);
        console.log('IndexShift: ', newIndex);
        console.log(
          'Current List: ',
          this.akkorder[this.currentKeyObject.isBKey ? 1 : 0]
        );
      }
      let transposedChord = this.akkorder[this.currentKeyObject.isBKey ? 1 : 0][
        newIndex
      ];
      if (logRes) console.log('New chord:', transposedChord);
      if (origChordIndex === -1) transposedChord = 'XX';

      /* If key is F# or G# */
      if (this.currentKeyObject.sharps >= 6) {
        if (transposedChord === 'F') transposedChord = 'E#';
      }

      /* If key is C# */
      if (this.currentKeyObject.sharps >= 7) {
        if (transposedChord === 'C') transposedChord = 'B#';
      }

      /* If key is Gb or Fb */
      if (this.currentKeyObject.flats >= 6) {
        if (transposedChord === (this.keyIsMinor ? 'E' : 'F'))
          transposedChord = 'Fb';
        if (transposedChord === 'B') transposedChord = 'Cb';
      }

      return transposedChord;
    });
  }

  nashvilleChord(orig = this.orig) {
    orig = orig.split('/');
    let res = '';
    for (let j = 0; j < orig.length; j++) {
      let chord = orig[j];
      for (let i = 0; i < this.nashvilleLogic.length; i++) {
        let nashvilleChord = this.nashvilleLogic[i];
        if (chord.startsWith(nashvilleChord)) {
          if (j > 0) res += '/';
          res += chord.replace(new RegExp(nashvilleChord, 'g'), i + 1);
        }
      }
    }
    return res;
  }

  transposeUp(by = 1) {
    this.transpose += by;
    this.handleChange();
  }

  transposeDown(by = 1) {
    this.transpose -= by;
    this.handleChange();
  }

  transposeReset(to = 0) {
    this.transpose = to;
    this.handleChange();
  }

  handleChange() {
    this.updateTransposedKeyObject();
    this.nashvilleLogic = this.getNasvilleList();
  }

  getKeyObjectFromKey(key) {
    return this.keys.find((x) => x.key === key);
  }

  setKey(key) {
    try {
      this.key = key;
      this.keyIsMinor = key.endsWith('m');
      this.keys = this.keyIsMinor
        ? this.keysObject.minor
        : this.keysObject.major;
      this.originalKeyObject = this.getKeyObjectFromKey(key);
      this.currentKeyObject = this.originalKeyObject;
      this.handleChange();
    } catch (e) {}
  }

  getKey() {
    return this.currentKeyObject?.key;
  }

  setTranspose(transpose) {
    this.transpose = transpose;
    if (transpose) this.updateTransposedKeyObject();
    else this.currentKeyObject = this.originalKeyObject;
  }

  getNasvilleList() {
    const key = this.key;
    if (key === 'C') return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    else if (key === 'C#') return ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'];
    else if (key === 'Db') return ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'];
    else if (key === 'D') return ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'];
    else if (key === 'Eb') return ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'];
    else if (key === 'E') return ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'];
    else if (key === 'F') return ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'];
    else if (key === 'F#') return ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'];
    else if (key === 'Gb') return ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'];
    else if (key === 'G') return ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];
    else if (key === 'Ab') return ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'];
    else if (key === 'A') return ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'];
    else if (key === 'Bb') return ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'];
    else if (key === 'B') return ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'];
    else if (key === 'Cb') return ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'];
    return [];
  }

  toString() {
    return key;
  }

  keyIsValid() {
    return this.logic.all_keys.indexOf(this.key) !== -1;
  }
}

const templateTest = `Jeg vil følge
Impuls
Key: D
Tempo: 86 BPM
Time: 4/4
Heisann: Key

[|] [D] [-] [-] [-] [|] [D/C#] [-] [-] [-] [|] [Bm7] [-] [-] [-] [|] [G] [-] [-] [-] [|]

Vers 1:
D[D]u kom til m[D/C#]eg og jeg fikk s[G]e hvem du var
[Em]Jesus Guds sønn
[Bm7]Du viste m[Bm7/A]eg veien du g[G]ikk for min skyld 
Din d[Em]ød ble mitt liv

Bro:
[Bm7]Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du [D/C#]kaller navnet m[Bm7]itt
Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du k[G]aller meg, k[F#sus]aller me[F#]g

Refreng:
Til å fø[Bm7]lge deg hvor e[G]nn du går
Jesus [D]du ga meg alt å [Asus4]leve for[A]
Da d[Bm7]u ble korsfestet ble je[G]g satt fri
For [E]se jeg var død men har [Asus4]nå fått li[A]v
Jeg vil [E]følge deg, 
Jesus [G]du som har all fremtid for m[D]eg[D/C#] [Bm7] [G]

Vers 2:
D[D]u som kom [D/C#]fra, et liv i h[G]erlighet, 
[Em]fornedret deg selv
[Bm7]Du forlot a[Bm7/A]lt, himmel og t[G]rone for meg, 
en f[Em]remmed du ble

Her er jeg

  `;
