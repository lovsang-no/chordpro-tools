/*
 * Copyright (c) 2020 Magnus Holta <magnus.holta@gmail.com>
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

// Convert

function convertSheet(sheet) {
  const keys = [
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

  var isChord = (word) => {
    var res = false;
    keys.forEach((chord) => {
      if (word.startsWith(chord)) res = true;
      if (
        word.length > 1 &&
        word.charAt(0).toLowerCase() == word.charAt(1).toLowerCase()
      ) {
        if (word.startsWith('Bb')) res = true;
        if (word.startsWith('Aadd')) res = true;
      }
    });
    return res;
  };

  var isChordLine = (line) => {
    var line = line
      .trim()
      .replace(/\/+|\|+|\-+/g, '')
      .replace(/x[0-9]+/g, ''); // Last regex adds ability to have x2 after simple chord line
    var lineList = line.replace(/ +/g, ' ').split(' ');
    var onlyChords = true;
    lineList.forEach((word) => {
      word = word.replace(/^\|+|^\//g, ''); // Ignore '|'
      if (!isChord(word) && word != '') onlyChords = false;
    });

    if (line.trim() == '') return false;
    if (lineList.length == 0) return false;
    if (line.charAt(line.length - 1) == ':') return false;

    return onlyChords;
  };

  var lines = sheet.split('\n');
  var res = '';
  var lastLineWasChords = false;
  var mergedWithNextLine = false;
  var passedMetaSection = false;

  lines.forEach((line, lineIndex) => {
    if (!passedMetaSection) {
      if (line.trim() == '') passedMetaSection = true;
      else res += line;
      res += '\n';
    } else {
      var nextLine = lines[lineIndex + 1] ? lines[lineIndex + 1] : '';
      if (isChordLine(line)) {
        if (nextLine.trim() != '' && !isChordLine(nextLine)) {
          chordList = line.trim().replace(/ +/g, ' ').split(' ');
          var textLine = lines[lineIndex + 1];
          var delta = 0;
          chordList.forEach((chord) => {
            var chordOrigIndex = line.indexOf(chord);
            var chordIndex = chordOrigIndex + delta;
            delta += chord.length + 2;
            var a = textLine.substring(0, chordIndex);
            var b = textLine.substring(chordIndex);
            var insert = '[' + chord + ']';
            textLine = [a, insert, b].join('');
          });
          res += textLine + '\n';
          lastLineWasChords = true;
          mergedWithNextLine = true;
        } else {
          var buffer = [];
          if (line)
            line.split(' ').forEach((s) => {
              if (isChord(s)) s = '[' + s + ']';
              buffer.push(s);
            });
          res += buffer.join(' ') + '\n';
        }
      } else {
        if (line == '') res += '\n';
        else if (!mergedWithNextLine) res += line + '\n';
        else if (!lastLineWasChords) {
          res += line + '\n';
        }
        mergedWithNextLine = false;
      }
    }
  });
  return res;
}
