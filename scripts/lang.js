const PUBLISH_YEAR = 'publish_year';
const COPYRIGHT = 'copyright';
const SONG_TITLE = 'song_title';
const ARTIST_NAME = 'artist_name';
const ALBUM_NAME = 'album_name';
const WEB_PAGE = 'web_page';
const ALBUM = 'album';

const no = {
  description: {
    title: 'Blekkegenerator',
    subtitle: 'for generering av blekker til Lovsang.no',
  },
  howTo: {
    showVideoButton: 'Se video',
    example: {
      show: 'Vis eksempel',
      hide: 'Skjul eksempel',
    },
    newSong: 'Ny sang',
    title: 'Slik gjør du',
    list: [
      'Fyll inn data om sangen (* betyr at feltet er obligatorisk)',
      'Skriv akkorder og tekst inn i riktig format (se eksempel eller video)',
      'Last ned fil og legg ved denne når du sender inn info-dokumentet',
    ],
    contactUsIfNeeded:
      'Ikke nøl med å ta kontakt på <a href="mailto:sanger@lovsang.no">sanger@lovsang.no</a> om du lurer på noe.',
  },
  helperSheet: {
    show: 'Vis detaljer',
    hide: 'Skjul detaljer',
  },
  boxes: {
    input: {
      label: 'Skriv inn her',
    },
    result: {
      label: 'Forhåndsvisning',
    },
  },
  downloadButton: 'Last ned fil',
  errors: {
    noTitleOrArtistError: 'Skriv inn tittel og artist først',
    noTitleBeforeArtistError: 'Skriv inn tittel først',
  },
  copyright: {
    main: `${PUBLISH_YEAR} © ${COPYRIGHT}
    «${SONG_TITLE}» er utgitt på ${ARTIST_NAME} ${ALBUM} «${ALBUM_NAME}» (${PUBLISH_YEAR})
    Husk å rapportere inn all offentlig bruk til TONO (www.tono.no) og CCLI (no.ccli.com)`,
    moreInfo: `Mer info: ${WEB_PAGE}`,
  },
};

const lang = no;

const exampleObject = [
  'Gi meg Jesus',
  'David André Østby',
  'Hele Himmelen',
  '2018',
  'David André Østby, Stig-Øyvind Blystad & Vetle Jarandsen',
  'G',
  '80',
  '4/4',
  'David André Østby, Stig-Øyvind Blystad & Vetle Jarandsen',
  'www.davidostby.no',
  '',
  `| G . . . | D . . . | Am . . . | C . . . | x2

Vers 1:
[G]Hvem kan lyse opp min sti
Som en [Am]lykt for min f[Em]ot
Gjøre natten om til dag
Og gi meg nytt [D]mot

Bro:
[Bm]Du ga meg alt
[D/F#]All min [G]skyld er betalt
[Am]Mine [Bm]synder ble båret av [D]deg

Ord blir for små
Hvem kan fullt ut forstå
Hvilken godhet du øste på meg
`,
];

const defaultObject = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  `Intro:
| G . . . | D . . . | Am . . . | C . . . | x2
`,
];
