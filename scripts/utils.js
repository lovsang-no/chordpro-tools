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
    if (c.trim() !== '') el.classList.add(c);
  });
  return el;
};
