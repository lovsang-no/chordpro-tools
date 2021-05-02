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
  major: [
    { key: 'C', index: 0, listIndex: 0, sharps: 0 },
    { key: 'C#', index: 1, listIndex: 1, sharps: 7 }, // under tvil
    { key: 'Db', index: 1, listIndex: 2, flats: 5 },
    { key: 'D', index: 2, listIndex: 3, sharps: 2 },
    { key: 'Eb', index: 3, listIndex: 4, flats: 3 },
    { key: 'E', index: 4, listIndex: 5, sharps: 4 },
    { key: 'F', index: 5, listIndex: 6, flats: 1 },
    { key: 'F#', index: 6, listIndex: 7, sharps: 6 },
    { key: 'Gb', index: 6, listIndex: 8, flats: 6 },
    { key: 'G', index: 7, listIndex: 9, sharps: 1 },
    { key: 'Ab', index: 8, listIndex: 10, flats: 4 },
    { key: 'A', index: 9, listIndex: 11, sharps: 3 },
    { key: 'Bb', index: 10, listIndex: 12, flats: 2 },
    { key: 'B', index: 11, listIndex: 13, sharps: 5 },
  ],
  minor: [
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
};
