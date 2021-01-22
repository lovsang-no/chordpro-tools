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
    resultDiv.innerHTML = parseChordPro(
      chordproInput.value,
      getKeyFromTemplate(chordproInput.value)
    ).result;
  };

  chordproInput.oninput = (e) => {
    let template = e.target.value;
    resultDiv.innerHTML = parseChordPro(
      template,
      getKeyFromTemplate(template)
    ).result;
    sheetInput.value = cpToSheet(template, getKeyFromTemplate(template)).result;
  };

  button.onclick = () => {
    if (chordproInput.value.trim() !== '') saveTextAsFile(chordproInput);
  };

  /* Append to #target */
  target.innerHTML = '';
  target.appendChild(app);

  const template = `Jeg vil følge
Impuls
Key: D
Tempo: 86 BPM
Time: 4/4

[|] [D] [-] [-] [-] [|] [D/] [C#] [-] [-] [-] [|] [Bm7] [-] [-] [-] [|] [G] [-] [-] [-] [|]

Vers 1:
D[D]u kom til m[D/C#]eg og jeg fikk s[G]e hvem du var
[Em]Jesus Guds sønn
[Bm7]Du viste m[Bm7/A]eg veien du g[G]ikk for min skyld 
Din d[Em]ød ble mitt liv

Bro:
[Bm7]Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du [D/C#]kaller navnet m[Bm7]itt
Og Jesus h[G]er står jeg ved ditt k[D]ors
og hører du k[G]aller meg, k[F#sus]aller me[F#]g

Refreng:
Til å fø[Bm7]lge deg hvor e[G]nn du går
Jesus [D]du ga meg alt å [Asus4]leve for[A]
Da d[Bm7]u ble korsfestet ble je[G]g satt fri
For [E]se jeg var død men har [Asus4]nå fått li[A]v
Jeg vil [E]følge deg, 
Jesus [G]du som har all fremtid for m[D]eg[D/C#] [Bm7] [G]

Vers 2:
D[D]u som kom [D/C#]fra, et liv i h[G]erlighet, 
[Em]fornedret deg selv
[Bm7]Du forlot a[Bm7/A]lt, himmel og t[G]rone for meg, 
en f[Em]remmed du ble
  `;
  chordproInput.value = template;
  sheetInput.value = cpToSheet(template).result;
  resultDiv.innerHTML = parseChordPro(
    template,
    getKeyFromTemplate(template)
  ).result;
};

const target = document.querySelector('#target');
genLayout(target);
