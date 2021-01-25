const getHelperStyles = () => {
  const styles = `
  .cp-meta-wrapper {
    position: relative;
    margin: 0;
    border: 1px solid lightgray;
  }
  
  .cp-meta-wrapper::before {
    content: 'META-DATA';
    color: #cf9338;
    position: absolute;
    top: -1.5em;
    font-size: 0.7em;
    font-weight: bold;
  }
  
  .cp-section {
    position: relative;
    margin: 0;
    border: 1px solid lightgray;
  }
  
  .cp-section::before {
    content: 'SANG-SEKSJON';
    color: #cf9338;
    position: absolute;
    top: -1.5em;
    font-size: 0.7em;
    font-weight: bold;
  }
  
  .cp-song-title::after {
    content: 'TITTEL';
    color: #cf9338;
    margin-left: 1.3em;
    font-size: 0.7em;
    font-weight: bold;
  }
  
  .cp-song-artist::after {
    content: 'ARTIST';
    color: #cf9338;
    margin-left: 1.3em;
    font-size: 0.7em;
    font-weight: bold;
  }
  
  .cp-heading::after {
    content: 'SEKSJON-NAVN';
    color: #cf9338;
    margin-left: 1.3em;
    font-size: 0.7em;
    font-weight: bold;
  }
  `;
  const styleElement = newElement('STYLE');
  styleElement.innerHTML = styles;
  return styleElement;
};

class SongEdit extends Song {
  parseToTarget(target, parseTable = true, plainText = false) {
    if (!target) {
      console.error('No target is set');
      return;
    }
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
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
      if (this.logicWrapper?.currentKey) {
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
      } else if (!this.logicWrapper.key) {
        mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-no-key'));
      } else {
        mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-key-error'));
      }
    } else {
      mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-welcome'));
    }
    target.innerHTML = mainBuffer.join('\n');
    /* Append to target */
  }

  parseTransposedChordPro() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title) metaBuffer.push(this.metadata.title);
      if (this.metadata.artist) metaBuffer.push(this.metadata.artist);
      if (this.logicWrapper.currentKey)
        metaBuffer.push('Key: ' + this.logicWrapper.currentKey);
      if (this.metadata.tempo) metaBuffer.push('Tempo: ' + this.metadata.tempo);
      if (this.metadata.time) metaBuffer.push('Time: ' + this.metadata.time);
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push(key + ': ' + value);
      }
      mainBuffer.push(metaBuffer.join('\n'));
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKey) {
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
      return mainBuffer.join('\n');
    }
  }

  parsePlainText() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title) metaBuffer.push(this.metadata.title);
      if (this.metadata.artist) metaBuffer.push(this.metadata.artist);
      if (this.logicWrapper.currentKey)
        metaBuffer.push('Key: ' + this.logicWrapper.currentKey);
      if (this.metadata.tempo) metaBuffer.push('Tempo: ' + this.metadata.tempo);
      if (this.metadata.time) metaBuffer.push('Time: ' + this.metadata.time);
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push(key + ': ' + value);
      }
      mainBuffer.push(metaBuffer.join('\n'));
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
          mainBuffer.push('');
          if (section.title) mainBuffer.push(section.title);
          section.lines?.forEach((line) => {
            let lineBuffer = [];
            switch (line.TYPE) {
              case 'ONELINE':
                lineBuffer = [];
                line.oneLine.forEach((e) => {
                  if (e instanceof Chord) lineBuffer.push(e.transposedChord());
                  else lineBuffer.push(e);
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                let chordLine = '';
                let lyricsLine = '';
                line.pairs.forEach((pair) => {
                  let chordO = pair.chord;
                  let lyrics = pair.lyrics;
                  if (chordO) {
                    let chord = chordO.transposedChord();
                    chordLine +=
                      chord +
                      spaces(
                        Math.max(
                          1,
                          (pair.lyrics ? pair.lyrics.length : 0) - chord.length
                        )
                      );
                  } else {
                    chordLine += spaces(pair.lyrics.length);
                  }
                  if (pair.lyrics) {
                    lyricsLine +=
                      lyrics +
                      spaces(
                        Math.max(
                          0,
                          chordO?.transposedChord().length - lyrics.length
                        )
                      );
                  }
                });
                lineBuffer.push(chordLine);
                lineBuffer.push(lyricsLine);
                mainBuffer.push(lineBuffer.join('\n'));
            }
          });
        });
      }
      return mainBuffer.join('\n');
    }
    /* Append to target */
  }
}

const genInputBoxes = (...classes) => {
  const boxValues = [
    {
      name: 'cpInput',
      placeholder: `Tittel...`,
      label: 'ChordPro',
    },
    {
      name: 'sheetInput',
      placeholder: `Tittel...`,
      label: 'Akkorder over tekst',
    },
  ];

  const boxesObj = [];

  boxValues.forEach((boxValues) => {
    const textarea = newElement('TEXTAREA', ...classes);
    textarea.name = boxValues.name;
    textarea.id = boxValues.name;
    textarea.placeholder = boxValues.placeholder;

    const boxContent = newElement('DIV', 'box-content');
    boxContent.appendChild(textarea);
    const boxLabel = newElement('DIV', 'box-label');
    boxLabel.innerHTML = boxValues.label;

    const box = newElement('DIV', 'box', 'h100');
    box.appendChild(boxLabel);
    box.appendChild(boxContent);

    const label = newElement('LABEL', 'label');
    label.for = boxValues.name;

    label.appendChild(box);

    boxesObj.push({ DOMElement: label, textarea: textarea });
  });

  return boxesObj;
};

const genResultBox = () => {
  const boxValue = {
    name: 'result',
    placeholder: 'Her kommer forhåndsvisning',
    label: 'Forhåndsvisning',
  };

  const controlsWrapper = newElement('DIV', 'flex-h');
  const resultDiv = newElement('DIV', 'flex-grow', 'w100', 'result-wrapper');

  const boxContent = newElement(
    'DIV',
    'box-content',
    'flex-v',
    'overflow-scroll'
  );
  boxContent.appendChild(controlsWrapper);
  boxContent.appendChild(resultDiv);
  const boxLabel = newElement('DIV', 'box-label');
  boxLabel.innerHTML = boxValue.label;

  const showDetailsButton = newElement('a');
  const hideDetailsButton = newElement('a');
  showDetailsButton.innerHTML = 'Vis detaljer';
  hideDetailsButton.innerHTML = 'Skjul detaljer';
  boxLabel.appendChild(showDetailsButton);
  boxLabel.appendChild(hideDetailsButton);
  const styleElement = getHelperStyles();
  document.head.appendChild(styleElement);
  showDetailsButton.style.display = 'none';
  showDetailsButton.onclick = () => {
    showDetailsButton.style.display = 'none';
    hideDetailsButton.style.display = 'inline-block';
    document.head.appendChild(styleElement);
  };
  hideDetailsButton.onclick = () => {
    showDetailsButton.style.display = 'inline-block';
    hideDetailsButton.style.display = 'none';
    document.head.removeChild(styleElement);
  };

  const box = newElement('DIV', 'box', 'h100');
  box.appendChild(boxLabel);
  box.appendChild(boxContent);

  return {
    DOMelement: box,
    resultDiv: resultDiv,
  };
};

const generateFileName = (textareaValue) => {
  const lines = textareaValue.split('\n');
  return (
    lines[0] + ' - ' + lines[1] + ' (' + lines[2].split(':')[1].trim() + ')'
  );
};

const saveTextAsFile = (textToWrite) => {
  /* Source: https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file/42864235  */
  const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
  const fileNameToSaveAs = generateFileName(textToWrite) + '.txt'; //filename.extension

  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  if (window.webkitURL !== null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
};

const newButton = (text) => {
  const buttonWrapper = newElement('DIV', 'button-wrapper');
  const button = newElement('BUTTON');
  button.innerHTML = text;

  buttonWrapper.appendChild(button);

  return { wrapper: buttonWrapper, button: button };
};

const exampleContent = `Gi meg Jesus
David André Østby
Key: G
Tempo: 82
Time: 4/4

[|] [G] [-] [-] [-] [|] [D] [-] [-] [-] [|] [Am] [-] [-] [-] [|] [C] [-] [-] [-] [|] [x2]

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
Hvilken godhet du øste på meg
`;

const exampleHoldUserContent = { cp: '' };

const genLayout = (target) => {
  const appWrapper = newElement('DIV', 'main-wrapper');

  const backgroundOverlay = newElement('DIV', 'background-overlay');
  appWrapper.appendChild(backgroundOverlay);

  const header = newElement('HEADER');
  const titleH1 = `<h1>Lag blekke</h1>`;
  header.innerHTML += titleH1;
  const gitHubIcon = `<a
  href="https://github.com/mholta"
  target="_blank"
  rel="noopener noreferrer"
  class="github-icon"
  ><i class="fab fa-github"></i
></a>`;
  header.innerHTML += gitHubIcon;

  appWrapper.appendChild(header);

  const form = newElement('FORM', '');
  form.name = 'form';
  form.onsubmit = (e) => {
    e.preventDefault();
  };

  const downloadButton = newElement('BUTTON');
  downloadButton.innerHTML = 'Last ned ChordPro som .txt';

  const controlsWrapper = newElement('BUTTON', 'controls-wrapper');
  const transposeUpButton = newElement('BUTTON');
  const transposeDownButton = newElement('BUTTON');
  controlsWrapper.appendChild(transposeUpButton);
  controlsWrapper.appendChild(transposeDownButton);
  transposeUpButton.innerHTML = '+';
  transposeDownButton.innerHTML = '-';

  const boxesWrapper = newElement('DIV', 'boxes-grid', 'h100');
  const inputBoxes = genInputBoxes('h100', 'w100');
  inputBoxes.forEach((boxObj) => {
    boxesWrapper.appendChild(boxObj.DOMElement);
  });
  const resultBoxObj = genResultBox();
  boxesWrapper.appendChild(resultBoxObj.DOMelement);

  form.appendChild(boxesWrapper);
  appWrapper.appendChild(form);

  const chordproInput = inputBoxes[0].textarea;
  const sheetInput = inputBoxes[1].textarea;
  const resultDiv = resultBoxObj.resultDiv;

  const showExampleButton = newElement('A', 'example-link');
  const hideExampleButton = newElement('A', 'example-link');
  showExampleButton.innerHTML = 'Vis meg et eksempel';
  hideExampleButton.innerHTML = 'Gå tilbake';
  hideExampleButton.style.display = 'none';

  showExampleButton.onclick = (e) => {
    showExampleButton.style.display = 'none';
    hideExampleButton.style.display = 'inline-block';
    exampleHoldUserContent.cp = chordproInput.value;
    chordproInput.value = exampleContent;
    cpInputChanged();
  };

  hideExampleButton.onclick = (e) => {
    hideExampleButton.style.display = 'none';
    showExampleButton.style.display = 'inline-block';
    chordproInput.value = exampleHoldUserContent.cp;
    cpInputChanged();
  };

  const cpInputChanged = () => {
    const template = chordproInput.value;
    sheetInput.value = cpToSheet(template).result;
    song.reInitialize(template);
  };
  header.appendChild(showExampleButton);
  header.appendChild(hideExampleButton);
  header.appendChild(downloadButton);
  header.appendChild(controlsWrapper);

  const song = new SongEdit(templateTest);
  song.parseHTMLTable(resultDiv);

  /* Event handlers START */
  sheetInput.oninput = (e) => {
    chordproInput.value = sheetToCp(e.target.value);
    song.reInitialize(chordproInput.value);
  };

  chordproInput.oninput = (e) => {
    cpInputChanged();
  };

  downloadButton.onclick = () => {
    if (chordproInput.value.trim() !== '') saveTextAsFile(chordproInput.value);
  };
  /* Event handlers END */

  /* Append to #target */
  target.innerHTML = '';
  target.appendChild(appWrapper);

  const transposeAllUp = () => {
    song.transposeUp();
    handleTransposeAll();
  };
  const transposeAllDown = () => {
    song.transposeDown();
    handleTransposeAll();
  };
  const handleTransposeAll = () => {
    chordproInput.value = song.parseTransposedChordPro();
    sheetInput.value = song.parsePlainText();
    song.reInitialize(chordproInput.value);
  };
  transposeUpButton.onclick = transposeAllUp;
  transposeDownButton.onclick = transposeAllDown;
};

const target = document.querySelector('#target');
genLayout(target);
