# ChordPro-converter

Simple Vanilla JS app for creating chord charts and converting to ChordPro bracketed format.

### Initalize Song object
```javascript
const song = new Song(template)
```

### Parse as HTML text using spaces
```javascript
song.parsePlainHTML(DOMElement)
```

### Parse as table
```javascript
song.parseHTMLTable(DOMElement)
```

### Change whats being parsed 
Default: chords
```javascript
song.parseChords()
song.parseLyrics()
song.parseNashville()
```

### Update template
```javascript
song.reInitialize(template)
```

Huge thank's to @gulaker for helping out in the early stages and with the logic behind this script.
