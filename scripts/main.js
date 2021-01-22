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
    chordproInput.value = sheetToCp(template);
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

  /*   const template = `The Blessing
Kari Jobe
Key: B
Tempo: 90
Time: 4/4

Verse:
B                 E
The Lord bless you and keep you
B/D#                 F#sus
Make His face shine upon you
                    G#m
And be gracious to you
                  E
The Lord turn His face toward you
B/D#F#sus    B
And give you peace 

Interlude

| B / / / | Bsus / / / |
REPEAT VERSE
Chorus
G#m7 E
A  - men
  B      F#
Amen, Amen
G#m7 E
A  - men
  B      F#
Amen, Amen

REPEAT VERSE
REPEAT CHORUS X2
Interlude

| G#m7 / / / | E / / / | B / / / | F# / / / |

Bridge 1
        G#m7
May His favor be upon you
      E
And a thousand generations
          B
And your family and your children
          F#
And their children and their children

        G#m7
May His favor be upon you
      E
And a thousand generations
          B
And your family and your children
          F#
And their children and their children

REPEAT BRIDGE 1

Bridge 2
        G#m7
May His presence go before you
    E
And behind you and beside you
      B
All around you and within you
      F#
He is with you he is with you

        G#m7
In the morning in the evening
        E
In your coming and your going
        B
In your weeping and rejoicing 
      F#
He is for you He is for you

Tag
      G#m7
He is for you He is for you
      E
He is for you He is for you
      B
He is for you He is for you
      F#
He is for you He is for you

REPEAT CHORUS

Bridge 3
        G#m7
May His favor be upon you
      E
And a thousand generations
          B
And your family and your children
          F#
And their children and their children

        G#m7
May His presence go before you
    E
And behind you and beside you
      B
All around you and within you
      F#
He is with you he is with you

        G#m7
In the morning in the evening
        E
In your coming and your going
        B
In your weeping and rejoicing 
      F#
He is for you He is for you

REPEAT CHORUS & BRIDGE Freely
  `;
  sheetInput.value = template;
  chordproInput.value = sheetToCp(template); */
};

const target = document.querySelector('#target');
genLayout(target);
