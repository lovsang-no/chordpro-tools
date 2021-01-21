/*
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

var get_transposed_key; //Will contain the transposed key

/* Parse a ChordPro template */
function cpToSheet(template, key, mode = 0, transpose = 0, print) {
  //modes: 0 transpose, 1 lyrics only, 2 nashville cheat, 3 nashville clean
  get_transposed_key = key;
  const validModes = [0, 1, 2, 3];
  if (validModes.indexOf(mode) == -1) {
    mode = 0;
  }

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
  const sep_keys = [
    ['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab'],
    ['A', 'Bb', 'Cb', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'],
  ];
  const sep_keys_C = [
    ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'],
  ];
  const notes = [
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    ['A', 'Bb', 'Cb', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'],
  ];
  const nashville_cheats = [
    '2</span>m',
    '3</span>m',
    '6</span>m',
    '7</span>dim',
  ];
  var chordregex = /\[([^\]]*)\]/;
  var inword = /[a-z]$/;
  var buffer = [];

  var chords = [];
  var last_was_lyric = false;
  var is_bkey = function (k) {
    const bkey = [
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
    ];
    return bkey[all_keys.indexOf(k)];
  };
  var transposed_key = function (k, transp) {
    const value = [0, 1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 9, 10, 11];
    var key_value = value[all_keys.indexOf(k)] + transp;
    while (key_value < 1) key_value += 12;
    while (key_value > 12) key_value -= 12;
    return sep_keys[is_bkey(k) ? 1 : 0][key_value];
  };
  var transpose_chord = function (chord, trans, use_b) {
    var regex = /([A-Z][b#]?)/g;
    var modulo = function (n, m) {
      return ((n % m) + m) % m;
    };
    return chord.replace(regex, function ($1) {
      /**if( $1.length > 1 && $1[1] == 'b' ) {
				if( $1[0] == 'A' ) {
					$1 = "G#";
				} else {
					$1 = String.fromCharCode($1[0].charCodeAt() - 1) + '#';
				}
			}**/
      var index = notes[0].indexOf($1);
      if (index == -1) index = notes[1].indexOf($1);
      if (index != -1) {
        index = modulo(index + trans, notes[0].length);
        return notes[use_b ? 1 : 0][index];
      }
      return 'XX';
    });
  };
  var isChord = (word) => {
    var res = false;
    if (word)
      all_keys.forEach((chord) => {
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
  var nashville_chord = function (chord, mode) {
    var regex = /([A-Z][b#]?)/g;
    var new_chord = chord.replace(regex, function ($1) {
      return (($1.charCodeAt() - 4) % 7) + 1;
    });
    if (mode == 3)
      nashville_cheats.forEach(function (cheat) {
        new_chord = new_chord.replace(new RegExp(cheat, 'g'), cheat[0] + '');
      });
    return new_chord;
  };

  var wrap_chord = function (chord, mode) {
    var regex = /(\/?[A-Z][b#]?)/g;
    if (mode == 2 || mode == 3) {
      return chord.replace(regex, function ($1) {
        return '' + $1 + '';
      });
    }
    return '' + chord + '';
  };

  template = template.trim();
  if (!template) return '';
  get_transposed_key = transpose ? transposed_key(key, transpose) : key;
  var transposed_is_b = is_bkey(transposed_key(key, transpose));
  var passed_blank_line = false;
  var passed_first_section = false;
  var in_lyric_block = false;
  var meta_passed = false;
  var meta_block_open = false;
  var inside_extra_meta = false;
  var right_after_info = true;
  if (mode == 2 || mode == 3) {
    transpose = sep_keys_C[
      sep_keys_C[0].indexOf(key.substring(0, 2)) == -1 ? 1 : 0
    ].indexOf(key.substring(0, 2));
    transposed_is_b = false;
    if (transpose == -1)
      transpose = sep_keys_C[
        sep_keys_C[0].indexOf(key[0]) == -1 ? 1 : 0
      ].indexOf(key[0]);
    if (transpose == -1) {
      console.log('Nashville convert key error');
    } else {
      transpose = -transpose;
    }
  }
  template.split('\n').forEach(function (line, linenum) {
    line = line.trim();
    if (linenum == 0) buffer.push('' + line + '');
    if (linenum == 1) buffer.push('' + line + '');

    var isOneLiner =
      line.startsWith('|') || line.startsWith('/') ? true : false;

    /* Comment, ignore */
    if (line.match(/^#/)) {
      return '';
    }
    if (line.charAt(line.length - 1) == ':') {
      if (in_lyric_block) {
        buffer.push('');
        in_lyric_block = false;
      }
      if (passed_first_section) buffer.push('');
      else passed_first_section = true;
      buffer.push('' + line + '');
      return '';
    }
    /* Chord line */
    if (line.match(chordregex) && !isOneLiner) {
      if (!in_lyric_block) {
        buffer.push('');
        last_was_lyric = true;
        in_lyric_block = true;
      } else if (!last_was_lyric) {
        buffer.push('');
        last_was_lyric = true;
      }
      var table = [];

      var chords = '';
      var lyrics = '';
      var chordlen = 0;
      var line_list = line.split(chordregex);
      var last_chord_pos =
        line_list.length % 2 ? line_list.length - 1 : line_list.length - 2;
      var line_used = false;
      if (print) {
        line_list.forEach(function (word, pos) {
          var chords = '';
          var lyrics = '';
          var last_was_chord = false;
          var next_text = line_list[pos + 1];
          var next_is_chord = isChord(next_text);
          // console.log(line +'\t'+word + '\t' + line_list[pos+1], next_is_chord)
          var dash = 0;
          var isLyrics = pos % 2 == 0 ? true : false;
          /* Lyrics */
          if (pos % 2 == 0) {
            lyrics = lyrics + word.replace(' ', ' ');
            /*
             * Whether or not to add a dash (within a word)
             */
            if (word.match(this.inword)) {
              dash = 1;
            }
            /*
             * Apply padding.  We never want two chords directly adjacent,
             * so unconditionally add an extra space.
             */
            if (mode == 1) {
            } else if (
              word &&
              word.length < chordlen &&
              pos != last_chord_pos
            ) {
              chords += ' ';
              lyrics = dash == 1 ? lyrics + '- ' : lyrics + ' ';
              for (i = chordlen - word.length - dash; i != 0; i--) {
                lyrics += ' ';
              }
            } else if (
              word &&
              word.length == chordlen &&
              pos != last_chord_pos
            ) {
              chords += ' ';
              lyrics = dash == 1 ? lyrics + '-' : lyrics + ' ';
            } else if (word && word.length > chordlen) {
              for (i = word.length - chordlen; i != 0; i--) {
                chords += ' ';
              }
            }
          } else {
            /* Chords */
            chord = word.replace(/[[]]/, '');
            if (transpose !== false)
              chord = transpose_chord(chord, transpose, transposed_is_b);
            wrapped_chord = wrap_chord(chord, mode);
            if (mode == 2 || mode == 3)
              wrapped_chord = nashville_chord(wrapped_chord, mode);
            chordlen = chord.length;
            chords += '' + wrapped_chord;
          }
          console.log(word, isChord(word.trim()));

          if (!isLyrics || pos == 0) {
            var content_buff = [];
            content_buff.push('');
            if (!isLyrics) {
              if (mode != 1) content_buff.push(chords);
              content_buff.push(next_text + '');
              line_used = true;
            } else {
              content_buff.push('' + word + '');
              line_used = true;
            }
            table.push('' + content_buff.join('\n') + '');
          }
        }, this);
      } else {
        line_list.forEach(function (word, pos) {
          var dash = 0;
          /* Lyrics */
          if (pos % 2 == 0) {
            lyrics = lyrics + word;
            /*
             * Whether or not to add a dash (within a word)
             */
            if (word.match(this.inword)) {
              dash = 1;
            }
            /*
             * Apply padding.  We never want two chords directly adjacent,
             * so unconditionally add an extra space.
             */
            if (mode == 1) {
            } else if (
              word &&
              word.length < chordlen &&
              pos != last_chord_pos
            ) {
              chords += ' ';
              lyrics = dash == 1 ? lyrics + '- ' : lyrics + ' ';
              for (i = chordlen - word.length - dash; i != 0; i--) {
                lyrics += ' ';
              }
            } else if (
              word &&
              word.length == chordlen &&
              pos != last_chord_pos
            ) {
              chords += ' ';
              lyrics = dash == 1 ? lyrics + '-' : lyrics + ' ';
            } else if (word && word.length > chordlen) {
              for (i = word.length - chordlen; i != 0; i--) {
                chords += ' ';
              }
            }
          } else {
            /* Chords */
            chord = word.replace(/[[]]/, '');
            if (transpose !== false)
              chord = transpose_chord(chord, transpose, transposed_is_b);
            wrapped_chord = wrap_chord(chord, mode);
            if (mode == 2 || mode == 3)
              wrapped_chord = nashville_chord(wrapped_chord, mode);
            chordlen = chord.length;
            chords += '' + wrapped_chord + '';
          }
        }, this);
        buffer.push('');
        if (mode != 1) buffer.push(chords + '');
        buffer.push(lyrics + '');
      }
      return;
    } else if (isOneLiner) {
      /* OneLiner */
      if (!in_lyric_block) {
        buffer.push('');
        last_was_lyric = true;
        in_lyric_block = true;
      } else if (!last_was_lyric) {
        buffer.push('');
        last_was_lyric = true;
      }
      var chordLine = '';
      var chordlen = 0;
      var line_list = line.split(chordregex);
      var last_chord_pos =
        line_list.length % 2 ? line_list.length - 1 : line_list.length - 2;

      line_list.forEach(function (word, pos) {
        var dash = 0;
        /* Lyrics */
        if (pos % 2 == 0) {
          chordLine += word.replace(' ', ' ');
        } else {
          /* Chords */
          chord = word.replace(/[[]]/, '');
          if (transpose !== false)
            chord = transpose_chord(chord, transpose, transposed_is_b);
          wrapped_chord = wrap_chord(chord, mode);
          if (mode == 2 || mode == 3)
            wrapped_chord = nashville_chord(wrapped_chord, mode);
          chordlen = chord.length;
          chordLine = chordLine + '' + wrapped_chord + '';
        }
      }, this);
      buffer.push('');
      if (mode != 1) buffer.push(chordLine + '');
      buffer.push('');
      return;
    }

    if (inside_extra_meta) {
      if (line == '') {
        right_after_info = true;
        inside_extra_meta = false;
      }
      if (right_after_info) buffer.push('');
    }
    /* Anything else */
    if (linenum > 1 && !right_after_info) buffer.push(line + ''); // To prevent from showing title and artist twice
    if (right_after_info) right_after_info = false;
  }, this);
  if (passed_first_section) {
    buffer.push('');
  }
  console.log(buffer);
  return buffer.join('\n');
}
