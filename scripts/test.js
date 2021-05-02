/* Document for testing transpose logic */

// Variables
const song = new Song();

// Utils
let currentFunc;

const superTrim = (s) => {
  const lineList = s.split('\n');

  do {
    if (lineList[0].trim()) break;
    lineList.shift();
  } while (lineList.length);

  const line = lineList[0];
  const chars = line.split('');
  let spacesCount = 0;

  for (const char of chars) {
    if (char.trim()) break;
    spacesCount++;
  }

  return lineList.map((e) => e.substring(spacesCount)).join('\n');
};

// Unit
const assertEqual = (expected, actual, input = '') => {
  if (actual !== expected)
    throw new EvalError(
      'Test failed in ' +
        currentFunc +
        '(' +
        input +
        ') - expected "\n' +
        expected +
        '\n", but got "\n' +
        actual +
        '\n".'
    );
};

const assertEqualLineByLine = (
  expected,
  actual,
  input = '',
  lineBreak = '\n'
) => {
  const actualList = actual.split(lineBreak);
  if (expected.split(lineBreak).length !== actualList.length) {
    throw new EvalError(
      'Test failed in ' +
        currentFunc +
        '(' +
        input +
        ') - expected equal length, but got unequal amount of lines'
    );
  }

  expected.split(lineBreak).forEach((expectedLine, index) => {
    assertEqual(expectedLine, actualList[index], input);
  });
};

const testChordTranspose = (chordToTranspose, expectedResult, input = '') => {
  chordToTranspose = new Chord(chordToTranspose, song.logicWrapper);
  assertEqual(
    expectedResult,
    chordObjectToString(transposeChordObject(chordToTranspose), input)
  );
};

const setKey = (key) => {
  song.logicWrapper.setKey(key);
};

const setTranspose = (transpose) => {
  song.logicWrapper.setTranspose(transpose);
};

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
    Gb: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'],
    Ab: ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
    A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
    B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
    Bb: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
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
    Am: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
    'A#m': ['A#m', 'B#dim', 'C#', 'D#m', 'E#m', 'F#', 'G#'],
    Bbm: ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    Bm: ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'],
  },
};

const testTransposingOfAllChordsInKey = (key, transpose = 0) => {
  beforeEach('testTransposingOfAllChordsInKey(key: ' + key + ')');
  const minor = key.endsWith('m');
  const chordList = minor
    ? correctTranspose.minor[key]
    : correctTranspose.major[key];

  setKey(key);
  setTranspose(transpose);
  const transposedKey = song.logicWrapper.getTransposedKey();
  let assertChordList;
  try {
    assertChordList = minor
      ? correctTranspose.minor[transposedKey]
      : correctTranspose.major[transposedKey];
  } catch (e) {
    throw new Error(
      'Test fails in testTransposingOfAllChordsInKey(' +
        key +
        ') - cant get list for new key'
    );
  }
  chordList.forEach((chord, index) => {
    testChordTranspose(
      chord,
      assertChordList[index],
      chord + ', ' + transpose + ', key: ' + key
    );
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
  for (let i = -11; i < 20; i++) testTransposingOfAllChordsInKey('D', i);
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

  const complexChordTestElementStructure = {
    key: '',
    tests: [
      {
        chord: '',
        transposings: [{ transpose: 0, correctTransposedChord: '' }],
      },
    ],
  };

  const complexChordTests = [
    {
      key: 'C',
      tests: [
        {
          chord: 'Cmsus4',
          transposings: [
            { transpose: 1, correctTransposedChord: 'C#msus4' },
            { transpose: 7, correctTransposedChord: 'F#msus4' },
          ],
        },
      ],
    },
  ];

  complexChordTests.forEach((complexChordTest) => {
    song.logicWrapper.setKey(complexChordTest.key);

    complexChordTest.tests.forEach((test) => {
      test.transposings.forEach((transposing) => {
        if (transposing.debug) debugger;
        song.logicWrapper.setTranspose(transposing.transpose);
        const logState = transposing.correctTransposedChord === '';
        assertEqual(
          transposing.correctTransposedChord,
          chordObjectToString(
            transposeChordObject(
              new Chord(test.chord, song.logicWrapper),
              logState
            )
          ),
          test.chord +
            ', ' +
            transposing.transpose +
            ', key: ' +
            complexChordTest.key
        );
      });
    });
  });
};

const testTransposingOfTemplate = () => {
  beforeEach('testTransposingOfTemplate');
  // Test transpose of template
  const templates = [
    // Test 1:
    {
      originalKey: 'Dm',
      original: `
Vers:
[Dm]Ren og rettferdig, [Gm/D]himmelen verdig
[Am/D]Er jeg i verdens [Gm/D]Frelser alt [Am/D]nu
[Dm]Ordet forkynner[Dm/C] at mine synder
[Dm/Bb]Kommer han [A]aldri [Dm]mere i hu

Refreng:
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
[Cm]Sønnen har gjort meg [G]virkelig fri
[Cm]Fri ifra nøden, [Cm/Bb]dommen og døden
[Cm/Ab]Amen, [G]hallelu[Cm]ja!
`,
        },
      ],
    },
    // Test 2 - Diverse akkorder
    {
      originalKey: 'Dm',
      original: `
Vers:
[Dsus4/E]Ren og rettferdig, [Gmadd9/D]himmelen verdig
[Fm/Gb]Er jeg i verdens [Gm/D]Frelser alt [Am/D]nu
[Dm]Ordet forkynner[Dm/C] at mine synder
[Dm/Bb]Kommer han [Amaj7]aldri [Eb6]mer[C]a[D]a[E]a[F]a[G]a[A]a[Bb]a[Cb]a[Db]a[Eb]a[Fb]a[Gb]a[Ab]e i hu

Refreng:
[F]Å, jeg er frelst og [C]salig [A/C#]fordi
[Dm]Sønnen har gjort meg [A]virkelig fri
[Dm]Fri ifra nøden, [Dm/C]dommen og døden
[Dm/Bb]Amen, [Amaj7]hallelu[Dm]ja!
`,
      correctTranspose: [
        {
          transpose: 0,
          transposedTemplate: `
Vers:
[Dsus4/E]Ren og rettferdig, [Gmadd9/D]himmelen verdig
[Fm/Gb]Er jeg i verdens [Gm/D]Frelser alt [Am/D]nu
[Dm]Ordet forkynner[Dm/C] at mine synder
[Dm/Bb]Kommer han [Amaj7]aldri [Eb6]mer[C]a[D]a[E]a[F]a[G]a[A]a[Bb]a[Cb]a[Db]a[Eb]a[Fb]a[Gb]a[Ab]e i hu

Refreng:
[F]Å, jeg er frelst og [C]salig [A/C#]fordi
[Dm]Sønnen har gjort meg [A]virkelig fri
[Dm]Fri ifra nøden, [Dm/C]dommen og døden
[Dm/Bb]Amen, [Amaj7]hallelu[Dm]ja!
`,
        },
        {
          transpose: -2,
          transposedTemplate: `
Vers:
[Csus4/D]Ren og rettferdig, [Fmadd9/C]himmelen verdig
[Ebm/E]Er jeg i verdens [Fm/C]Frelser alt [Gm/C]nu
[Cm]Ordet forkynner[Cm/Bb] at mine synder
[Cm/Ab]Kommer han [Gmaj7]aldri [Db6]mer[Bb]a[C]a[D]a[Eb]a[F]a[G]a[Ab]a[A]a[B]a[Db]a[D]a[E]a[Gb]e i hu

Refreng:
[Eb]Å, jeg er frelst og [Bb]salig [G/B]fordi
[Cm]Sønnen har gjort meg [G]virkelig fri
[Cm]Fri ifra nøden, [Cm/Bb]dommen og døden
[Cm/Ab]Amen, [Gmaj7]hallelu[Cm]ja!
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
      assertEqualLineByLine(
        element.transposedTemplate.trim(),
        testSong.getTransposedChordPro(true),
        template.original + ', ' + element.transpose
      );
    });
  });
};

const transposeOnelinersAndPrint = () => {
  beforeEach('transposeOnelinersAndPrint');
  testList = [
    {
      key: 'Dm',
      original: `[Cm/Ab] [Gmaj7] [Db6] [Bb] [C] [D] [Eb] [F] [G] [Ab] [A] [B] [Db] [D] [E] [Gb]`,
    },
  ];

  testList.forEach((testElement, index) => {
    const testSong = new Song(testElement.original, true);
    testSong.logicWrapper.setKey(testElement.key);

    console.warn('transposeOnelinersAndPrint()');
    const buffer = [];
    for (let i = -4; i < 13; i++) {
      testSong.logicWrapper.setTranspose(i);
      buffer.push(
        testSong.logicWrapper.getTransposedKey() +
          ',' +
          i +
          ',' +
          testSong
            .getTransposedChordPro(true)
            .replaceAll('] [', ',')
            .replace('[', '')
            .replace(']', '')
      );
    }
    console.log(buffer.join('\n'));
  });
};

const run = () => {
  beforeAll();
  testAllKeyTransposingFromC();
  testAllTransposingsFromC();
  testTransposingOfComplexChords();
  testTransposingOfTemplate();
  //  transposeOnelinersAndPrint();
  console.warn('All tests passed!');
};

run();

const song2 = new SongEdit(templateTest);
