import { AssessmentItem, ClueItem, TaskItem } from '../types/game';

// 3 Story Clues strictly adhering to the prompt specification
export const STORY_CLUES: ClueItem[] = [
  {
    id: 'clue-1',
    missionId: 'bilik_darjah',
    title: 'Petunjuk 1: Nota di Bilik Darjah',
    sentence: 'Ali membawa kotak biru keluar dari bilik darjah selepas kelas seni.',
    locationName: 'Bilik Darjah',
    foundAt: 'Meja Guru (Catatan Seni)',
    iconName: 'FileText'
  },
  {
    id: 'clue-2',
    missionId: 'kantin',
    title: 'Petunjuk 2: Jejak di Kantin',
    sentence: 'Selepas melalui kantin, Ali pergi ke perpustakaan.',
    locationName: 'Kantin Sekolah',
    foundAt: 'Kaunter Makanan (Saksi Murid)',
    iconName: 'Footprints'
  },
  {
    id: 'clue-3',
    missionId: 'perpustakaan',
    title: 'Petunjuk 3: Lokasi Akhir di Perpustakaan',
    sentence: 'Kotak biru diletakkan di sebelah rak buku.',
    locationName: 'Perpustakaan',
    foundAt: 'Sudut Bacaan (Sebelah Rak Buku Kayu)',
    iconName: 'Box'
  }
];

// Tasks for Mission 1: Bilik Darjah (Classroom)
export const CLASSROOM_TASKS: TaskItem[] = [
  {
    id: 'task-bd-1',
    missionId: 'bilik_darjah',
    learningObjective: 'Memahami hubungan ruang "di bawah" dalam ayat mudah.',
    interactionObjectName: 'Meja Murid & Guru',
    promptText: 'Periksa meja murid di hadapan papan hitam.',
    targetSentence: 'Buku merah berada di bawah meja.',
    highlightWords: ['Buku merah', 'di bawah meja'],
    segmentedPhrases: ['Buku merah', 'berada', 'di bawah meja'],
    workedExample: {
      exampleSentence: 'Contoh: "Kasut berada di bawah katil" bermaksud kasut terletak di bahagian bawah, bukan di atas.',
      explanation: 'Perhatikan perkataan "di bawah" bermaksud objek berada di ruang bawah perabot.',
      visualClue: 'Ikon anak panah menunjuk ke ruang bawah meja.'
    },
    options: [
      {
        id: 'opt-bd1-a',
        label: 'Buku merah di bawah meja',
        description: 'Buku berwarna merah terletak di lantai betul-betul di bawah kaki meja.',
        isCorrect: true,
        visualDetail: { type: 'desk', color: '#ef4444', subObject: 'Buku Merah', relation: 'bawah' }
      },
      {
        id: 'opt-bd1-b',
        label: 'Buku merah di atas meja',
        description: 'Buku berwarna merah terletak di permukaan atas meja.',
        isCorrect: false,
        visualDetail: { type: 'desk', color: '#ef4444', subObject: 'Buku Merah', relation: 'atas' }
      },
      {
        id: 'opt-bd1-c',
        label: 'Buku merah di sebelah meja',
        description: 'Buku berwarna merah diletakkan di sisi luar meja.',
        isCorrect: false,
        visualDetail: { type: 'desk', color: '#ef4444', subObject: 'Buku Merah', relation: 'sebelah' }
      }
    ]
  },
  {
    id: 'task-bd-2',
    missionId: 'bilik_darjah',
    learningObjective: 'Mengenal pasti objek dan kedudukan "di atas" meja guru.',
    interactionObjectName: 'Meja Guru',
    promptText: 'Siasat barang yang tertinggal di atas meja guru.',
    targetSentence: 'Pemadam hitam diletakkan di atas meja guru.',
    highlightWords: ['Pemadam hitam', 'di atas meja guru'],
    segmentedPhrases: ['Pemadam hitam', 'diletakkan', 'di atas meja guru'],
    workedExample: {
      exampleSentence: 'Contoh: "Pen biru berada di atas meja."',
      explanation: '"Di atas" menunjukkan objek berada di atas permukaan perabot.',
      visualClue: 'Objek terletak di paras atas meja.'
    },
    options: [
      {
        id: 'opt-bd2-a',
        label: 'Pemadam hitam di dalam laci',
        description: 'Pemadam disimpan tersorok di dalam laci meja.',
        isCorrect: false,
        visualDetail: { type: 'desk', color: '#1f2937', subObject: 'Pemadam Hitam', relation: 'dalam' }
      },
      {
        id: 'opt-bd2-b',
        label: 'Pemadam hitam di atas meja guru',
        description: 'Pemadam hitam terletak jelas di atas permukaan meja guru.',
        isCorrect: true,
        visualDetail: { type: 'desk', color: '#1f2937', subObject: 'Pemadam Hitam', relation: 'atas' }
      },
      {
        id: 'opt-bd2-c',
        label: 'Pemadam hitam di bawah kerusi',
        description: 'Pemadam terjatuh di lantai bawah kerusi.',
        isCorrect: false,
        visualDetail: { type: 'chair', color: '#1f2937', subObject: 'Pemadam Hitam', relation: 'bawah' }
      }
    ]
  },
  {
    id: 'task-bd-3',
    missionId: 'bilik_darjah',
    learningObjective: 'Memahami frasa perbuatan dan lokasi bekas "di dalam beg".',
    interactionObjectName: 'Rak Beg Sekolah',
    promptText: 'Lihat beg sekolah di sudut bilik darjah untuk mencari nota Ali.',
    targetSentence: 'Ali menyimpan pensel warna di dalam beg.',
    highlightWords: ['pensel warna', 'di dalam beg'],
    segmentedPhrases: ['Ali menyimpan', 'pensel warna', 'di dalam beg'],
    workedExample: {
      exampleSentence: 'Contoh: "Air disimpan di dalam botol."',
      explanation: '"Di dalam" bermaksud objek berada di ruang dalam sesuatu bekas atau beg.',
      visualClue: 'Pensel warna dimasukkan ke dalam zip beg sekolah.'
    },
    options: [
      {
        id: 'opt-bd3-a',
        label: 'Pensel warna di dalam beg',
        description: 'Set pensel warna dimasukkan kemas di dalam beg Ali.',
        isCorrect: true,
        visualDetail: { type: 'shelf', color: '#3b82f6', subObject: 'Pensel Warna', relation: 'dalam' }
      },
      {
        id: 'opt-bd3-b',
        label: 'Pensel warna di luar beg di atas lantai',
        description: 'Pensel warna bersepah di lantai kelas.',
        isCorrect: false,
        visualDetail: { type: 'shelf', color: '#3b82f6', subObject: 'Pensel Warna', relation: 'sebelah' }
      },
      {
        id: 'opt-bd3-c',
        label: 'Pensel warna di atas kipas siling',
        description: 'Bukan tempat letak pensel warna.',
        isCorrect: false,
        visualDetail: { type: 'shelf', color: '#3b82f6', subObject: 'Pensel Warna', relation: 'atas' }
      }
    ]
  }
];

// Tasks for Mission 2: Kantin (Canteen)
export const CANTEEN_TASKS: TaskItem[] = [
  {
    id: 'task-kn-1',
    missionId: 'kantin',
    learningObjective: 'Memahami ayat tentang susunan objek di kawasan kantin.',
    interactionObjectName: 'Kaunter Makanan',
    promptText: 'Periksa susunan barang di atas kaunter sajian kantin.',
    targetSentence: 'Dulang makanan disusun di atas kaunter kantin.',
    highlightWords: ['Dulang makanan', 'di atas kaunter kantin'],
    segmentedPhrases: ['Dulang makanan', 'disusun', 'di atas kaunter kantin'],
    workedExample: {
      exampleSentence: 'Contoh: "Pinggan diletakkan di atas meja."',
      explanation: 'Cari tempat sajian (kaunter) dan pastikan objek dulang berada di bahagian atas permukaannya.',
      visualClue: 'Dulang berada di atas kaunter putih kantin.'
    },
    options: [
      {
        id: 'opt-kn1-a',
        label: 'Dulang makanan di bawah kerusi kantin',
        description: 'Dulang diletakkan di lantai bawah kerusi panjang.',
        isCorrect: false,
        visualDetail: { type: 'chair', color: '#f59e0b', subObject: 'Dulang Makanan', relation: 'bawah' }
      },
      {
        id: 'opt-kn1-b',
        label: 'Dulang makanan di atas kaunter kantin',
        description: 'Dulang makanan tersusun bertingkat di atas permukaan kaunter kantin.',
        isCorrect: true,
        visualDetail: { type: 'canteen', color: '#f59e0b', subObject: 'Dulang Makanan', relation: 'atas' }
      },
      {
        id: 'opt-kn1-c',
        label: 'Dulang makanan di luar pagar sekolah',
        description: 'Dulang di luar kawasan kantin.',
        isCorrect: false,
        visualDetail: { type: 'canteen', color: '#f59e0b', subObject: 'Dulang Makanan', relation: 'sebelah' }
      }
    ]
  },
  {
    id: 'task-kn-2',
    missionId: 'kantin',
    learningObjective: 'Menyusun urutan peristiwa berdasarkan maklumat bertulis (Sequencing).',
    interactionObjectName: 'Papan Kenyataan Kantin',
    promptText: 'Susun urutan perjalanan Ali mengikut masa yang betul.',
    targetSentence: 'Susun peristiwa: Bilik Darjah -> Kantin -> Perpustakaan.',
    highlightWords: ['Ali membawa kotak keluar', 'Ali melalui kantin', 'Ali pergi ke perpustakaan'],
    segmentedPhrases: ['Peristiwa 1: Kelas Seni', 'Peristiwa 2: Kantin', 'Peristiwa 3: Perpustakaan'],
    workedExample: {
      exampleSentence: 'Mula-mula Ali di kelas seni, kemudian dia berjalan ke kantin, akhirnya ke perpustakaan.',
      explanation: 'Nombor 1 ialah peristiwa awal, nombor 2 di tengah, dan nombor 3 destinasi terakhir.',
      visualClue: 'Garis masa: Kelas -> Kantin -> Perpustakaan.'
    },
    options: [
      {
        id: 'opt-kn2-correct',
        label: '1: Kelas Seni -> 2: Kantin -> 3: Perpustakaan',
        description: 'Urutan yang tepat: Ali keluar kelas, berjalan melalui kantin, lalu menuju perpustakaan.',
        isCorrect: true
      },
      {
        id: 'opt-kn2-wrong1',
        label: '1: Perpustakaan -> 2: Kelas Seni -> 3: Kantin',
        description: 'Urutan terbalik tidak mengikut kronologi cerita.',
        isCorrect: false
      },
      {
        id: 'opt-kn2-wrong2',
        label: '1: Kantin -> 2: Perpustakaan -> 3: Kelas Seni',
        description: 'Ali bermula di bilik darjah seni, bukan di kantin.',
        isCorrect: false
      }
    ],
    sequencingItems: [
      { id: 'seq-1', text: 'Ali membawa kotak keluar dari bilik darjah.', correctOrder: 1 },
      { id: 'seq-2', text: 'Ali melalui kantin sekolah.', correctOrder: 2 },
      { id: 'seq-3', text: 'Ali pergi ke perpustakaan.', correctOrder: 3 }
    ]
  },
  {
    id: 'task-kn-3',
    missionId: 'kantin',
    learningObjective: 'Memadankan maklumat saksi bertulis dengan arah pergerakan.',
    interactionObjectName: 'Meja Makan Kantin',
    promptText: 'Tanyakan rakan murid yang sedang duduk di meja kantin.',
    targetSentence: 'Rakan murid melihat Ali berjalan menuju ke arah perpustakaan.',
    highlightWords: ['berjalan menuju', 'ke arah perpustakaan'],
    segmentedPhrases: ['Rakan murid melihat', 'Ali berjalan', 'menuju ke arah perpustakaan'],
    workedExample: {
      exampleSentence: 'Contoh: "Ahmad berjalan menuju ke padang."',
      explanation: 'Ayat memberitahu arah pergerakan Ali selepas meninggalkan kantin.',
      visualClue: 'Arah anak panah menuju ke pintu perpustakaan.'
    },
    options: [
      {
        id: 'opt-kn3-a',
        label: 'Ali berjalan menuju ke perpustakaan',
        description: 'Ali membawa kotak melangkah ke koridor perpustakaan.',
        isCorrect: true,
        visualDetail: { type: 'canteen', color: '#10b981', subObject: 'Ali Berjalan', relation: 'sebelah' }
      },
      {
        id: 'opt-kn3-b',
        label: 'Ali sedang tidur di atas rumput',
        description: 'Bukan tindakan yang dinyatakan oleh saksi.',
        isCorrect: false,
        visualDetail: { type: 'canteen', color: '#6b7280', subObject: 'Ali Tidur', relation: 'bawah' }
      },
      {
        id: 'opt-kn3-c',
        label: 'Ali berpatah balik ke padang bola',
        description: 'Saksi menyatakan Ali ke arah perpustakaan.',
        isCorrect: false,
        visualDetail: { type: 'canteen', color: '#ef4444', subObject: 'Ali ke Padang', relation: 'atas' }
      }
    ]
  }
];

// Tasks for Mission 3: Perpustakaan (Library)
export const LIBRARY_TASKS: TaskItem[] = [
  {
    id: 'task-pp-1',
    missionId: 'perpustakaan',
    learningObjective: 'Memahami kedudukan objek "di atas rak buku".',
    interactionObjectName: 'Rak Buku Utama',
    promptText: 'Periksa rak buku barisan hadapan di perpustakaan.',
    targetSentence: 'Buku cerita tersusun rapi di atas rak buku.',
    highlightWords: ['Buku cerita', 'di atas rak buku'],
    segmentedPhrases: ['Buku cerita', 'tersusun rapi', 'di atas rak buku'],
    workedExample: {
      exampleSentence: 'Contoh: "Pasu bunga terletak di atas almari."',
      explanation: '"Di atas" bermakna buku-buku diletakkan pada para-para rak.',
      visualClue: 'Buku berderet tegak di atas para rak buku.'
    },
    options: [
      {
        id: 'opt-pp1-a',
        label: 'Buku cerita tersusun rapi di atas rak buku',
        description: 'Buku-buku berdiri kemas di atas para rak kayu.',
        isCorrect: true,
        visualDetail: { type: 'shelf', color: '#8b5cf6', subObject: 'Buku Cerita', relation: 'atas' }
      },
      {
        id: 'opt-pp1-b',
        label: 'Buku terapung di siling lampu',
        description: 'Keadaan yang mustahil.',
        isCorrect: false,
        visualDetail: { type: 'shelf', color: '#8b5cf6', subObject: 'Buku Siling', relation: 'atas' }
      },
      {
        id: 'opt-pp1-c',
        label: 'Buku dibuang di dalam tong sampah luar',
        description: 'Buku perpustakaan disusun di atas rak.',
        isCorrect: false,
        visualDetail: { type: 'shelf', color: '#8b5cf6', subObject: 'Tong Sampah', relation: 'dalam' }
      }
    ]
  },
  {
    id: 'task-pp-2',
    missionId: 'perpustakaan',
    learningObjective: 'Memahami perbuatan dan suasana membaca di meja bulat.',
    interactionObjectName: 'Meja Bulat Sudut Bacaan',
    promptText: 'Periksa murid yang sedang membaca di meja bulat.',
    targetSentence: 'Murid membaca buku dengan senyap di meja bulat.',
    highlightWords: ['membaca buku dengan senyap', 'di meja bulat'],
    segmentedPhrases: ['Murid membaca buku', 'dengan senyap', 'di meja bulat'],
    workedExample: {
      exampleSentence: 'Contoh: "Bapa membaca surat khabar di sofa."',
      explanation: 'Fahami aktiviti yang sedang berlangsung di meja kajian berbentuk bulat.',
      visualClue: 'Murid duduk sopan di kerusi meja bulat sambil menatap buku.'
    },
    options: [
      {
        id: 'opt-pp2-a',
        label: 'Murid bermain bola sepak di dalam perpustakaan',
        description: 'Tidak mematuhi peraturan perpustakaan.',
        isCorrect: false,
        visualDetail: { type: 'chair', color: '#ef4444', subObject: 'Bermain Bola', relation: 'sebelah' }
      },
      {
        id: 'opt-pp2-b',
        label: 'Murid membaca buku dengan senyap di meja bulat',
        description: 'Murid tekun membaca buku di atas meja bulat perpustakaan.',
        isCorrect: true,
        visualDetail: { type: 'chair', color: '#0ea5e9', subObject: 'Membaca Senyap', relation: 'atas' }
      },
      {
        id: 'opt-pp2-c',
        label: 'Murid melompat di atas meja tinggi',
        description: 'Kelakuan merbahaya dan salah.',
        isCorrect: false,
        visualDetail: { type: 'chair', color: '#f97316', subObject: 'Melompat', relation: 'atas' }
      }
    ]
  },
  {
    id: 'task-pp-3',
    missionId: 'perpustakaan',
    learningObjective: 'Menentukan lokasi kotak biru menggunakan kata sendi nama "di sebelah".',
    interactionObjectName: 'Sudut Rak Buku Kayu',
    promptText: 'Periksa kawasan tersembunyi berhampiran rak buku.',
    targetSentence: 'Kotak biru diletakkan di sebelah rak buku.',
    highlightWords: ['Kotak biru', 'di sebelah rak buku'],
    segmentedPhrases: ['Kotak biru', 'diletakkan', 'di sebelah rak buku'],
    workedExample: {
      exampleSentence: 'Contoh: "Meja berada di sebelah pintu" bermaksud kedudukannya bersebelahan di sisi samping.',
      explanation: 'Perhatikan kata "di sebelah" - cari kotak di sisi samping rak, bukan di dalam atau di atasnya.',
      visualClue: 'Kotak biru terletak di lantai bersebelahan tepi rak buku.'
    },
    options: [
      {
        id: 'opt-pp3-a',
        label: 'Kotak biru di atas pokok luar',
        description: 'Di luar kawasan sekolah.',
        isCorrect: false,
        visualDetail: { type: 'box', color: '#2563eb', subObject: 'Kotak Biru', relation: 'atas' }
      },
      {
        id: 'opt-pp3-b',
        label: 'Kotak biru diletakkan di sebelah rak buku',
        description: 'Kotak biru terletak kemas di lantai di sisi sebelah rak buku perpustakaan.',
        isCorrect: true,
        visualDetail: { type: 'box', color: '#2563eb', subObject: 'Kotak Biru', relation: 'sebelah' }
      },
      {
        id: 'opt-pp3-c',
        label: 'Kotak biru di dalam periuk sup kantin',
        description: 'Salah lokasi.',
        isCorrect: false,
        visualDetail: { type: 'box', color: '#2563eb', subObject: 'Kotak Biru', relation: 'dalam' }
      }
    ]
  }
];

// Baseline Assessment (10 items - Penilaian Pra-Intervensi)
export const BASELINE_ASSESSMENT_ITEMS: AssessmentItem[] = [
  {
    id: 'base-01',
    code: 'BASE-01',
    targetSkill: 'Hubungan Ruang: "di bawah"',
    difficulty: 'Asas',
    sentence: 'Bola berada di bawah kerusi.',
    explanation: 'Objek bola terletak di bahagian bawah kerusi, bukan di atas atau di sebelah.',
    options: [
      { id: 'b1-a', text: 'Bola di bawah kerusi', isCorrect: true, visualType: 'under' },
      { id: 'b1-b', text: 'Bola di atas kerusi', isCorrect: false, visualType: 'on' },
      { id: 'b1-c', text: 'Bola di sebelah kerusi', isCorrect: false, visualType: 'beside' }
    ]
  },
  {
    id: 'base-02',
    code: 'BASE-02',
    targetSkill: 'Hubungan Ruang: "di atas"',
    difficulty: 'Asas',
    sentence: 'Cawan berada di atas meja.',
    explanation: 'Cawan diletakkan pada permukaan atas meja.',
    options: [
      { id: 'b2-a', text: 'Cawan di bawah meja', isCorrect: false, visualType: 'under' },
      { id: 'b2-b', text: 'Cawan di atas meja', isCorrect: true, visualType: 'on' },
      { id: 'b2-c', text: 'Cawan di dalam beg', isCorrect: false, visualType: 'inside' }
    ]
  },
  {
    id: 'base-03',
    code: 'BASE-03',
    targetSkill: 'Hubungan Ruang: "di dalam"',
    difficulty: 'Asas',
    sentence: 'Pensel berada di dalam kotak pensel.',
    explanation: 'Pensel disimpan di dalam ruang bekas kotak pensel.',
    options: [
      { id: 'b3-a', text: 'Pensel di dalam kotak pensel', isCorrect: true, visualType: 'inside' },
      { id: 'b3-b', text: 'Pensel di bawah kasut', isCorrect: false, visualType: 'under' },
      { id: 'b3-c', text: 'Pensel di atas kipas', isCorrect: false, visualType: 'on' }
    ]
  },
  {
    id: 'base-04',
    code: 'BASE-04',
    targetSkill: 'Hubungan Ruang: "di sebelah"',
    difficulty: 'Sederhana',
    sentence: 'Beg sekolah berada di sebelah pintu.',
    explanation: 'Beg terletak di tepi sisi pintu bilik darjah.',
    options: [
      { id: 'b4-a', text: 'Beg sekolah di atas pintu', isCorrect: false, visualType: 'on' },
      { id: 'b4-b', text: 'Beg sekolah di sebelah pintu', isCorrect: true, visualType: 'beside' },
      { id: 'b4-c', text: 'Beg sekolah di bawah tanah', isCorrect: false, visualType: 'under' }
    ]
  },
  {
    id: 'base-05',
    code: 'BASE-05',
    targetSkill: 'Pemahaman Kata Kerja Tindakan',
    difficulty: 'Sederhana',
    sentence: 'Siti menyusun buku di atas rak.',
    explanation: 'Perbuatan yang dinyatakan ialah "menyusun buku".',
    options: [
      { id: 'b5-a', text: 'Siti menyusun buku di atas rak', isCorrect: true, visualType: 'action-arrange' },
      { id: 'b5-b', text: 'Siti menendang bola di padang', isCorrect: false, visualType: 'action-kick' },
      { id: 'b5-c', text: 'Siti tidur di atas katil', isCorrect: false, visualType: 'action-sleep' }
    ]
  },
  {
    id: 'base-06',
    code: 'BASE-06',
    targetSkill: 'Pengecaman Objek & Warna',
    difficulty: 'Asas',
    sentence: 'Baju merah tersidai di ampaian.',
    explanation: 'Objek baju berwarna merah berada di ampaian.',
    options: [
      { id: 'b6-a', text: 'Baju biru berlipat di dalam almari', isCorrect: false, visualType: 'blue-shirt' },
      { id: 'b6-b', text: 'Baju merah tersidai di ampaian', isCorrect: true, visualType: 'red-shirt' },
      { id: 'b6-c', text: 'Seluar hitam di atas lantai', isCorrect: false, visualType: 'black-pants' }
    ]
  },
  {
    id: 'base-07',
    code: 'BASE-07',
    targetSkill: 'Hubungan Ruang Gabungan',
    difficulty: 'Sederhana',
    sentence: 'Kasut hitam diletakkan di bawah bangku.',
    explanation: 'Kasut hitam terletak di bahagian bawah bangku.',
    options: [
      { id: 'b7-a', text: 'Kasut hitam di atas meja guru', isCorrect: false, visualType: 'on' },
      { id: 'b7-b', text: 'Kasut hitam di bawah bangku', isCorrect: true, visualType: 'under' },
      { id: 'b7-c', text: 'Kasut hitam di dalam akuarium', isCorrect: false, visualType: 'inside' }
    ]
  },
  {
    id: 'base-08',
    code: 'BASE-08',
    targetSkill: 'Pemahaman Lokasi Sekolah',
    difficulty: 'Sederhana',
    sentence: 'Murid beratur membeli makanan di kantin.',
    explanation: 'Aktiviti membeli makanan berlaku di kantin sekolah.',
    options: [
      { id: 'b8-a', text: 'Murid beratur membeli makanan di kantin', isCorrect: true, visualType: 'canteen' },
      { id: 'b8-b', text: 'Murid mandi di kolam renang', isCorrect: false, visualType: 'pool' },
      { id: 'b8-c', text: 'Murid tidur di bilik guru', isCorrect: false, visualType: 'office' }
    ]
  },
  {
    id: 'base-09',
    code: 'BASE-09',
    targetSkill: 'Hubungan Ruang: "di hadapan"',
    difficulty: 'Pengukuhan',
    sentence: 'Cikgu berdiri di hadapan kelas.',
    explanation: 'Guru berada di posisi hadapan bilik darjah berdekatan papan putih.',
    options: [
      { id: 'b9-a', text: 'Cikgu bersembunyi di belakang pintu', isCorrect: false, visualType: 'behind' },
      { id: 'b9-b', text: 'Cikgu berdiri di hadapan kelas', isCorrect: true, visualType: 'front' },
      { id: 'b9-c', text: 'Cikgu duduk di atas bumbung', isCorrect: false, visualType: 'top' }
    ]
  },
  {
    id: 'base-10',
    code: 'BASE-10',
    targetSkill: 'Pemahaman Ayat Berturutan',
    difficulty: 'Pengukuhan',
    sentence: 'Ahmad membasuh tangan sebelum makan.',
    explanation: 'Perbuatan membasuh tangan dilakukan terlebih dahulu sebelum makan.',
    options: [
      { id: 'b10-a', text: 'Ahmad membasuh tangan sebelum makan', isCorrect: true, visualType: 'wash' },
      { id: 'b10-b', text: 'Ahmad terus makan dengan tangan kotor', isCorrect: false, visualType: 'dirty' },
      { id: 'b10-c', text: 'Ahmad membuang makanan ke lantai', isCorrect: false, visualType: 'waste' }
    ]
  }
];

// Post-Intervention Assessment (10 parallel items - Penilaian Pasca-Intervensi)
export const POST_ASSESSMENT_ITEMS: AssessmentItem[] = [
  {
    id: 'post-01',
    code: 'POST-01',
    targetSkill: 'Hubungan Ruang: "di bawah"',
    difficulty: 'Asas',
    sentence: 'Kucing comel tidur di bawah meja.',
    explanation: 'Objek kucing berada di bahagian ruang bawah meja.',
    options: [
      { id: 'p1-a', text: 'Kucing tidur di atas bumbung', isCorrect: false, visualType: 'on' },
      { id: 'p1-b', text: 'Kucing comel tidur di bawah meja', isCorrect: true, visualType: 'under' },
      { id: 'p1-c', text: 'Kucing berada di dalam peti ais', isCorrect: false, visualType: 'inside' }
    ]
  },
  {
    id: 'post-02',
    code: 'POST-02',
    targetSkill: 'Hubungan Ruang: "di atas"',
    difficulty: 'Asas',
    sentence: 'Buku teks terletak di atas meja belajar.',
    explanation: 'Buku berada di permukaan atas meja belajar.',
    options: [
      { id: 'p2-a', text: 'Buku teks terletak di atas meja belajar', isCorrect: true, visualType: 'on' },
      { id: 'p2-b', text: 'Buku teks di bawah tayar basikal', isCorrect: false, visualType: 'under' },
      { id: 'p2-c', text: 'Buku teks hanyut di longkang', isCorrect: false, visualType: 'water' }
    ]
  },
  {
    id: 'post-03',
    code: 'POST-03',
    targetSkill: 'Hubungan Ruang: "di dalam"',
    difficulty: 'Asas',
    sentence: 'Duit syiling disimpan di dalam tabung.',
    explanation: 'Duit syiling dimasukkan ke ruang dalam tabung simpanan.',
    options: [
      { id: 'p3-a', text: 'Duit syiling berterabur di rumput', isCorrect: false, visualType: 'grass' },
      { id: 'p3-b', text: 'Duit syiling disimpan di dalam tabung', isCorrect: true, visualType: 'inside' },
      { id: 'p3-c', text: 'Duit syiling tersangkut di awan', isCorrect: false, visualType: 'cloud' }
    ]
  },
  {
    id: 'post-04',
    code: 'POST-04',
    targetSkill: 'Hubungan Ruang: "di sebelah"',
    difficulty: 'Sederhana',
    sentence: 'Tong sampah diletakkan di sebelah sinki.',
    explanation: 'Kedudukan tong sampah bersebelahan dengan sinki cuci tangan.',
    options: [
      { id: 'p4-a', text: 'Tong sampah di sebelah sinki', isCorrect: true, visualType: 'beside' },
      { id: 'p4-b', text: 'Tong sampah di atas meja makan', isCorrect: false, visualType: 'on' },
      { id: 'p4-c', text: 'Tong sampah di dalam periuk nasi', isCorrect: false, visualType: 'inside' }
    ]
  },
  {
    id: 'post-05',
    code: 'POST-05',
    targetSkill: 'Pemahaman Kata Kerja Tindakan',
    difficulty: 'Sederhana',
    sentence: 'Amin memadam papan putih di hadapan kelas.',
    explanation: 'Tindakan yang dinyatakan ialah "memadam papan putih".',
    options: [
      { id: 'p5-a', text: 'Amin tidur berdengkur di lantai', isCorrect: false, visualType: 'sleep' },
      { id: 'p5-b', text: 'Amin memadam papan putih di hadapan kelas', isCorrect: true, visualType: 'erase' },
      { id: 'p5-c', text: 'Amin melukis di dinding tandas', isCorrect: false, visualType: 'vandal' }
    ]
  },
  {
    id: 'post-06',
    code: 'POST-06',
    targetSkill: 'Pengecaman Objek & Warna',
    difficulty: 'Asas',
    sentence: 'Topi kuning tergantung di dinding.',
    explanation: 'Objek topi berwarna kuning tergantung di dinding bilik.',
    options: [
      { id: 'post6-a', text: 'Topi kuning tergantung di dinding', isCorrect: true, visualType: 'yellow-hat' },
      { id: 'post6-b', text: 'Kasut hijau di atas rumput', isCorrect: false, visualType: 'green-shoe' },
      { id: 'post6-c', text: 'Payung merah tertinggal di bas', isCorrect: false, visualType: 'red-umbrella' }
    ]
  },
  {
    id: 'post-07',
    code: 'POST-07',
    targetSkill: 'Hubungan Ruang Gabungan',
    difficulty: 'Sederhana',
    sentence: 'Bakul sampah berada di bawah meja komputer.',
    explanation: 'Bakul sampah terletak di lantai bawah meja komputer.',
    options: [
      { id: 'p7-a', text: 'Bakul sampah di atas skrin komputer', isCorrect: false, visualType: 'on' },
      { id: 'p7-b', text: 'Bakul sampah berada di bawah meja komputer', isCorrect: true, visualType: 'under' },
      { id: 'p7-c', text: 'Bakul sampah terbang di udara', isCorrect: false, visualType: 'air' }
    ]
  },
  {
    id: 'post-08',
    code: 'POST-08',
    targetSkill: 'Pemahaman Lokasi Sekolah',
    difficulty: 'Sederhana',
    sentence: 'Murid meminjam buku cerita di perpustakaan.',
    explanation: 'Aktiviti meminjam buku cerita bertempat di perpustakaan sekolah.',
    options: [
      { id: 'p8-a', text: 'Murid meminjam buku cerita di perpustakaan', isCorrect: true, visualType: 'library' },
      { id: 'p8-b', text: 'Murid memancing ikan di padang bola', isCorrect: false, visualType: 'fish' },
      { id: 'p8-c', text: 'Murid memanjat tiang bendera', isCorrect: false, visualType: 'climb' }
    ]
  },
  {
    id: 'post-09',
    code: 'POST-09',
    targetSkill: 'Hubungan Ruang: "di hadapan"',
    difficulty: 'Pengukuhan',
    sentence: 'Kereta guru diletakkan di hadapan pintu pagar.',
    explanation: 'Posisi kenderaan guru berada di bahagian hadapan pintu pagar sekolah.',
    options: [
      { id: 'p9-a', text: 'Kereta terapung di dalam longkang', isCorrect: false, visualType: 'in' },
      { id: 'p9-b', text: 'Kereta guru diletakkan di hadapan pintu pagar', isCorrect: true, visualType: 'front' },
      { id: 'p9-c', text: 'Kereta berada di atas pokok kelapa', isCorrect: false, visualType: 'tree' }
    ]
  },
  {
    id: 'post-10',
    code: 'POST-10',
    targetSkill: 'Pemahaman Ayat Berturutan',
    difficulty: 'Pengukuhan',
    sentence: 'Farah menyusun kerusi selepas loceng berbunyi.',
    explanation: 'Urutan tindakan: loceng berbunyi terlebih dahulu, diikuti perbuatan menyusun kerusi.',
    options: [
      { id: 'p10-a', text: 'Farah menyusun kerusi selepas loceng berbunyi', isCorrect: true, visualType: 'bell-chair' },
      { id: 'p10-b', text: 'Farah melompat keluar tingkap sekolah', isCorrect: false, visualType: 'window' },
      { id: 'p10-c', text: 'Farah memecahkan lampu kelas', isCorrect: false, visualType: 'break' }
    ]
  }
];
