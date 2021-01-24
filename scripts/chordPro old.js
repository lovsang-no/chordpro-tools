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
function parseChordPro(template, key, mode = 0, transpose = 0, print) {
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

  var nashville_chord = function (chord, mode) {
    var regex = /([A-Z][b#]?)/g;
    var new_chord = chord.replace(regex, function ($1) {
      return (($1.charCodeAt() - 4) % 7) + 1;
    });
    if (mode == 3)
      nashville_cheats.forEach(function (cheat) {
        new_chord = new_chord.replace(
          new RegExp(cheat, 'g'),
          cheat[0] + '</span>'
        );
      });
    return new_chord;
  };

  var wrap_chord = function (chord, mode) {
    var regex = /(\/?[A-Z][b#]?)/g;
    if (mode == 2 || mode == 3) {
      return chord.replace(regex, function ($1) {
        return "<span class='cp-chord-base'>" + $1 + '</span>';
      });
    }
    return "<span class='cp-chord-base'>" + chord + '</span>';
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
    if (linenum == 0)
      buffer.push(
        '<div class="cp-info-block"><div class="cp-title">' + line + '</div>'
      );
    if (linenum == 1) buffer.push('<div class="cp-artist">' + line + '</div>');
    if (line == '') buffer.push('</div>');

    var isOneLiner =
      line.startsWith('|') || line.startsWith('/') ? true : false;

    /* Comment, ignore */
    if (line.match(/^#/)) {
      return '';
    }
    if (line.charAt(line.length - 1) == ':') {
      if (in_lyric_block) {
        buffer.push('</div>');
        in_lyric_block = false;
      }
      if (passed_first_section) buffer.push('</div>');
      else passed_first_section = true;
      buffer.push(
        '<div class="cp-section"><span class="cp-heading">' +
          line +
          '</span><br>'
      );
      return '';
    }
    /* Chord line */
    if (line.match(chordregex) && !isOneLiner) {
      if (!in_lyric_block) {
        buffer.push('<div class="lyric_block">');
        last_was_lyric = true;
        in_lyric_block = true;
      } else if (!last_was_lyric) {
        buffer.push('</div><div class="lyric_block">');
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
            lyrics = lyrics + word.replace(' ', '&nbsp;');
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
              chords += '&nbsp;';
              lyrics = dash == 1 ? lyrics + '-&nbsp;' : lyrics + '&nbsp&nbsp;';
              for (i = chordlen - word.length - dash; i != 0; i--) {
                lyrics += '&nbsp;';
              }
            } else if (
              word &&
              word.length == chordlen &&
              pos != last_chord_pos
            ) {
              chords += '&nbsp;';
              lyrics = dash == 1 ? lyrics + '-' : lyrics + '&nbsp;';
            } else if (word && word.length > chordlen) {
              for (i = word.length - chordlen; i != 0; i--) {
                chords += '&nbsp;';
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
            chords +=
              '<span class="chord" data-original-val="' +
              chord +
              '">' +
              wrapped_chord +
              '</span>';
          }
          console.log(word, isChord(word.trim()));

          if (!isLyrics || pos == 0) {
            var content_buff = [];
            content_buff.push('<span class="line">');
            if (!isLyrics) {
              if (mode != 1) content_buff.push(chords + '<br/>\n');
              content_buff.push(next_text + '</span><br/>');
              line_used = true;
            } else {
              content_buff.push('</br>' + word + '</span><br/>');
              line_used = true;
            }
            table.push('<td>' + content_buff.join('\n') + '</td>');
          }
        }, this);
        if (table) buffer.push('<table>' + table.join('') + '</table>');
      } else {
        line_list.forEach(function (word, pos) {
          var dash = 0;
          /* Lyrics */
          if (pos % 2 == 0) {
            lyrics = lyrics + word.replace(' ', '&nbsp;');
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
              chords += '&nbsp;';
              lyrics = dash == 1 ? lyrics + '-&nbsp;' : lyrics + '&nbsp&nbsp;';
              for (i = chordlen - word.length - dash; i != 0; i--) {
                lyrics += '&nbsp;';
              }
            } else if (
              word &&
              word.length == chordlen &&
              pos != last_chord_pos
            ) {
              chords += '&nbsp;';
              lyrics = dash == 1 ? lyrics + '-' : lyrics + '&nbsp;';
            } else if (word && word.length > chordlen) {
              for (i = word.length - chordlen; i != 0; i--) {
                chords += '&nbsp;';
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
            chords +=
              '<span class="chord" data-original-val="' +
              chord +
              '">' +
              wrapped_chord +
              '</span>';
          }
        }, this);
        buffer.push('<span class="line">');
        if (mode != 1) buffer.push(chords + '<br/>\n');
        buffer.push(lyrics + '</span><br/>');
      }
      return;
    } else if (isOneLiner) {
      /* OneLiner */
      if (!in_lyric_block) {
        buffer.push('<div class="lyric_block">');
        last_was_lyric = true;
        in_lyric_block = true;
      } else if (!last_was_lyric) {
        buffer.push('</div><div class="lyric_block">');
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
          chordLine += word.replace(' ', '&nbsp;');
        } else {
          /* Chords */
          chord = word.replace(/[[]]/, '');
          if (transpose !== false)
            chord = transpose_chord(chord, transpose, transposed_is_b);
          wrapped_chord = wrap_chord(chord, mode);
          if (mode == 2 || mode == 3)
            wrapped_chord = nashville_chord(wrapped_chord, mode);
          chordlen = chord.length;
          chordLine =
            chordLine +
            '<span class="chord" data-original-val="' +
            chord +
            '">' +
            wrapped_chord +
            '</span>';
        }
      }, this);
      buffer.push('<span class="line">');
      if (mode != 1) buffer.push(chordLine + '<br/>\n');
      buffer.push('</span><br/>');
      return;
    }

    /* Commands */
    var metaRegex = /^(Key|key|Tempo|tempo|Time|time):\s*(.*)/;
    if (line.match(metaRegex)) {
      if (!meta_passed) {
        buffer.push('<div class="cp-meta-block">');
        last_was_lyric = false;
      } else if (last_was_lyric) {
        buffer.push('</div><div class="cp-meta-block">');
        last_was_lyric = false;
      }
      // ADD COMMAND PARSING HERE
      // reference: http://tenbyten.com/software/songsgen/help/HtmlHelp/files_reference.htm
      // implement basic formatted text commands
      // Regular ChordPro-formatting var matches = line.match(/^{(title|t|subtitle|st|comment|c):\s*(.*)}/, "i");
      var matches = line.match(metaRegex, 'i');
      meta_passed = true;

      if (matches.length >= 3) {
        var command = matches[1];
        var text = matches[2];
        if (command.toUpperCase() == 'KEY')
          text = transpose_chord(text, transpose, transposed_is_b);
        var wrap = '';
        var pre = '';
        var post = '';
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

      // work from here to add wrapping commands
      return;
    } else if (meta_passed) {
      buffer.push('</div>');
      meta_passed = false;
      buffer.push('<div class="cp-extra-meta-wrapper">');
      inside_extra_meta = true;
      right_after_info = false;
    }

    if (inside_extra_meta) {
      if (line == '') {
        right_after_info = true;
        inside_extra_meta = false;
      }
      if (right_after_info) buffer.push('</div>');
    }
    /* Anything else */
    if (linenum > 1 && !right_after_info) buffer.push(line + '<br/>'); // To prevent from showing title and artist twice
    if (right_after_info) right_after_info = false;
  }, this);
  if (passed_first_section) {
    buffer.push('</div>');
  }
  return buffer.join('\n');
}
