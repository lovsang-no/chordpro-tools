class SongEdit extends Song {
  parseToTarget(target, parseTable = true, plainText = false) {
    if (!target) {
      console.error('No target is set');
      return;
    }
    const mainBuffer = [];
    const copyrightBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title?.length) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title)
        metaBuffer.push(this.metadata.title.wrapHTML('div', 'cp-song-title'));
      if (this.metadata.artist)
        metaBuffer.push(this.metadata.artist.wrapHTML('div', 'cp-song-artist'));
      if (this.logicWrapper.currentKey)
        metaBuffer.push(
          ('Toneart: ' + this.logicWrapper.currentKey).wrapHTML('div')
        );
      if (this.metadata.tempo)
        metaBuffer.push(
          (this.metadata.tempo + ' BPM ' + (this.metadata.time ?? '')).wrapHTML(
            'div'
          )
        );
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push((key + ': ' + value).wrapHTML('div'));
      }
      if (this.metadata.published && this.metadata.copyright) {
        copyrightBuffer.push(
          lang.copyright.main
            .replaceAll(PUBLISH_YEAR, this.metadata.published)
            .replaceAll(COPYRIGHT, this.metadata.copyright)
            .replaceAll(SONG_TITLE, this.metadata.title)
            .replaceAll(
              ARTIST_NAME,
              this.metadata.artist.trim().endsWith('s')
                ? this.metadata.artist.trim()
                : this.metadata.artist.trim() + 's'
            )
            .replaceAll(
              ALBUM_NAME,
              this.metadata.album ? this.metadata.album : this.metadata.title
            )
            .replaceAll(ALBUM, this.metadata.album ? ALBUM : 'singel')
            .replaceAll('\n', '</br>')
        );
      }
      if (this.metadata.web) {
        copyrightBuffer.push('</br>');
        copyrightBuffer.push(
          lang.copyright.moreInfo.replaceAll(WEB_PAGE, this.metadata.web)
        );
      }

      mainBuffer.push(
        metaBuffer.join('\n').wrapHTML('div', 'cp-meta-wrapper') + br
      );
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
          if (
            !(
              section.logicWrapper.parseSTATE === 'LYRICS' &&
              section.lines.length === 1 &&
              section.lines[0].TYPE === 'ONELINE'
            )
          )
            mainBuffer.push(section.parse(parseTable) + br);
        });
      } else if (!this.logicWrapper.key) {
        mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-no-key'));
      } else {
        mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-key-error'));
      }
    } else {
      mainBuffer.push(''.wrapHTML('div', 'cp-error-message cp-welcome'));
    }
    mainBuffer.push(
      copyrightBuffer.join('\n').wrapHTML('DIV', 'cp-copyright-wrapper')
    );
    target.innerHTML = mainBuffer.join('\n').wrapHTML('DIV', 'cp-wrapper');
    /* Append to target */
  }

  parseTransposedChordPro() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title?.length) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title) metaBuffer.push(this.metadata.title);
      if (this.metadata.artist) metaBuffer.push(this.metadata.artist);
      if (this.logicWrapper.currentKey)
        metaBuffer.push('Key: ' + this.logicWrapper.currentKey);
      if (this.metadata.tempo) metaBuffer.push('Tempo: ' + this.metadata.tempo);
      if (this.metadata.time) metaBuffer.push('Time: ' + this.metadata.time);
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push(key + ': ' + value);
      }
      mainBuffer.push(metaBuffer.join('\n'));
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
          mainBuffer.push('');
          if (section.title) mainBuffer.push(section.title);
          section.lines?.forEach((line) => {
            let lineBuffer = [];
            switch (line.TYPE) {
              case 'ONELINE':
                lineBuffer = [];
                line.oneLine.forEach((e) => {
                  if (e instanceof Chord)
                    lineBuffer.push('[' + e.transposedChord() + ']');
                  else lineBuffer.push('[' + e + ']');
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                line.pairs.forEach((pair) => {
                  if (pair.chord)
                    lineBuffer.push('[' + pair.chord.transposedChord() + ']');
                  if (pair.lyrics) lineBuffer.push(pair.lyrics);
                });
                mainBuffer.push(lineBuffer.join(''));
            }
          });
        });
      }
      return mainBuffer.join('\n');
    }
  }
  parseTransposedChordProOnlyChords() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
          if (section.title) mainBuffer.push(section.title);
          section.lines?.forEach((line) => {
            let lineBuffer = [];
            switch (line.TYPE) {
              case 'ONELINE':
                lineBuffer = [];
                line.oneLine.forEach((e) => {
                  if (e instanceof Chord)
                    lineBuffer.push('[' + e.transposedChord() + ']');
                  else lineBuffer.push('[' + e + ']');
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                line.pairs.forEach((pair) => {
                  if (pair.chord)
                    lineBuffer.push('[' + pair.chord.transposedChord() + ']');
                  if (pair.lyrics) lineBuffer.push(pair.lyrics);
                });
                mainBuffer.push(lineBuffer.join(''));
            }
          });
          mainBuffer.push('');
        });
      }
      return mainBuffer.join('\n');
    }
  }
  parsePlainText() {
    const mainBuffer = [];
    const br = '<br>';
    if (this.intialized && this.metadata.title.length !== 0) {
      /* Add meta data */
      const metaBuffer = [];
      if (this.metadata.title) metaBuffer.push(this.metadata.title);
      if (this.metadata.artist) metaBuffer.push(this.metadata.artist);
      if (this.logicWrapper.currentKey)
        metaBuffer.push('Key: ' + this.logicWrapper.currentKey);
      if (this.metadata.tempo) metaBuffer.push('Tempo: ' + this.metadata.tempo);
      if (this.metadata.time) metaBuffer.push('Time: ' + this.metadata.time);
      for (let [key, value] of this.metadata.extra) {
        metaBuffer.push(key + ': ' + value);
      }
      mainBuffer.push(metaBuffer.join('\n'));
      /* End meta data */

      /* Add sections */
      if (this.logicWrapper?.currentKey) {
        this.sections.forEach((section) => {
          mainBuffer.push('');
          if (section.title) mainBuffer.push(section.title);
          section.lines?.forEach((line) => {
            let lineBuffer = [];
            switch (line.TYPE) {
              case 'ONELINE':
                lineBuffer = [];
                line.oneLine.forEach((e) => {
                  if (e instanceof Chord) lineBuffer.push(e.transposedChord());
                  else lineBuffer.push(e);
                });
                mainBuffer.push(lineBuffer.join(' '));
                break;
              case 'LYRICS':
                mainBuffer.push(line.lyrics);
                break;
              case 'LYRICS_AND_CHORDS':
                lineBuffer = [];
                let chordLine = '';
                let lyricsLine = '';
                line.pairs.forEach((pair) => {
                  let chordO = pair.chord;
                  let lyrics = pair.lyrics;
                  if (chordO) {
                    let chord = chordO.transposedChord();
                    chordLine +=
                      chord +
                      spaces(
                        Math.max(
                          1,
                          (pair.lyrics ? pair.lyrics.length : 0) - chord.length
                        )
                      );
                  } else {
                    chordLine += spaces(pair.lyrics.length);
                  }
                  if (pair.lyrics) {
                    lyricsLine +=
                      lyrics +
                      spaces(
                        Math.max(
                          0,
                          chordO?.transposedChord().length - lyrics.length
                        )
                      );
                  }
                });
                lineBuffer.push(chordLine);
                lineBuffer.push(lyricsLine);
                mainBuffer.push(lineBuffer.join('\n'));
            }
          });
        });
      }
      return mainBuffer.join('\n');
    }
    /* Append to target */
  }
  generateFileName() {
    return (
      (this.metadata.title ?? '') +
      ' - ' +
      (this.metadata.artist ?? '') +
      ' (' +
      (this.logicWrapper.currentKey ?? '') +
      ')'
    );
  }
}
