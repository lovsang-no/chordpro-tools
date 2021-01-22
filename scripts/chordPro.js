/* 

TODOS:

Fix padding when chords hug

*/

const parseChordPro = (template, parseTable = true) => {
  /* Helper variables */
  const br = '<br>';

  template = template.trim();

  var chordRegex = /\[([^\]]*)\]/;
  const transposedKey = '';
  const buffer = [];

  let meta_section_passed = false;

  template
    .trim()
    .split('\n')
    .forEach((line, linenum) => {
      /* One liner */
      if (isCPOneLiner(line)) {
        let oneLineBuffer = [];
        line.split(' ').forEach((chord) => {
          oneLineBuffer.push(chord.unwrapChord().wrapHTML('span', 'cp-chord'));
        });
        buffer.push(oneLineBuffer.join(' ').wrapHTML('div', ''));
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
        console.log(pairs);
        /* Parse table */
        if (parseTable) {
          let tableBuffer = [];
          for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            chordLine = pair.chord
              ? pair.chord.wrapHTML('span', 'cp-chord')
              : '';
            lyricLine = pair.lyrics ? pair.lyrics.replaceAll(' ', '&nbsp') : '';
            tableBuffer.push('<td>');
            tableBuffer.push(chordLine + br + lyricLine);
            tableBuffer.push('</td>');
          }

          buffer.push('<div>');
          buffer.push(
            tableBuffer
              .join('\n')
              .wrapHTML('tr')
              .wrapHTML('tbody')
              .wrapHTML('table')
          );
          buffer.push('</div>');
        } /* Parse HTML */ else {
          for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            chordLine += pair.chord
              ? pair.chord.wrapHTML('span', 'cp-chord')
              : '';
            lyricLine += pair.lyrics ?? '';
            let diff = (pair?.lyrics?.length ?? 0) - (pair?.chord?.length ?? 0);
            if (i + 1 !== pairs.length && diff > 0)
              chordLine += spaces(diff, '&nbsp');
          }

          buffer.push('<div>');
          buffer.push(chordLine + br);
          buffer.push(lyricLine + br);
          buffer.push('</div>');
        }
      } /* Line is blank or not containing chords */ else {
        /* Format meta data in a nice way */
        const metaRegex = /^(Key|key|Tempo|tempo|Time|time):\s*(.*)/;
        if (!meta_section_passed && line.match(metaRegex)) {
          const matches = line.match(metaRegex, 'i');

          if (matches.length >= 3) {
            let command = matches[1];
            let text = matches[2];
            if (command.toUpperCase() == 'KEY') text = text;
            //transpose_chord(text, transpose, transposed_is_b); // TODO: Transpose in correct way
            else if (command.toUpperCase() == 'TEMPO')
              text = text.split(' ')[0];
            let wrap = '';
            let pre = '';
            let post = '';
            //add more non-wrapping commands with this switch
            switch (command) {
              case 'Key':
              case 'key':
                pre = 'Toneart ';
                command = 'cp-meta cp-key';
                wrap = 'div';
                break;
              case 'Tempo':
              case 'tempo':
                command = 'cp-meta cp-tempo';
                wrap = 'span';
                post = ' BPM';
                break;
              case 'Time':
              case 'time':
                command = 'cp-meta cp-time';
                wrap = 'span';
                break;
            }
            if (wrap) {
              /*if (type != 3 && command != 'cp-tempo') */ buffer.push(
                '<' +
                  wrap +
                  ' class="' +
                  command +
                  '">' +
                  pre +
                  text +
                  post +
                  '</' +
                  wrap +
                  '>'
              );
            }
          }
        } /* For everything else  */ else {
          let LINETYPE;
          if (linenum === 0) LINETYPE = 'SONG_TITLE';
          else if (linenum === 1) LINETYPE = 'SONG_ARTIST';
          else if (line.trim().endsWith(':')) LINETYPE = 'SECTION_START';
          else if (line.trim() === '' && !meta_section_passed) {
            LINETYPE = 'META_END';
            meta_section_passed = true;
          } else if (line.trim() === '') LINETYPE = 'EMPTY';
          let push;

          switch (LINETYPE) {
            case 'SONG_TITLE':
              push =
                '<div class="cp-meta-wrapper">' +
                line.wrapHTML('span', 'cp-song-title');
              break;
            case 'SONG_ARTIST':
              push = line.wrapHTML('span', 'cp-song-artist');
              break;
            case 'META_END':
              push = '</div>';
              break;
            case 'SECTION_START':
              push =
                '<div class="cp-section">' +
                line.wrapHTML('span', 'cp-heading');
              break;
            case 'EMPTY':
              push = '</div>';
              break;
            default:
              push = line;
              break;
          }

          buffer.push(push + br);
        }
      }
    });

  return { result: buffer.join('\n'), key: transposedKey };
};
