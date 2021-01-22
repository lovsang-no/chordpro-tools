/*
 * Copyright (c) 2021 Magnus Holta <magnus.holta@gmail.com>

 Based on work of
 * Copyright (c) 2020 David Gulaker <dgulaker@hotmail.com>
 * Copyright (c) 2014-16 Greg Schoppe <gschoppe@gmail.com>
 * Copyright (c) 2011 Jonathan Perkin <jonathan@perkin.org.uk>
 *
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

//

const all_keys = [
  'A',
  'Bb',
  'B',
  'Cb',
  'C',
  'C#',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'Ab',
];

const isChord = (word) => {
  let isChord = false;
  if (word)
    all_keys.forEach((chord) => {
      if (word.startsWith(chord) || word.startsWith('Aadd')) {
        isChord = true;
        return;
      }
    });
  return isChord;
};

const spaces = (number) => {
  return ' '.repeat(number);
};

const cpToSheet = (
  template,
  key = undefined,
  mode = 0,
  transpose = 0,
  table = false
) => {
  template = template.trim();

  var chordRegex = /\[([^\]]*)\]/;
  const transposedKey = '';
  const buffer = [];

  template.split('\n').forEach((line, linenum) => {
    /* If line has chords */
    if (line.trim().match(chordRegex)) {
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
