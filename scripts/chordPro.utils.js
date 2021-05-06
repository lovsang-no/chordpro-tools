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
      major: { sharp: 'DO', flat: 'DO' },
      minor: { sharp: 'LA', flat: 'LA' },
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
      major: { sharp: 'DI', flat: 'RA' },
      minor: { sharp: 'LI', flat: 'TE' },
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
      major: { sharp: 'RE', flat: 'RE' },
      minor: { sharp: 'TI', flat: 'TI' },
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
      major: { sharp: 'RI', flat: 'ME' },
      minor: { sharp: 'DO', flat: 'DO' },
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
      major: { sharp: 'MI', flat: 'MI' },
      minor: { sharp: 'DI', flat: 'RA' },
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
      major: { sharp: 'FA', flat: 'FA' },
      minor: { sharp: 'RE', flat: 'RE' },
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
      major: { sharp: 'FI', flat: 'SE' },
      minor: { sharp: 'RI', flat: 'ME' },
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
      major: { sharp: 'SOL', flat: 'SOL' },
      minor: { sharp: 'MI', flat: 'MI' },
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
      major: { sharp: 'SI', flat: 'LE' },
      minor: { sharp: 'FA', flat: 'FA' },
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
      major: { sharp: 'LA', flat: 'LA' },
      minor: { sharp: 'FI', flat: 'SE' },
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
      major: { sharp: 'LI', flat: 'TE' },
      minor: { sharp: 'SOL', flat: 'SOL' },
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
      major: { sharp: 'TI', flat: 'TI' },
      minor: { sharp: 'SI', flat: 'LE' },
    },
  },
];

/* F R O M   S T R I N G   S T A R T */

/**
 * Method for get a chord object from a chord string.
 *
 * @param {string} chordString
 * @returns
 */
const chordPartObjectFromString = (chordString) => {
  const regex = /([CDEFGABC][b#]?)/g;

  /* If H change to B */
  if (chordString.startsWith('H'))
    chordString = 'B' + chordString.substr(1, chordString.length);

  /* If chord is invalid */
  if (!chordString.match(regex))
    throw new EvalError('Chord string does not match regex.');

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
  throw new Error('No chord is found. Rare case. Try again.');
  return null;
};

/**
 * Method for generating a chord object from a chord string.
 *
 * @param {string} chordString
 * @param {object} transposeLogic
 * @throws EvalError if chord string does not match regex
 * @returns
 */
const newChordObjectFromString = (chordString, transposeLogic) => {
  const chordParts = chordString.split('/');
  const rootChordString = chordParts[0];
  const bassChordString = chordParts[1];

  const root = rootChordString
    ? chordPartObjectFromString(rootChordString)
    : null;
  const bass = bassChordString
    ? chordPartObjectFromString(bassChordString)
    : null;

  return {
    root,
    bass,
    originalString: chordString,
    transposeLogic,
  };
};

/* F R O M   S T R I N G   E N D */

/* T R A N S P O S E   L O G I C   S T A R T */

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

/* T R A N S P O S E   L O G I C   E N D */

/* T O   S T R I N G   S T A R T */

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
 * Method transposing and returning chord object as string.
 *
 * @param {object} chordObject
 * @returns
 */
const chordObjectToTransposedString = (chordObject) =>
  chordObjectToString(transposeChordObject(chordObject));

/**
 * Method for displaying a chord objects original string.
 *
 * @param {object} chordObject - Chord object to show as string
 * @returns {string} Chord as string
 */
const chordObjectToOriginalString = (chordObject) => chordObject.originalString;
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

const chordObjectToStringBasedOnDisplayType = (chordObject, displayType) => {
  switch (displayType) {
    case DISPLAY_CHORDS:
      return chordObjectToTransposedString(chordObject);
    case DISPLAY_NASHVILLE:
      return chordObjectToNashvilleString(chordObject);
    case DISPLAY_SOLFEGE:
      return chordObjectToSolfegeString(chordObject);
    default:
      return chordObjectToTransposedString(chordObject);
  }
};

/* T O   S T R I N G   E N D */

const aha = {
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
  originalString: 'Dm',
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
};
