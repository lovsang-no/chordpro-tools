/**
 * Modified modulo for using with negative numbers.
 *
 * @param {number} number
 * @param {number} modulo
 * @returns {number} modulo result
 */
const modifiedModulo = (number, modulo) => {
  number = number % modulo;
  while (number < 0) number += modulo;
  return number;
};

const keyObjects = {
  // legge inn variants og vise original key-string
  // mulighet for å gi tilbakemeldinger
  major: [
    { key: 'C', variants: ['C'], index: 0, listIndex: 0, sharps: 0 },
    { key: 'Db', variants: ['C#', 'Db'], index: 1, listIndex: 1, flats: 5 },
    { key: 'D', variants: ['D'], index: 2, listIndex: 2, sharps: 2 },
    { key: 'Eb', variants: ['D#', 'Eb'], index: 3, listIndex: 3, flats: 3 },
    { key: 'E', variants: ['E', 'Fb'], index: 4, listIndex: 4, sharps: 4 },
    { key: 'F', variants: ['E#', 'F'], index: 5, listIndex: 5, flats: 1 },
    { key: 'F#', variants: ['F#'], index: 6, listIndex: 6, sharps: 6 },
    { key: 'Gb', variants: ['Gb'], index: 6, listIndex: 7, flats: 6 },
    { key: 'G', variants: ['G'], index: 7, listIndex: 8, sharps: 1 },
    { key: 'Ab', variants: ['G#', 'Ab'], index: 8, listIndex: 9, flats: 4 },
    { key: 'A', variants: ['A'], index: 9, listIndex: 10, sharps: 3 },
    { key: 'Bb', variants: ['A#', 'Bb'], index: 10, listIndex: 11, flats: 2 },
    { key: 'B', variants: ['B', 'Cb'], index: 11, listIndex: 12, sharps: 5 },
  ],
  minor: [
    { key: 'Cm', variants: ['B#m', 'Cm'], index: 0, listIndex: 0, flats: 3, isMinor: true },
    { key: 'C#m', variants: ['C#m', 'Dbm'], index: 1, listIndex: 1, sharps: 4, isMinor: true },
    { key: 'Dm', variants: ['Dm'], index: 2, listIndex: 2, flats: 2, isMinor: true },
    { key: 'D#m', variants: ['D#m'], index: 3, listIndex: 3, sharps: 6, isMinor: true },
    { key: 'Ebm', variants: ['Ebm'], index: 3, listIndex: 4, flats: 6, isMinor: true },
    { key: 'Em', variants: ['Em', 'Fbm'], index: 4, listIndex: 5, sharps: 1, isMinor: true },
    { key: 'Fm', variants: ['E#m', 'Fm'], index: 5, listIndex: 6, flats: 4, isMinor: true },
    { key: 'F#m', variants: ['F#m', 'Gbm'], index: 6, listIndex: 7, sharps: 3, isMinor: true },
    { key: 'Gm', variants: ['Gm'], index: 7, listIndex: 8, flats: 2, isMinor: true },
    { key: 'G#m', variants: ['G#m', 'Abm'], index: 8, listIndex: 9, sharps: 5, isMinor: true },
    { key: 'Am', variants: ['Am'], index: 9, listIndex: 10, sharps: 0, isMinor: true },
    { key: 'Bbm', variants: ['A#m', 'Bbm'], index: 10, listIndex: 11, flats: 5, isMinor: true },
    { key: 'Bm', variants: ['Bm', 'Cbm'], index: 11, listIndex: 12, sharps: 2, isMinor: true },
  ],
};
