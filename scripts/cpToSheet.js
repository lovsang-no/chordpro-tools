const cpToSheet = (template) => {
  template = template.trim();

  var chordRegex = /\[([^\]]*)\]/;
  const transposedKey = '';
  const buffer = [];

  template.split('\n').forEach((line) => {
    if (isCPOneLiner(line)) {
      let oneLineBuffer = [];
      line.split(' ').forEach((chord) => {
        oneLineBuffer.push(chord.unwrapChord());
      });
      buffer.push(oneLineBuffer.join(' '));
    } /* If line has chords */ else if (line.trim().match(chordRegex)) {
      let chordLine = '';
      let lyricLine = '';
      let lineList = line.split(chordRegex);
      const pairs = [{}];
      if (!line.trim().startsWith('[')) pairs[0]['chord'] = null;
      const pushIfNeeded = () => {
        let last = pairs[pairs.length - 1];
        if (last['chord'] !== undefined && last['lyrics'] !== undefined)
          pairs.push({});
      };
      lineList.forEach((word, index) => {
        pushIfNeeded();
        let pair = pairs[pairs.length - 1];
        if (isChord(word) && index % 2 !== 0) {
          /* Chords */
          pair['chord'] = word;
        } else {
          /* Lyrics */
          pair['lyrics'] = word === '' ? undefined : word;
        }
      });

      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        chordLine += pair.chord ?? '';
        lyricLine += pair.lyrics ?? '';
        let diff = (pair?.lyrics?.length ?? 0) - (pair?.chord?.length ?? 0);
        if (i + 1 !== pairs.length && diff > 0) chordLine += spaces(diff);
        if (i !== 0 && diff < 0) lyricLine += spaces(Math.abs(diff));
      }

      buffer.push(chordLine);
      buffer.push(lyricLine);
    } /* Line is blank or not containing chords */ else {
      buffer.push(line);
    }
  });

  return { result: buffer.join('\n'), key: transposedKey };
};

const p = (s) => {
  console.log(s);
};
