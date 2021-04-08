const assertEqualLineByLine = (expected, actual, lineBreak = '\n') => {
  const actualList = actual.split(lineBreak);
  if (expected.split(lineBreak).length !== actualList.length) {
    throw new EvalError(
      'Test failed in ' +
        currentFunc +
        '() - expected equal length, but got unequal amount of lines'
    );
  }

  expected.split(lineBreak).forEach((expectedLine, index) => {
    assertEqual(expectedLine, actualList[index]);
  });
};

/* Tests */
const testThatNothingChangesWhenConvertingFromCorrectCp = () => {
  beforeEach('testThatNothingChangesWhenConvertingFromCp');

  const testList = [
    `
      Vers 1:
      [G]Hvem kan lyse opp min sti
      Som en [Am]lykt for min f[Em]ot
      Gjøre natten om til dag
      Og gi meg nytt [D]mot
      
      Bro:
      [Bm]Du ga meg alt
      [D/F#]All min [G]skyld er betalt
      [Am]Mine [Bm]synder ble båret av [D]deg
      
      Ord blir for små
      Hvem kan fullt ut forstå
      Hvilken godhet du øste på meg`,
    `
      Gi meg Jesus
      David André Østby
      Album: Hele Himmelen
      Published: 2018
      Copyright: David André Østby, Stig-Øyvind Blystad & Vetle Jarandsen
      Key: G
      Tempo: 80
      Time: 4/4
      T/m: David André Østby, Stig-Øyvind Blystad & Vetle Jarandsen
      Web: www.davidostby.no
      
      [|] [G] [.] [.] [.] [|] [D] [.] [.] [.] [|] [Am] [.] [.] [.] [|] [C] [.] [.] [.] [|] [x2]
      
      Vers 1:
      [G]Hvem kan lyse opp min sti
      Som en [Am]lykt for min f[Em]ot
      Gjøre natten om til dag
      Og gi meg nytt [D]mot
      
      Bro:
      [Bm]Du ga meg alt
      [D/F#]All min [G]skyld er betalt
      [Am]Mine [Bm]synder ble båret av [D]deg
      
      Ord blir for små
      Hvem kan fullt ut forstå
      Hvilken godhet du øste på meg`,
  ];

  testList.forEach((testTemplate) => {
    const expected = superTrim(testTemplate);
    const actual = sheetToCp(expected, true);

    assertEqualLineByLine(expected, actual);
  });
};

const testExpectedConversionWhenConvertingFromSheet = () => {
  beforeEach('testExpectedConversionWhenConvertingFromSheet');

  const testList = [
    {
      /* Correct trimming and placing of chords */
      pre: `

        Vers 1:
        G
        Hvem kan lyse opp min sti
               Am            Em
        Som en lykt for min fot
        Gjøre natten om til dag
                       D
        Og gi meg nytt mot
        
        Bro:
        [Bm]Du ga meg alt
        [D/F#]All min [G]skyld er betalt
        [Am]Mine [Bm]synder ble båret av [D]deg
        
        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg



      `,
      expectedResult: `
        Vers 1:
        [G]Hvem kan lyse opp min sti
        Som en [Am]lykt for min f[Em]ot
        Gjøre natten om til dag
        Og gi meg nytt [D]mot

        Bro:
        [Bm]Du ga meg alt
        [D/F#]All min [G]skyld er betalt
        [Am]Mine [Bm]synder ble båret av [D]deg

        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg`,
    },
    {
      /* Only one line between each section */
      pre: `
        Vers 1:
        G
        Hvem kan lyse opp min sti
               Am            Em
        Som en lykt for min fot
        Gjøre natten om til dag
                       D
        Og gi meg nytt mot
        

        Bro:
        Bm
        Du ga meg alt
        D/F#    G
        All min skyld er betalt
        Am   Bm                  D
        Mine synder ble båret av deg
        

        
        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg`,
      expectedResult: `
        Vers 1:
        [G]Hvem kan lyse opp min sti
        Som en [Am]lykt for min f[Em]ot
        Gjøre natten om til dag
        Og gi meg nytt [D]mot

        Bro:
        [Bm]Du ga meg alt
        [D/F#]All min [G]skyld er betalt
        [Am]Mine [Bm]synder ble båret av [D]deg

        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg`,
    },
    {
      /* Only one line between each section */
      pre: `
        Heisann du
        Jadå jadå
        Key: A

        Vers 1:
        G
        Hvem kan lyse opp min sti
               Am            Em
        Som en lykt for min fot
        Gjøre natten om til dag
                       D
        Og gi meg nytt mot
        

        Bro:
        Bm
        Du ga meg alt
        D/F#    G
        All min skyld er betalt
        Am   Bm                  D
        Mine synder ble båret av deg
        


        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg`,
      expectedResult: `
        Heisann du
        Jadå jadå
        Key: A
        
        Vers 1:
        [G]Hvem kan lyse opp min sti
        Som en [Am]lykt for min f[Em]ot
        Gjøre natten om til dag
        Og gi meg nytt [D]mot

        Bro:
        [Bm]Du ga meg alt
        [D/F#]All min [G]skyld er betalt
        [Am]Mine [Bm]synder ble båret av [D]deg

        Ord blir for små
        Hvem kan fullt ut forstå
        Hvilken godhet du øste på meg`,
    },
  ];

  testList.forEach((testElement) => {
    const expected = superTrim(testElement.expectedResult);
    const actual = sheetToCp(testElement.pre, true);

    assertEqualLineByLine(expected, actual);
  });
};

const testOneLineConversion = () => {
  beforeEach('testOneLineConversion');

  const testList = [
    {
      pre: `A
      `,
      expectedResult: `[A]`,
    },
    {
      pre: `A | B
      `,
      expectedResult: `[A] [|] [B]`,
    },
    {
      pre: `Asus | Bm ...Am
      `,
      expectedResult: `[Asus] [|] [Bm] [.] [.] [.] [Am]`,
    },
    {
      pre: `Asus |     Bm ..      .Am
      `,
      expectedResult: `[Asus] [|] [Bm] [.] [.] [.] [Am]`,
    },
    {
      pre: `
        Asus |     Bm ..      .Am |
        Asus |     Bm ..      .Am |
      `,
      expectedResult: `
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]`,
    },
    {
      pre: `
        Intro:
        Asus |     Bm ..      .Am |
        Asus |     Bm ..      .Am |
      `,
      expectedResult: `
        Intro:
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]`,
    },
    {
      pre: `
        Intro:
        Repeat twice
        Asus |     Bm ..      .Am |
        Asus |     Bm ..      .Am |
      `,
      expectedResult: `
        Intro:
        Repeat twice
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]`,
    },
    {
      pre: `
        Intro:
        Asus |     Bm ..      .Am |
        Repeat twice
        Asus |     Bm ..      .Am |


        
      `,
      expectedResult: `
        Intro:
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]
        Repeat twice
        [Asus] [|] [Bm] [.] [.] [.] [Am] [|]`,
    },
    {
      pre: `[Asus] [|] [Hm] [.] [.] [.] [Am] [|]`,
      expectedResult: `[Asus] [|] [Hm] [.] [.] [.] [Am] [|]`,
    },
  ];

  testList.forEach((testElement) => {
    const expected = superTrim(testElement.expectedResult);
    const actual = sheetToCp(testElement.pre, true);

    assertEqualLineByLine(expected, actual);
  });
};

const runSheetToCpTests = () => {
  testThatNothingChangesWhenConvertingFromCorrectCp();
  testExpectedConversionWhenConvertingFromSheet();
  testOneLineConversion();
  console.warn('All tests passed! (sheetToCpTest.js)');
};

runSheetToCpTests();
