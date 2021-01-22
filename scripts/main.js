const newElement = (element, ...classes) => {
  const el = document.createElement(element);
  classes.forEach((c) => {
    el.classList.add(c);
  });
  return el;
};

const genInputBoxes = (...classes) => {
  const boxValues = [
    {
      name: 'sheetInput',
      placeholder: 'Lim inn akkorder over tekst',
      label: 'Akkorder over tekst',
    },
    {
      name: 'cpInput',
      placeholder: 'Lim inn akkorder i ChordPro-format',
      label: 'ChordPro',
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
  const resultDiv = newElement('DIV', 'flex-grow', 'w100');

  const boxContent = newElement('DIV', 'box-content', 'flex-v');
  boxContent.appendChild(controlsWrapper);
  boxContent.appendChild(resultDiv);
  const boxLabel = newElement('DIV', 'box-label');
  boxLabel.innerHTML = boxValue.label;

  const box = newElement('DIV', 'box', 'h100');
  box.appendChild(boxLabel);
  box.appendChild(boxContent);

  return {
    DOMelement: box,
    resultDiv: resultDiv,
  };
};

const onSubmit = (e) => {
  e.preventDefault();
};

const saveTextAsFile = (textarea) => {
  /* Source: https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file/42864235  */
  const textToWrite = textarea.value;
  const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
  const fileNameToSaveAs = textarea.value.split('\n')[0] + '.txt'; //filename.extension

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

const getKeyFromTemplate = (template) => {
  let metaRegex = /^(Key|key):\s*(.*)/;

  template.split('\n').forEach((line) => {
    if (line.match(metaRegex)) {
      let key = line.toLowerCase().split('key: ')[1];
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
  });
};
const genLayout = (target) => {
  const app = newElement('DIV', 'h100');
  const form = newElement('FORM', 'h100');
  form.name = 'form';
  form.onsubmit = onSubmit;

  const boxesWrapper = newElement('DIV', 'boxes-grid', 'h100');
  const inputBoxes = genInputBoxes('h100', 'w100');
  inputBoxes.forEach((boxObj) => {
    boxesWrapper.appendChild(boxObj.DOMElement);
  });
  const resultBoxObj = genResultBox();
  boxesWrapper.appendChild(resultBoxObj.DOMelement);

  const actionWrapper = newElement('DIV', 'action-wrapper');
  const buttonWrapper = newElement('DIV', 'button-wrapper');
  const button = newElement('BUTTON');
  button.innerHTML = 'Last ned ChordPro som .txt';

  buttonWrapper.appendChild(button);
  actionWrapper.appendChild(buttonWrapper);

  boxesWrapper.appendChild(actionWrapper);

  form.appendChild(boxesWrapper);
  app.appendChild(form);

  const sheetInput = inputBoxes[0].textarea;
  const chordproInput = inputBoxes[1].textarea;
  const resultDiv = resultBoxObj.resultDiv;

  sheetInput.oninput = (e) => {
    let template = e.target.value;
    chordproInput.value = convertSheet(template);
    resultDiv.innerHTML = parseChordPro(template, getKeyFromTemplate(template));
  };

  chordproInput.oninput = (e) => {
    let template = e.target.value;
    resultDiv.innerHTML = parseChordPro(template, getKeyFromTemplate(template));
    sheetInput.value = cpToSheet(template, getKeyFromTemplate(template)).result;
  };

  button.onclick = () => {
    if (chordproInput.value.trim() !== '') saveTextAsFile(chordproInput);
  };

  /* Append to #target */
  target.innerHTML = '';
  target.appendChild(app);

  const template = `
Verse
[B]The Lord bless you[E] and keep you
[B/D#]Make His face shine u[F#sus]pon you
And be gracious to [G#m]you
The Lord turn His[E] face toward you
[B/D#]And [F#sus]give you [B]peace 

Interlude
[| B / / / | Bsus / / / |]
REPEAT VERSE
Chorus
[G#m7]A  - [E]men
A[B]men, A[F#]men
[G#m7]A  - [E]men
A[B]men, A[F#]men

REPEAT VERSE
REPEAT CHORUS X2
Interlude
[| G#m7 / / / | E / / / | B / / / | F# / / / |]

Bridge 1
May His [G#m7]favor be upon you
And a [E]thousand generations
And your [B]family and your children
And their [F#]children and their children

May His [G#m7]favor be upon you
And a [E]thousand generations
And your [B]family and your children
And their [F#]children and their children

REPEAT BRIDGE 1

Bridge 2
May His [G#m7]presence go before you
And [E]behind you and beside you
All a[B]round you and within you
He is [F#]with you he is with you

In the [G#m7]morning in the evening
In your [E]coming and your going
In your [B]weeping and rejoicing 
He is [F#]for you He is for you

Tag
He is [G#m7]for you He is for you
He is [E]for you He is for you
He is [B]for you He is for you
He is [F#]for you He is for you

REPEAT CHORUS

Bridge 3
May His [G#m7]favor be upon you
And a [E]thousand generations
And your [B]family and your children
And their [F#]children and their children

May His [G#m7]presence go before you
And [E]behind you and beside you
All a[B]round you and within you
He is [F#]with you he is with you

In the [G#m7]morning in the evening
In your [E]coming and your going
In your [B]weeping and rejoicing 
He is [F#]for you He is for you

REPEAT CHORUS & BRIDGE Freely
  `;
  chordproInput.value = template;
  sheetInput.value = cpToSheet(template, getKeyFromTemplate(template)).result;
};

const target = document.querySelector('#target');
genLayout(target);
