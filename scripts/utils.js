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
  const items = line.split(' ');
  for (let i = 0; i < items.length; i++) {
    let chord = items[i];
    if (!(chord.startsWith('[') && chord.endsWith(']'))) return false;
  }
  return true;
};

const all_keys = [
  'A',
  'Bb',
  'B',
  'Cb',
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
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
];

const chordColoring = ['sus', 'add', 'maj', 'min', '/', '('];

const isChord = (word) => {
  if (word)
    for (let i = 0; i < all_chords.length; i++) {
      let chord = all_chords[i];
      if (word.startsWith(chord)) {
        if (word === chord || word === chord + 'm') {
          return true;
        }

        for (let i = 0; i <= 10; i++) {
          if (word.startsWith(chord + i) || word.startsWith(chord + 'm' + i)) {
            return true;
          }
        }

        for (let i = 0; i < chordColoring.length; i++) {
          let currentColor = chordColoring[i];
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

/* 
const all_test_chords = [
  'A',
  'A#',
  'Bb',
  'B/D#',
  'Cb',
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'E#',
  'F',
  'F#sus',
  'Gb',
  'G',
  'G#',
  'Ab',
];
all_test_chords.forEach((chord) => {
  console.log(chord, 'isChord: ', isChord(chord));
});
 */

const newElement = (element, ...classes) => {
  const el = document.createElement(element);
  classes.forEach((c) => {
    el.classList.add(c);
  });
  return el;
};
