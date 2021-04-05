/* Document for testing transpose logic */

// Variables
let song = new Song();

// Utils
let currentFunc;

// Unit
const assertEqual = (expected, actual) => {
  if (actual !== expected)
    throw new EvalError(
      'Test failed in ' +
        currentFunc +
        '() - expected "\n' +
        expected +
        '\n", but got "\n' +
        actual +
        '\n".'
    );
};

const testChordTranspose = (chordToTranspose, expectedResult) => {
  assertEqual(
    expectedResult,
    song.logicWrapper.transposeChord(chordToTranspose)
  );
};

const setKey = (key) => {
  song.logicWrapper.setKey(key);
};

const setTranspose = (transpose) => {
  song.logicWrapper.setTranspose(transpose);
};

// Correct transposing schema
const correctTranspose = {
  major: {
    C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
    'C#': ['C#', 'D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#dim'],
    Db: ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'],
    D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
    Eb: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
    E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
    F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
    'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim'],
    G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
    Gb: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fbdim'],
    Ab: ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
    A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
    B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
    Bb: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
    Cb: ['Cb', 'Dbm', 'Ebm', 'E', 'Gb', 'Abm', 'Bbdim'],
  },
  minor: {
    Cm: ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
    'C#m': ['C#m', 'D#dim', 'E', 'F#m', 'G#m', 'A', 'B'],
    Dm: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C'],
    'D#m': ['D#m', 'E#dim', 'F#', 'G#m', 'A#m', 'B', 'C#'],
    Ebm: ['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    Em: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'],
    Fm: ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
    'F#m': ['F#m', 'G#dim', 'A', 'Bm', 'C#m', 'D', 'E'],
    Gm: ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
    'G#m': ['G#m', 'A#dim', 'B', 'C#m', 'D#m', 'E', 'F#'],
    Abm: ['Abm', 'Bbdim', 'Cb', 'Dbm', 'Ebm', 'Fb', 'Gb'],
    Am: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
    'A#m': ['A#m', 'B#dim', 'C#', 'D#m', 'E#m', 'F#', 'G#'],
    Bbm: ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    Bm: ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'],
  },
};

const testTransposingOfAllChordsInKey = (key, transpose = 0) => {
  const minor = key.endsWith('m');
  const chordList = minor
    ? correctTranspose.minor[key]
    : correctTranspose.major[key];
  setKey(key);
  setTranspose(transpose);
  const transposedKey = song.logicWrapper.getTransposedKey();
  console.log(transposedKey);
  let assertChordList;
  try {
    assertChordList = minor
      ? correctTranspose.minor[transposedKey]
      : correctTranspose.major[transposedKey];
    console.log(assertChordList);
  } catch (e) {
    throw new Error(
      'Test fails in testTransposingOfAllChordsInKey() - cant get list for new key'
    );
  }
  chordList.forEach((chord, index) => {
    testChordTranspose(chord, assertChordList[index]);
  });
};

const testKeyTranspose = (assertResult) => {
  assertEqual(assertResult, song.logicWrapper.getTransposedKey());
};

// BeforeAll
const beforeAll = () => {};

// BeforeEach
const beforeEach = (funcName) => {
  currentFunc = funcName;
};

// Senario
const testAllTransposingsFromC = () => {
  beforeEach('testAllTransposingsFromC');
  testTransposingOfAllChordsInKey('Cm', 0);
  console.warn('Transpose test base C passed.');
  testTransposingOfAllChordsInKey('C', 1);
  for (let i = -11; i < 20; i++) testTransposingOfAllChordsInKey('C', i);
  for (let i = -11; i < 20; i++) testTransposingOfAllChordsInKey('Cm', i);
};

const testAllKeyTransposingFromC = () => {
  beforeEach('testAllKeyTransposingFromC');
  setKey('C');
  const keyList = song.logicWrapper.keys.map((x) => x.key);
  const length = keyList.length;

  keyList.forEach((key, index) => {
    setTranspose(index);
    testKeyTranspose(key);
    setTranspose(index + length);
    testKeyTranspose(key);
    setTranspose(index - length);
    testKeyTranspose(key);
  });

  console.log('Test "testAllKeyTransposingFromC()" passed.');
};

const testTransposingOfComplexChords = () => {
  beforeEach('testTransposingOfComplexChords');

  const complexChordTests = [{}];
};

const testTransposingOfTemplate = () => {
  beforeEach('testTransposingOfTemplate');
  // Test transpose of template
  const templates = [
    {
      originalKey: 'Dm',
      original: `
Vers:
[Dm]Ren og rettferdig, [Gm/D]himmelen verdig
[Am/D]Er jeg i verdens [Gm/D]Frelser alt [Am/D]nu
[Dm]Ordet forkynner[Dm/C] at mine synder
[Dm/Bb]Kommer han [A]aldri [Dm]mere i hu

Refreng:
[F]Å, jeg er frelst og [C]salig [A/C#]fordi
[Dm]Sønnen har gjort meg [A]virkelig fri 
[Dm]Fri ifra nøden, [Dm/C]dommen og døden 
[Dm/Bb]Amen, [A]hallelu[Dm]ja!
`,
      correctTranspose: [
        {
          transpose: 0,
          transposedTemplate: `
Vers:
[Dm]Ren og rettferdig, [Gm/D]himmelen verdig
[Am/D]Er jeg i verdens [Gm/D]Frelser alt [Am/D]nu
[Dm]Ordet forkynner[Dm/C] at mine synder
[Dm/Bb]Kommer han [A]aldri [Dm]mere i hu

Refreng:
[F]Å, jeg er frelst og [C]salig [A/C#]fordi
[Dm]Sønnen har gjort meg [A]virkelig fri 
[Dm]Fri ifra nøden, [Dm/C]dommen og døden 
[Dm/Bb]Amen, [A]hallelu[Dm]ja!
`,
        },
        {
          transpose: -2,
          transposedTemplate: `
Vers:
[Cm]Ren og rettferdig, [Fm/C]himmelen verdig
[Gm/C]Er jeg i verdens [Fm/C]Frelser alt [Gm/C]nu
[Cm]Ordet forkynner[Cm/Bb] at mine synder
[Cm/Ab]Kommer han [G]aldri [Cm]mere i hu

Refreng:
[Eb]Å, jeg er frelst og [Bb]salig [G/A]fordi
[Cm]Sønnen har gjort meg [G]virkelig fri 
[Cm]Fri ifra nøden, [Cm/Bb]dommen og døden 
[Cm/Ab]Amen, [G]hallelu[Cm]ja!
`,
        },
      ],
    },
  ];

  templates.forEach((template, index) => {
    const testSong = new Song(template.original.trim(), true);
    testSong.logicWrapper.setKey(template.originalKey);
    template.correctTranspose.forEach((element, index) => {
      testSong.logicWrapper.setTranspose(element.transpose);
      assertEqual(
        element.transposedTemplate.trim(),
        testSong.getTransposedChordPro(true)
      );
    });
  });
};

const run = () => {
  beforeAll();
  testAllKeyTransposingFromC();
  testAllTransposingsFromC();
  testTransposingOfComplexChords();
  testTransposingOfTemplate();
  console.log('All tests passed!');
};

run();
