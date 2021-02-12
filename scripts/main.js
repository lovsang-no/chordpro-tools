const getHelperStyles = () => {
  const styles = `
  .cp-meta-wrapper,
  .cp-section {
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
    const copyrightBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title?.length) {
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
      if (this.metadata.published && this.metadata.copyright) {
        copyrightBuffer.push(
          lang.copyright.main
            .replaceAll(PUBLISH_YEAR, this.metadata.published)
            .replaceAll(COPYRIGHT, this.metadata.copyright)
            .replaceAll(SONG_TITLE, this.metadata.title)
            .replaceAll(
              ARTIST_NAME,
              this.metadata.artist.trim().endsWith('s')
                ? this.metadata.artist.trim()
                : this.metadata.artist.trim() + 's'
            )
            .replaceAll(
              ALBUM_NAME,
              this.metadata.album ? this.metadata.album : this.metadata.title
            )
            .replaceAll(ALBUM, this.metadata.album ? ALBUM : 'singel')
            .replaceAll('\n', '</br>')
        );
      }
      if (this.metadata.web) {
        copyrightBuffer.push('</br>');
        copyrightBuffer.push(
          lang.copyright.moreInfo.replaceAll(WEB_PAGE, this.metadata.web)
        );
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
    mainBuffer.push(
      copyrightBuffer.join('\n').wrapHTML('DIV', 'cp-copyright-wrapper')
    );
    target.innerHTML = mainBuffer.join('\n').wrapHTML('DIV', 'cp-wrapper');
    /* Append to target */
  }

  parseTransposedChordPro() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title?.length) {
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
  parseTransposedChordProOnlyChords() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
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
          mainBuffer.push('');
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
  generateFileName() {
    return (
      (this.metadata.title ?? '') +
      ' - ' +
      (this.metadata.artist ?? '') +
      ' (' +
      (this.logicWrapper.currentKey ?? '') +
      ')'
    );
  }
}

const saveTextAsFile = (textToWrite, filename) => {
  /* Source: https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file/42864235  */
  const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
  const fileNameToSaveAs = filename + '.txt'; //filename.extension

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

const userContent = [];

const KEY_VALIDATION = 'key_validation';
const TEMPO_VALIDATION = 'tempo_validation';
const NOT_EMPTY = 'not_empty';

const generateHelperStyleSheetSwitch = () => {
  const showDetailsButton = newElement('a');
  const hideDetailsButton = newElement('a');
  showDetailsButton.innerHTML = lang.helperSheet.show;
  hideDetailsButton.innerHTML = lang.helperSheet.hide;
  const styleElement = getHelperStyles();
  setTimeout(() => {
    document.head.appendChild(styleElement);
  }, 10);
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

  return {
    show: showDetailsButton,
    hide: hideDetailsButton,
  };
};

const adjustKey = (input) => {
  switch (input.innerText) {
    case 'A#':
      input.innerText = 'Bb';
      break;
    case 'D#':
      input.innerText = 'Eb';
      break;
    case 'E#':
      input.innerText = 'F';
      break;
    case 'G#':
      input.innerText = 'G#';
      break;
  }
};

const generateChordProSectionObject = () => {
  const section = newElement('SECTION');
  const containerGrid = newElement('DIV', 'box-grid', 'container', 'wide');

  const boxInputWrapper = newElement('DIV', 'box');
  boxInputWrapper.innerHTML += `<h2 class="box-label">${lang.boxes.input.label}</h2>`;
  const boxInputContent = newElement('DIV', 'box-content');
  const form = newElement('FORM');
  form.onsubmit = (e) => {
    e.preventDefault();
  };
  boxInputContent.appendChild(form);
  boxInputWrapper.appendChild(boxInputContent);

  const boxResultWrapper = newElement('DIV', 'box');
  const boxResultLabel = newElement('DIV', 'box-label');
  boxResultWrapper.appendChild(boxResultLabel);
  boxResultLabel.innerHTML = lang.boxes.result.label;
  const boxResultContent = newElement('DIV', 'box-content');
  const target = newElement('DIV');
  boxResultContent.appendChild(target);
  boxResultWrapper.appendChild(boxResultContent);

  /* Helper styles */
  const styleSheetSwitch = generateHelperStyleSheetSwitch();
  boxResultLabel.appendChild(styleSheetSwitch.show);
  boxResultLabel.appendChild(styleSheetSwitch.hide);

  containerGrid.appendChild(boxInputWrapper);
  containerGrid.appendChild(boxResultWrapper);
  section.appendChild(containerGrid);

  /* Form */
  let generatedTemplate = '';

  /* Metadata input grid */
  const metadataInputWrapper = newElement('DIV', 'metadata-input-grid');
  form.appendChild(metadataInputWrapper);

  const metaDataInputTemplate = {
    name: '...',
    placeholder: '',
    labelText: '...',
    cpKey: '',
    required: false,
    isShort: false,
    isMultiline: false,
    validation: null,
    fullWidth: false,
  };

  const metaDataInputs = [
    {
      name: 'title',
      placeholder: '',
      labelText: 'Tittel',
      cpKey: '',
      required: true,
      isShort: false,
      isMultiline: false,
      validation: NOT_EMPTY,
      fullWidth: false,
    },
    {
      name: 'artist',
      placeholder: '',
      labelText: 'Artist',
      cpKey: '',
      required: true,
      requireTitle: true,
      isShort: false,
      validation: NOT_EMPTY,
      fullWidth: false,
    },
    {
      name: 'album',
      placeholder: 'La stå tom hvis det er en singel',
      labelText: 'Album*',
      cpKey: 'album',
      required: false,
      isShort: false,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'published',
      placeholder: '',
      labelText: 'Utgivelsesår',
      cpKey: 'Published',
      required: true,
      isShort: true,
      isMultiline: false,
      validation: NOT_EMPTY,
      fullWidth: false,
    },
    {
      name: 'copyright',
      placeholder: '',
      labelText: 'Copyright',
      cpKey: 'Copyright',
      required: true,
      isShort: false,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'key',
      placeholder: '',
      labelText: 'Toneart',
      cpKey: 'Key',
      required: true,
      isShort: true,
      isMultiline: false,
      validation: KEY_VALIDATION,
      fullWidth: false,
    },
    {
      name: 'tempo',
      placeholder: '',
      labelText: 'Tempo</br>(BPM)',
      cpKey: 'Tempo',
      required: false,
      isShort: true,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'time',
      placeholder: '',
      labelText: 'Taktart',
      cpKey: 'Time',
      required: false,
      isShort: true,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },

    {
      name: 'textmed',
      placeholder: '',
      labelText: 'Tekst</br>/melodi',
      cpKey: 'T/m', // sjekk dette
      required: false,
      isShort: false,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'web',
      placeholder: '',
      labelText: 'Nettside',
      cpKey: 'Web',
      required: false,
      isShort: false,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'ccli',
      placeholder: '',
      labelText: 'CCLI',
      cpKey: 'CCLI',
      required: false,
      isShort: false,
      isMultiline: false,
      validation: null,
      fullWidth: false,
    },
    {
      name: 'song',
      placeholder: '',
      labelText: 'Tekst og akkorder',
      cpKey: '',
      required: true,
      isShort: false,
      isMultiline: true,
      validation: NOT_EMPTY,
      fullWidth: true,
    },
  ];

  const songInitialHeight = 20; // rows
  let filename = 'Blekke untitled';

  /* UpdateTemplate on input */
  const updateTemplate = () => {
    generatedTemplate = '';

    metaDataInputs.forEach((e) => {
      if (e.isMultiline) {
        let occurences = (e.input.value.match(/\n/g) ?? []).length + 2;
        if (e.name === 'song') {
          occurences = Math.max(songInitialHeight, occurences);
        }
        e.input.rows = occurences;
      }
      if (e.input?.value) {
        const evtKey = e.cpKey ? e.cpKey + ': ' : '';
        const evtLine = e.name === 'song' ? '\n' : '';
        generatedTemplate += evtKey + evtLine + e.input.value.trim() + '\n';
      }
    });
  };

  const everythingIsFilledOut = () => {
    let res = true;
    for (let i = 0; i < metaDataInputs.length; i++) {
      let data = metaDataInputs[i];
      if (data.required && data.input.value.trim() === '') {
        data.input.classList.add('error');
        res = false;
      }
    }
    return res;
  };

  let song = new SongEdit();

  const rerenderTarget = () => {
    song.reInitialize(sheetToCp(generatedTemplate));
    filename = song.generateFileName();
    song.parseHTMLTable(target);
  };

  /* Fire change on input */
  const fireInputChange = () => {
    updateTemplate();
    rerenderTarget();
  };

  /* Metadata inputs */
  metaDataInputs.forEach((e) => {
    const label = newElement('LABEL', e.fullWidth ? 'full-width' : '');
    label.setAttribute('for', e.name);
    label.innerHTML = e.labelText + (e.required ? '*' : '');

    const input = newElement('TEXTAREA');
    input.id = e.name;
    input.style.display = 'none';
    //input.rows = e.name === 'song' ? songInitialHeight : 1;

    /* New attempt */
    const inputWrapper = newElement(
      'DIV',
      'input-wrapper',
      e.fullWidth ? 'full-width' : '',
      e.isShort ? 'short' : ''
    );
    inputWrapper.appendChild(input);
    const span = newElement(
      'DIV',
      'textarea-span',
      e.isMultiline ? 'multiline' : ''
    );
    const updateInputFromSpan = (clear) => {
      input.value = clear ? '' : span.innerText.trim();
    };
    span.role = 'textbox';
    span.innerHTML = e.placeholder ?? '';
    span.oninput = updateInputFromSpan;
    span.setAttribute('contenteditable', true);
    inputWrapper.appendChild(span);

    /* Add input element to metadatalist for iterating through when updating template */
    e['input'] = input;
    e['span'] = span;
    /* Add onclick event for updating template when input */

    switch (e.validation) {
      case KEY_VALIDATION:
        span.oninput = () => {
          adjustKey(span);
          updateInputFromSpan(true);
          if (all_keys.indexOf(span.innerText) !== -1) {
            span.classList.remove('error');
            if (
              !metaDataInputs[0].input.value.trim() ||
              !metaDataInputs[1].input.value.trim()
            ) {
              span.classList.add('error');
              span.innerText = lang.errors.noTitleOrArtistError;
            } else {
              updateInputFromSpan();
            }
          } else {
            if (
              !metaDataInputs[0].input.value.trim() ||
              !metaDataInputs[1].input.value.trim()
            ) {
              updateInputFromSpan(true);
              span.innerText = lang.errors.noTitleOrArtistError;
            }
            span.classList.add('error');
          }
          fireInputChange();
        };
        break;
      case NOT_EMPTY:
        span.oninput = () => {
          updateInputFromSpan(true);
          if (span.innerText.trim() !== '') {
            span.classList.remove('error');
            updateInputFromSpan();
          } else {
            span.classList.add('error');
          }
          if (e.requireTitle && !metaDataInputs[0].input.value.trim()) {
            span.classList.add('error');
            span.innerText = lang.errors.noTitleBeforeArtistError;
          }
          fireInputChange();
        };
        break;
      default:
        span.oninput = () => {
          updateInputFromSpan();
          fireInputChange();
        };
        break;
    }

    metadataInputWrapper.appendChild(label);
    metadataInputWrapper.appendChild(inputWrapper);
  });

  const fileDownloadButton = newElement('BUTTON', 'full-width');
  metadataInputWrapper.appendChild(fileDownloadButton);
  fileDownloadButton.innerHTML = `${lang.downloadButton}`;
  fileDownloadButton.autocomplete = 'off';
  fileDownloadButton.autocorrect = 'off';
  fileDownloadButton.autocapitalize = 'off';
  fileDownloadButton.spellcheck = 'false';
  fileDownloadButton.onclick = () => {
    if (everythingIsFilledOut())
      saveTextAsFile(sheetToCp(generatedTemplate), filename);
  };

  const saveUserData = () => {
    metaDataInputs.forEach((e, i) => {
      if (!userContent[i] === undefined) userContent.push('');
      userContent[i] = e.span.innerText;
    });
  };

  const applyExampleInput = () => {
    saveUserData();
    metaDataInputs.forEach((e, i) => {
      if (exampleObject[i]) {
        e.input.value = exampleObject[i];
        e.span.innerText = e.input.value;
      }
    });
    updateTemplate();
    fireInputChange();
  };

  const applyDefaultInput = () => {
    metaDataInputs.forEach((e, i) => {
      if (defaultObject[i]) {
        e.span.innerText = defaultObject[i];
      }
    });
  };

  const backToUserData = () => {
    userContent.forEach((content, i) => {
      let e = metaDataInputs[i];
      if (e) {
        e.input.value = content;
        e.span.innerText = e.input.value;
      }
    });
    updateTemplate();
    fireInputChange();
  };
  const rerenderAfterTranspose = () => {
    song.reRender();
  };
  const setValueToLabelAndInputIndex = (index, text) => {
    const obj = metaDataInputs[index];
    obj.span.innerText = text;
    obj.input.value = text;
  };
  const setLabelsAndInputsFromSongObj = () => {
    if (song.metadata.key)
      setValueToLabelAndInputIndex(5, song.logicWrapper.getTransposedKey());
    if (song.sections.length) {
      setValueToLabelAndInputIndex(
        11,
        song.parseTransposedChordProOnlyChords()
      );
    }
  };
  const transposeUp = () => {
    if (song) {
      song.transposeUp();
      rerenderAfterTranspose();
      setLabelsAndInputsFromSongObj();
    }
  };
  const transposeDown = () => {
    if (song) {
      song.transposeDown();
      rerenderAfterTranspose();
      setLabelsAndInputsFromSongObj();
    }
  };

  applyDefaultInput();
  return {
    DOMSection: section,
    template: generatedTemplate,
    exampleHandling: {
      applyExample: applyExampleInput,
      revertToUserData: backToUserData,
    },
    transpose: {
      up: transposeUp,
      down: transposeDown,
    },
  };
};

const generateLayout = (target) => {
  /* Main wrapper */
  const appWrapper = newElement('DIV', 'app-wrapper');

  const formObject = generateChordProSectionObject();
  /* Header */
  const headerWrapper = newElement('SECTION', 'header');
  const backgroundOverlay = newElement('DIV', 'background-overlay');
  headerWrapper.appendChild(backgroundOverlay);
  const container = newElement('DIV', 'container');
  headerWrapper.appendChild(container);
  const headerGrid = newElement('DIV', 'header-grid');
  container.innerHTML += `<h1 class="title">${lang.description.title}</h1>`;
  container.innerHTML += `<div class="subtitle">${lang.description.subtitle}</div>`;
  container.appendChild(headerGrid);
  const howTo = newElement('DIV', 'how-to');
  headerGrid.appendChild(howTo);
  howTo.innerHTML += `<h2>${lang.howTo.title}</h2>`;
  howTo.innerHTML += `<ol>${lang.howTo.list
    .map((li) => `<li>${li}</li>`)
    .join('\n')}</ol>`;
  howTo.innerHTML += `<p>${lang.howTo.contactUsIfNeeded}</p>`;
  const howToButtonsWrapper = newElement('DIV', 'how-to-buttons-wrapper');
  const transposeWrapper = newElement('DIV', 'transpose-wrapper');
  howToButtonsWrapper.appendChild(transposeWrapper);
  transposeWrapper.innerHTML = `<div>Transponér</div>`;
  const transposeButtonUp = newElement('BUTTON', 'transpose-button');
  const transposeButtonDown = newElement('BUTTON', 'transpose-button');
  transposeButtonUp.onclick = formObject.transpose.up;
  transposeButtonDown.onclick = formObject.transpose.down;
  transposeButtonUp.innerHTML = `<i class="fas fa-angle-up"></i>`;
  transposeButtonDown.innerHTML = `<i class="fas fa-angle-down"></i>`;
  transposeWrapper.appendChild(transposeButtonUp);
  transposeWrapper.appendChild(transposeButtonDown);
  howTo.appendChild(howToButtonsWrapper);
  const exampleShow = newElement('A', 'button', 'how-to-button');
  const exampleHide = newElement('A', 'button', 'how-to-button');
  howToButtonsWrapper.appendChild(exampleShow);
  howToButtonsWrapper.appendChild(exampleHide);
  exampleShow.innerHTML = lang.howTo.example.show;
  exampleHide.innerHTML = lang.howTo.example.hide;
  exampleHide.classList.add('hide');

  exampleShow.onclick = () => {
    exampleShow.classList.add('hide');
    exampleHide.classList.remove('hide');
    formObject.exampleHandling.applyExample();
  };
  exampleHide.onclick = () => {
    exampleHide.classList.add('hide');
    exampleShow.classList.remove('hide');
    formObject.exampleHandling.revertToUserData();
  };
  appWrapper.appendChild(headerWrapper);

  const vimeo = newElement('DIV');
  headerGrid.appendChild(vimeo);
  vimeo.innerHTML += `
      <style>
        .embed-container { 
          position: relative; 
          padding-bottom: 56.25%; 
          height: 0; 
          overflow: hidden; 
          max-width: 100%; 
        } 
        .embed-container iframe, 
        .embed-container object, 
        .embed-container embed { 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
        }
      </style>
      <div class='embed-container'>
        <iframe 
          src='https://player.vimeo.com/video/512010540' 
          frameborder='0' 
          webkitAllowFullScreen 
          mozallowfullscreen 
          allowFullScreen>
        </iframe>
      </div>
`;

  /* Form for generating sheet */
  const main = newElement('MAIN');
  main.appendChild(formObject.DOMSection);
  appWrapper.appendChild(main);

  /* Append app to target */
  target.innerHTML = '';
  target.appendChild(appWrapper);

  /* Add listeners and functionality */
};

const target = document.querySelector('#target');
generateLayout(target);
