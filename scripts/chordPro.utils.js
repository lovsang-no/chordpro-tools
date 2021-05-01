/**
 * Modified modulo for using with negative numbers.
 *
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

const noteObjectList = [
  {
    halfNotesFromC: 0,
    variants: ['B#', 'C'],
    sharp: ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'B#'],
    flat: ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
    nashville: {
      major: { sharp: '1', flat: '1' },
      minor: { sharp: '1', flat: '1' },
    },
    solfege: {
      major: { sharp: 'Do', flat: 'Do' },
      minor: { sharp: 'La', flat: 'La' },
    },
  },
  {
    halfNotesFromC: 1,
    variants: ['C#', 'Db'],
    sharp: ['C#', 'C#', 'C#', 'C#', 'C#', 'C#', 'C#', 'C#'],
    flat: ['Db', 'Db', 'Db', 'Db', 'Db', 'Db', 'Db', 'Db'],
    nashville: {
      major: { sharp: '1#', flat: '2b' },
      minor: { sharp: '1#', flat: '2b' },
    },
    solfege: {
      major: { sharp: 'Di', flat: 'Ra' },
      minor: { sharp: 'Li', flat: 'Te' },
    },
  },
  {
    halfNotesFromC: 2,
    variants: ['D'],
    sharp: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    flat: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    nashville: {
      major: { sharp: '2', flat: '2' },
      minor: { sharp: '2', flat: '2' },
    },
    solfege: {
      major: { sharp: 'Re', flat: 'Re' },
      minor: { sharp: 'Ti', flat: 'Ti' },
    },
  },
  {
    halfNotesFromC: 3,
    variants: ['D#', 'Eb'],
    sharp: ['D#', 'D#', 'D#', 'D#', 'D#', 'D#', 'D#', 'D#'],
    flat: ['Eb', 'Eb', 'Eb', 'Eb', 'Eb', 'Eb', 'Eb', 'Eb'],
    nashville: {
      major: { sharp: '2#', flat: '3b' },
      minor: { sharp: '3', flat: '3' },
    },
    solfege: {
      major: { sharp: 'Ri', flat: 'Me' },
      minor: { sharp: 'Do', flat: 'Do' },
    },
  },
  {
    halfNotesFromC: 4,
    variants: ['E', 'Fb'],
    sharp: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    flat: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    nashville: {
      major: { sharp: '3', flat: '3' },
      minor: { sharp: '3#', flat: '4b' },
    },
    solfege: {
      major: { sharp: 'Mi', flat: 'Mi' },
      minor: { sharp: 'Di', flat: 'Ra' },
    },
  },
  {
    halfNotesFromC: 5,
    variants: ['E#', 'F'],
    sharp: ['F', 'F', 'F', 'F', 'F', 'F', 'E#', 'E#'],
    flat: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    nashville: {
      major: { sharp: '4', flat: '4' },
      minor: { sharp: '4', flat: '4' },
    },
    solfege: {
      major: { sharp: 'Fa', flat: 'Fa' },
      minor: { sharp: 'Re', flat: 'Re' },
    },
  },
  {
    halfNotesFromC: 6,
    variants: ['F#', 'Gb'],
    sharp: ['F#', 'F#', 'F#', 'F#', 'F#', 'F#', 'F#', 'F#'],
    flat: ['Gb', 'Gb', 'Gb', 'Gb', 'Gb', 'Gb', 'Gb', 'Gb'],
    nashville: {
      major: { sharp: '4#', flat: '5b' },
      minor: { sharp: '4#', flat: '5b' },
    },
    solfege: {
      major: { sharp: 'Fi', flat: 'Se' },
      minor: { sharp: 'Ri', flat: 'Me' },
    },
  },
  {
    halfNotesFromC: 7,
    variants: ['G'],
    sharp: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    flat: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    nashville: {
      major: { sharp: '5', flat: '5' },
      minor: { sharp: '5', flat: '5' },
    },
    solfege: {
      major: { sharp: 'Sol', flat: 'Sol' },
      minor: { sharp: 'Mi', flat: 'Mi' },
    },
  },
  {
    halfNotesFromC: 8,
    variants: ['G#', 'Ab'],
    sharp: ['G#', 'G#', 'G#', 'G#', 'G#', 'G#', 'G#', 'G#'],
    flat: ['Ab', 'Ab', 'Ab', 'Ab', 'Ab', 'Ab', 'Ab', 'Ab'],
    nashville: {
      major: { sharp: '5#', flat: '6b' },
      minor: { sharp: '6', flat: '6' },
    },
    solfege: {
      major: { sharp: 'Si', flat: 'Le' },
      minor: { sharp: 'Fa', flat: 'Fa' },
    },
  },
  {
    halfNotesFromC: 9,
    variants: ['A'],
    sharp: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    flat: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    nashville: {
      major: { sharp: '6', flat: '6' },
      minor: { sharp: '6#', flat: '7b' },
    },
    solfege: {
      major: { sharp: 'La', flat: 'La' },
      minor: { sharp: 'Fi', flat: 'Se' },
    },
  },
  {
    halfNotesFromC: 10,
    variants: ['A#', 'Bb'],
    sharp: ['A#', 'A#', 'A#', 'A#', 'A#', 'A#', 'A#', 'A#'],
    flat: ['Bb', 'Bb', 'Bb', 'Bb', 'Bb', 'Bb', 'Bb', 'Bb'],
    nashville: {
      major: { sharp: '6#', flat: '7b' },
      minor: { sharp: '7', flat: '7' },
    },
    solfege: {
      major: { sharp: 'Li', flat: 'Te' },
      minor: { sharp: 'Sol', flat: 'Sol' },
    },
  },
  {
    halfNotesFromC: 11,
    variants: ['B', 'Cb'],
    sharp: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    flat: ['B', 'B', 'B', 'B', 'B', 'B', 'Cb', 'Cb'],
    nashville: {
      major: { sharp: '7', flat: '7' },
      minor: { sharp: '7b', flat: '1b' },
    },
    solfege: {
      major: { sharp: 'Ti', flat: 'Ti' },
      minor: { sharp: 'Si', flat: 'Le' },
    },
  },
];

const chordObjectTemplate = {
  originalString: '',
  transposeLogic: 'TransposeLogic object',
  root: {
    noteObject: {
      halfNotesFromC: 11,
      variants: ['B', 'Cb'],
    },
    quality: ['', 'B', 'sus3'],
  },
  bass: null,
};

/**
 * Method for get a chord object from a chord string.
 *
 * @param {*} chordString
 * @returns
 */
const chordPartObjectFromString = (chordString) => {
  const regex = /([CDEFGABC][b#]?)/g;

  /* If H change to B */
  if (chordString.startsWith('H'))
    chordString = 'B' + chordString.substr(1, chordString.length);

  /* If chord is invalid */
  if (!chordString.match(regex)) return null;

  const rootNoteFromString = chordString.match(regex)[0];
  const quality = chordString.split(regex)[2];

  if (!rootNoteFromString) console.log('Could not find root note');

  // Find initial chord with matching chord
  for (const noteObject of noteObjectList) {
    for (const noteVariant of noteObject.variants) {
      if (noteVariant === rootNoteFromString) {
        return {
          noteObject: noteObject,
          quality: quality,
        };
      }
    }
  }

  /* If nothing is found */
  return null;
};

/**
 * Method for transposing a chord object.
 *
 * @param {object} chordObject
 * @returns {object} transposed chord object
 */
const transposeChordObject = (chordObject) => {
  const transposeLogic = chordObject.transposeLogic;
  const transposeStep = transposeLogic.transposeStep;
  if (!transposeStep) return chordObject;

  const originalKey = transposeLogic.originalKeyObject;
  const currentKey = transposeLogic.currentKeyObject;

  const transposeLength = modifiedModulo(
    currentKey.index - originalKey.index,
    noteObjectList.length
  );

  /* Transpose root and bass note */
  const oldRootNoteObject = chordObject.root?.noteObject;
  const oldBassNoteObject = chordObject.bass?.noteObject;
  let newRootNoteObject = undefined;
  let newBassNoteObject = undefined;
  if (oldRootNoteObject)
    newRootNoteObject = transposeNoteObject(oldRootNoteObject, transposeLength);
  if (oldBassNoteObject)
    newBassNoteObject = transposeNoteObject(oldBassNoteObject, transposeLength);

  return {
    ...chordObject,
    root: chordObject.root
      ? { ...chordObject.root, noteObject: newRootNoteObject }
      : null,
    bass: chordObject.bass
      ? { ...chordObject.bass, noteObject: newBassNoteObject }
      : null,
  };
};

/**
 * Method for transposing noteObject with a index.
 *
 * @param {object} originalNoteObject
 * @param {number} transposeLength
 * @returns {object} transposed note object
 */
const transposeNoteObject = (originalNoteObject, transposeLength) => {
  const newIndex = modifiedModulo(
    originalNoteObject.halfNotesFromC + transposeLength,
    noteObjectList.length
  );

  return noteObjectList[newIndex];
};

/**
 * Method for displaying a chord object as string.
 *
 * @param {object} chordObject - Chord object to show as string
 * @returns {string} Chord as string
 */
const chordObjectToString = (chordObject) => {
  if (!chordObject.transposeLogic?.transposeStep)
    return chordObject.originalString;
  let resultString = '';

  const root = chordObject.root;
  const rootNoteObject = root?.noteObject;
  const bass = chordObject.bass;
  const bassNoteObject = bass?.noteObject;

  let useFlat = chordObject.transposeLogic.currentKeyObject.flats !== undefined;

  const keyObject = chordObject.transposeLogic.currentKeyObject;
  const keySharps = keyObject.sharps;
  const keyFlats = keyObject.flats;

  if (root) {
    const rootNoteString = useFlat
      ? rootNoteObject.flat[keyFlats]
      : rootNoteObject.sharp[keySharps];

    resultString += rootNoteString + root.quality;
  }
  if (bass) {
    const bassNoteString = useFlat
      ? bassNoteObject.flat[keyFlats]
      : bassNoteObject.sharp[keySharps];
    resultString += '/' + bassNoteString + bass.quality;
  }

  return resultString;
};

/**
 * Method for getting a nashville string from chord object.
 *
 * @param {object} chordObject - Chord object to show as string
 * @returns {string} Chord as nashville string
 */
const chordObjectToNashvilleString = (chordObject) => {
  /* Transpose to C */
  const transposeBy = chordObject.transposeLogic.currentKeyObject.listIndex;
  chordObject.transposeLogic.transposeDown(transposeBy);
  chordObject = transposeChordObject(chordObject);

  let resultString = '';

  const oldRoot = chordObject.root;
  const oldBass = chordObject.bass;

  const isMinor = chordObject.transposeLogic.currentKeyObject.isMinor;
  const useFlat = chordObject.transposeLogic.currentKeyObject.isBKey;

  if (isMinor) {
    if (oldRoot) {
      const nasvhilleRoot = useFlat
        ? oldRoot.noteObject.nashville.minor.flat
        : oldRoot.noteObject.nashville.minor.sharp;
      resultString += nasvhilleRoot + chordObject.root.quality;
    }
    if (oldBass) {
      const nasvhilleBass = useFlat
        ? oldBass.noteObject.nashville.minor.flat
        : oldBass.noteObject.nashville.minor.sharp;
      resultString += '/' + nasvhilleBass + chordObject.bass.quality;
    }
  } else {
    if (oldRoot) {
      const nasvhilleRoot = useFlat
        ? oldRoot.noteObject.nashville.major.flat
        : oldRoot.noteObject.nashville.major.sharp;
      resultString += nasvhilleRoot + chordObject.root.quality;
    }
    if (oldBass) {
      const nasvhilleBass = useFlat
        ? oldBass.noteObject.nashville.major.flat
        : oldBass.noteObject.nashville.major.sharp;
      resultString += '/' + nasvhilleBass + chordObject.bass.quality;
    }
  }

  return resultString;
};

/**
 * Method for getting a solfege string from chord object.
 *
 * @param {object} chordObject - Chord object to show as string
 * @returns {string} Chord as nashville string
 */
const chordObjectToSolfegeString = (chordObject) => {
  /* Transpose to C */
  const transposeBy = chordObject.transposeLogic.currentKeyObject.listIndex;
  chordObject.transposeLogic.transposeDown(transposeBy);
  chordObject = transposeChordObject(chordObject);

  let resultString = '';

  const oldRoot = chordObject.root;
  const oldBass = chordObject.bass;

  const isMinor = chordObject.transposeLogic.currentKeyObject.isMinor;
  const useFlat = chordObject.transposeLogic.currentKeyObject.isBKey;

  if (isMinor) {
    if (oldRoot) {
      const nasvhilleRoot = useFlat
        ? oldRoot.noteObject.solfege.minor.flat
        : oldRoot.noteObject.solfege.minor.sharp;
      resultString += nasvhilleRoot + chordObject.root.quality;
    }
    if (oldBass) {
      const nasvhilleBass = useFlat
        ? oldBass.noteObject.solfege.minor.flat
        : oldBass.noteObject.solfege.minor.sharp;
      resultString += '/' + nasvhilleBass + chordObject.bass.quality;
    }
  } else {
    if (oldRoot) {
      const nasvhilleRoot = useFlat
        ? oldRoot.noteObject.solfege.major.flat
        : oldRoot.noteObject.solfege.major.sharp;
      resultString += nasvhilleRoot + chordObject.root.quality;
    }
    if (oldBass) {
      const nasvhilleBass = useFlat
        ? oldBass.noteObject.solfege.major.flat
        : oldBass.noteObject.solfege.major.sharp;
      resultString += '/' + nasvhilleBass + chordObject.bass.quality;
    }
  }

  return resultString;
};
