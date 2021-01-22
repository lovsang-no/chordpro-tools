const isCPOneLiner = (line) => {
  const items = line.split(' ');
  for (let i = 0; i < items.length; i++) {
    let chord = items[i];
    if (!(chord.startsWith('[') && chord.endsWith(']'))) return false;
  }
  return true;
};

//console.log(isCPOneLiner('[|] [B] [/] [/] [/] [|] [Bsus] [/] [/] [/] [|]'));

const cpToSheet = (template) => {
  template = template.trim();

  var chordRegex = /\[([^\]]*)\]/;
  const transposedKey = '';
  const buffer = [];

  template.split('\n').forEach((line) => {
    if (isCPOneLiner(line)) {
      let oneLineBuffer = [];
      console.log(line);
      line.split(' ').forEach((chord) => {
        oneLineBuffer.push(chord.unwrapChord());
      });
      console.log(oneLineBuffer);
      buffer.push(oneLineBuffer.join(' '));
    } /* If line has chords */ else if (line.trim().match(chordRegex)) {
      let chordLine = '';
      let chordLength = 0;
      let lyricLine = '';
      let lineList = line.split(chordRegex);

      lineList.forEach((word, index) => {
        if (isChord(word) && index % 2 !== 0) {
          /* Chords */
          chordLine +=
            spaces(Math.max(lyricLine.length - chordLength, 0)) + word;
          chordLength += word.length;
        } else {
          /* Lyrics */
          lyricLine += word;
        }
      });

      buffer.push(chordLine);
      buffer.push(lyricLine);
    } /* Line is blank or not containing chords */ else {
      buffer.push(line);
    }
  });

  return { result: buffer.join('\n'), key: transposedKey };
};
