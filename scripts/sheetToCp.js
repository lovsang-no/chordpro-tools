const isChordLine = (line) => {
  // Get each word in line as a element in list
  let lineWords = line.replace(/\s+/g, ' ').trim().split(' ');
  for (let i = 0; i < lineWords.length; i++) {
    let word = lineWords[i];
    // Pass test if using H. Change later on
    word = useBinsteadOfH(word);
    lineWords[i] = word;

    if (
      !isChord(word) &&
      !isChord(word.substring(0, Math.min(word.length - 1)))
    ) {
      if (!isAcceptedOneLineParts(word)) return false;
    }
  }
  return true;
};

const isAcceptedOneLineParts = (word) => {
  const acceptedOneLineParts = ['|', '/', '-', '.', '(x', '(X', 'x', 'X'];
  for (let i = 0; i < acceptedOneLineParts.length; i++) {
    let acceptedPart = acceptedOneLineParts[i];
    if (word.startsWith(acceptedPart)) return true;
  }
  return false;
};

const checkAndFixOneLiner = (line) => {
  line = line.trim().replace(/\s+/g, ' ');
  /* Supporting |chord, ||, --, .., // (and combinations) */
  const regex = /(\||\.|\-\/|\\)(A|B|C|D|E|F|G|\d)|(\w|\d)(\||\.|\-\/|\\)|(\||\.|\-\/|\\){2}/gi;
  let fixIndex;
  fixIndex = line.search(regex);
  if (fixIndex !== -1) {
    let i = 0;
    while ((line.match(regex) || []).length > 0 && i < 50) {
      console.log('hei');
      fixIndex = line.search(regex);
      line = line.splice(fixIndex + 1, ' ');
      i++;
    }
  }
  return line;
};

const isOneLiner = (line) => {
  return line.trim().search(/\|/gi) !== -1;
};

const getChordsList = (line) => {
  const chordsList = [];
  const regex = /[^\s-]/;
  let index;
  let chord;
  let i;
  index = line.search(regex);
  while (line.search(regex) !== -1) {
    index = line.search(regex);
    chord = '';
    i = 0;
    while (index + i < line.length && line[index + i] !== ' ') {
      chord += line[index + i];
      line = line.erase(index + i);
      i++;
    }
    chordsList.push({
      chord: chord,
      index: index,
    });
  }
  return chordsList;
};

const useBinsteadOfH = (word) => {
  if (word.startsWith('H')) return 'B' + word.split('H')[1];
  else return word;
};

const sheetToCp = (template) => {
  const lines = template.split('\n');
  const buffer = [];
  let justMergedWithLyrics = false;
  let passedMetaSection = false;

  lines.forEach((line, linenum) => {
    if (!passedMetaSection) {
      buffer.push(line);
      if (line.trim() === '') passedMetaSection = true;
    } else if (!justMergedWithLyrics) {
      if (line.trim() !== '' && isChordLine(line)) {
        /* One liner */
        if (isOneLiner(line) || (isChordLine(line) && !lines[linenum + 1])) {
          const oneLineBuffer = [];
          let list = checkAndFixOneLiner(line).split(' ');

          list.forEach((element) => {
            oneLineBuffer.push(useBinsteadOfH(element).wrapChord());
          });
          line = oneLineBuffer.join(' ');
        } else {
          /* Regular chord over text */
          const nextLine = lines[linenum + 1] ?? '';
          if (!isChordLine(nextLine)) {
            const chords = getChordsList(line);
            let lyricsLine = nextLine;
            if (lyricsLine.length < line.length)
              lyricsLine += spaces(line.length - lyricsLine.length - 1);
            /* Adding chords backwards */
            chords.reverse().forEach((chordObj) => {
              lyricsLine = lyricsLine.splice(
                chordObj.index,
                useBinsteadOfH(chordObj.chord).wrapChord()
              );
            });
            line = lyricsLine;
            justMergedWithLyrics = true;
          }
        }
      }
      buffer.push(line);
    } else {
      justMergedWithLyrics = false;
    }
  });

  return buffer.join('\n');
};
