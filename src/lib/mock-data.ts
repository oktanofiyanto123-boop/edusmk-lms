import {
  UserProfile,
  Department,
  ClassRoom,
  Subject,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  GradeRecord,
  Announcement,
  SchoolSettings,
} from './types';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  id: 'school-main',
  school_name: 'SMK Negeri 1 Digital Nusantara',
  npsn: '20109845',
  address: 'Jl. Vokasi Industri No. 45, Kawasan Sentra Pendidikan Terpadu',
  phone: '(021) 7890-1234',
  email: 'info@edusmk.sch.id',
  website: 'https://edusmk.sch.id',
  principal_name: 'Drs. H. Suryanto, M.Pd.',
  academic_year: '2026/2027',
  active_semester: 'Genap',
  grading_weights: {
    assignments: 40,
    quizzes: 30,
    exams: 30,
  },
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-atph',
    code: 'ATPH',
    name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    description: 'Kompetensi keahlian agroteknologi terpadu mencakup budidaya tanaman pangan, sayuran & buah hortikultura modern, sistem fertigasi hidroponik greenhouse, dan manajemen pascapanen.',
    icon: 'Sprout',
    head_of_department: 'Siti Nurhaliza, S.P.',
    total_students: 138,
  },
  {
    id: 'dept-te',
    code: 'TE',
    name: 'Teknik Elektronika',
    description: 'Kompetensi keahlian elektronika industri, mikrokontroler & sistem tertanam (embedded systems), instrumentasi sensorika, automasi Programmable Logic Controller (PLC), dan sistem kendali daya.',
    icon: 'Cpu',
    head_of_department: 'Ir. Eko Prasetyo, M.T.',
    total_students: 120,
  },
  {
    id: 'dept-dkv',
    code: 'DKV',
    name: 'Desain Komunikasi Visual',
    description: 'Keahlian dalam seni digital, UI/UX design, visual branding, motion graphics, dan animasi kreatif untuk industri multimedia.',
    icon: 'Palette',
    head_of_department: 'Hendra Wijaya, S.Ds.',
    total_students: 96,
  },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-xii-atph-1',
    name: 'XII ATPH 1',
    grade_level: 12,
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-2',
    homeroom_teacher: 'Siti Nurhaliza, S.P.',
    student_count: 35,
  },
  {
    id: 'class-xii-te-1',
    name: 'XII TE 1',
    grade_level: 12,
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-1',
    homeroom_teacher: 'Budi Santoso, S.T., M.T.',
    student_count: 36,
  },
  {
    id: 'class-xii-dkv-1',
    name: 'XII DKV 1',
    grade_level: 12,
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-3',
    homeroom_teacher: 'Hendra Wijaya, S.Ds.',
    student_count: 34,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@edusmk.sch.id',
    full_name: 'Drs. H. Suryanto, M.Pd.',
    role: 'admin',
    nisn_nip: '197508121999031002',
    phone: '0812-3456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-guru-1',
    email: 'budi@edusmk.sch.id',
    full_name: 'Budi Santoso, S.T., M.T.',
    role: 'guru',
    nisn_nip: '198503152010011015',
    phone: '0813-9876-5432',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    status: 'aktif',
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'user-guru-2',
    email: 'siti@edusmk.sch.id',
    full_name: 'Siti Nurhaliza, S.P.',
    role: 'guru',
    nisn_nip: '198906202014022004',
    phone: '0815-5555-4433',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    class_id: 'class-xii-atph-1',
    class_name: 'XII ATPH 1',
    status: 'aktif',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-guru-3',
    email: 'hendra@edusmk.sch.id',
    full_name: 'Hendra Wijaya, S.Ds.',
    role: 'guru',
    nisn_nip: '199104182018011009',
    phone: '0817-2233-4455',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    class_id: 'class-xii-dkv-1',
    class_name: 'XII DKV 1',
    status: 'aktif',
    created_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'user-siswa-1',
    email: 'ahmad@siswa.edusmk.sch.id',
    full_name: 'Ahmad Rizky Pratama',
    role: 'siswa',
    nisn_nip: '0067823412',
    phone: '0857-1122-3344',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-2',
    email: 'rina@siswa.edusmk.sch.id',
    full_name: 'Rina Wulandari',
    role: 'siswa',
    nisn_nip: '0067823413',
    phone: '0858-2233-4455',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-3',
    email: 'dimas@siswa.edusmk.sch.id',
    full_name: 'Dimas Setiawan',
    role: 'siswa',
    nisn_nip: '0067823414',
    phone: '0859-3344-5566',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    class_id: 'class-xii-atph-1',
    class_name: 'XII ATPH 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-4',
    email: 'bayu@siswa.edusmk.sch.id',
    full_name: 'Bayu Anggoro',
    role: 'siswa',
    nisn_nip: '0067823415',
    phone: '0859-4455-6677',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    class_id: 'class-xii-dkv-1',
    class_name: 'XII DKV 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-5',
    email: 'siti.fadhilah@siswa.edusmk.sch.id',
    full_name: 'Siti Fadhilah',
    role: 'siswa',
    nisn_nip: '0067823416',
    phone: '0859-5566-7788',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    class_id: 'class-xii-dkv-1',
    class_name: 'XII DKV 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-6',
    email: 'farhan@siswa.edusmk.sch.id',
    full_name: 'Muhammad Farhan',
    role: 'siswa',
    nisn_nip: '0067823417',
    phone: '0859-6677-8899',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-7',
    email: 'dewi.sartika@siswa.edusmk.sch.id',
    full_name: 'Dewi Sartika',
    role: 'siswa',
    nisn_nip: '0067823418',
    phone: '0859-7788-9900',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    class_id: 'class-xii-atph-1',
    class_name: 'XII ATPH 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-8',
    email: 'fikri@siswa.edusmk.sch.id',
    full_name: 'Fikri Ramadhan',
    role: 'siswa',
    nisn_nip: '0067823419',
    phone: '0859-8899-0011',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-9',
    email: 'nabila@siswa.edusmk.sch.id',
    full_name: 'Nabila Putri',
    role: 'siswa',
    nisn_nip: '0067823420',
    phone: '0859-9900-1122',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-atph-01',
    code: 'C3-ATPH-01',
    name: 'Agribisnis Tanaman Pangan & Hidroponik Modern',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    description: 'Teknik budidaya tanaman pangan (padi, jagung, kedelai), sistem irigasi fertigasi hidroponik greenhouse, manajemen nutrisi tanaman, dan teknologi agroteknologi modern.',
    hours_per_week: 8,
  },
  {
    id: 'sub-atph-02',
    code: 'C3-ATPH-02',
    name: 'Agribisnis Tanaman Sayuran & Buah Semusim',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    description: 'Budidaya hortikultura komoditas sayuran daun, sayuran buah, melon, semangka, dan pengendalian hama penyakit tanaman terpadu (PHT).',
    hours_per_week: 6,
  },
  {
    id: 'sub-atph-03',
    code: 'C3-ATPH-03',
    name: 'Pengelolaan Pascapanen & Agribisnis Digital',
    department_id: 'dept-atph',
    department_name: 'Agribisnis Tanaman Pangan dan Hortikultura',
    description: 'Standardisasi mutu hasil panen, teknik sortasi, grading, pengemasan ramah lingkungan, dan pemasaran agribisnis di marketplace digital.',
    hours_per_week: 4,
  },
  {
    id: 'sub-te-01',
    code: 'C3-TE-01',
    name: 'Mikrokontroler & Otomasi Elektronika Industri',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    description: 'Arsitektur mikrokontroler (Arduino, STM32, ESP32), pemrograman C/C++ embedded systems, aktuator, dan Programmable Logic Controller (PLC) industri.',
    hours_per_week: 8,
  },
  {
    id: 'sub-te-02',
    code: 'C3-TE-02',
    name: 'Teknik Elektronika Daya & Rangkaian Terintegrasi',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    description: 'Analisis komponen semikonduktor daya, rangkaian switching inverter/konverter, perancangan layout PCB profesional, dan proteksi sirkuit kelistrikan.',
    hours_per_week: 6,
  },
  {
    id: 'sub-te-03',
    code: 'C3-TE-03',
    name: 'Sistem Sensorika & Instrumentasi Kendali',
    department_id: 'dept-te',
    department_name: 'Teknik Elektronika',
    description: 'Penerapan transduser suhu, tekanan, ultrasonik, optik, pengondisi sinyal analog ke digital (ADC), dan kalibrasi instrumentasi pabrik.',
    hours_per_week: 4,
  },
  {
    id: 'sub-uiux',
    code: 'C3-DKV-01',
    name: 'Desain Antarmuka Pengguna (UI/UX Design)',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    description: 'Prinsip desain antarmuka modern, typography, color harmony, wireframing, interactive prototyping di Figma, dan usability testing.',
    hours_per_week: 6,
  },
];

export const INITIAL_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat-01',
    subject_id: 'sub-te-01',
    subject_name: 'Mikrokontroler & Otomasi Elektronika Industri',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.T., M.T.',
    title: 'Arsitektur Mikrokontroler ESP32 & Antarmuka Sensor Industri',
    slug: 'arsitektur-mikrokontroler-esp32-sensor-industri',
    description: 'Memahami arsitektur internal mikrokontroler 32-bit ESP32, konfigurasi register GPIO, ADC 12-bit, timer hardware, dan komunikasi serial I2C/SPI.',
    learning_objectives: [
      'Memahami register kendali pin input/output (GPIO) dan penanganan interupsi hardware',
      'Mengonfigurasi ADC internal untuk membaca sensor analog industri (0-10V, 4-20mA)',
      'Menerapkan protokol komunikasi serial I2C dan SPI antar-modul mikrokontroler',
      'Memprogram modulasi lebar pulsa (PWM) untuk kendali aktuator motor DC dan servo',
    ],
    content: `
### 1. Pengenalan Mikrokontroler 32-Bit ESP32
ESP32 merupakan mikrokontroler System on a Chip (SoC) dual-core berbasis Xtensa LX6 dengan frekuensi kerja hingga 240 MHz. Chip ini dilengkapi modul Wi-Fi dan Bluetooth bawaan yang sangat ideal untuk sistem otomasi industri berbasis Industrial IoT (IIoT).

### 2. Konfigurasi Input/Output dan ADC
Untuk membaca data sensor analog seperti sensor suhu LM35 atau sensor tekanan, kita memanfaatkan pin ADC (Analog-to-Digital Converter) dengan resolusi hingga 12-bit (nilai 0 - 4095).

\`\`\`cpp
// Contoh Pembacaan ADC & Kendali Relay di ESP32 (C/C++)
const int sensorPin = 34; // Pin ADC1_CH6
const int relayPin = 23;  // Pin Aktuator Relay
const int thresholdValue = 2500;

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
}

void loop() {
  int rawValue = analogRead(sensorPin);
  Serial.printf("Nilai Sensor: %d\\n", rawValue);
  
  if (rawValue > thresholdValue) {
    digitalWrite(relayPin, HIGH); // Aktifkan pendingin otomatis
  } else {
    digitalWrite(relayPin, LOW);
  }
  delay(500);
}
\`\`\`

### 3. Protokol Komunikasi I2C (Inter-Integrated Circuit)
Protokol I2C menggunakan dua jalur utama: SDA (Serial Data) dan SCL (Serial Clock), memungkinkan mikrokontroler berkomunikasi dengan puluhan sensor cerdas secara efisien dengan pengalamatan heksadesimal 7-bit.
    `.trim(),
    subchapters: [
      {
        id: 'sub-te-1',
        title: 'Bab 1: Struktur Arsitektur Dual-Core & Manajemen Memori',
        content: 'Penjelasan hirarki core CPU PRO_CPU dan APP_CPU, alokasi memori SRAM, dan pemanfaatan non-volatile storage (NVS).',
      },
      {
        id: 'sub-te-2',
        title: 'Bab 2: Interfacing Sensorika Industri & Pengondisi Sinyal',
        content: 'Pemasangan rangkaian pengondisi sinyal analog, filter low-pass RC untuk meredam noise induktif, dan isolasi optocoupler.',
      },
      {
        id: 'sub-te-3',
        title: 'Bab 3: Pemrograman Timer & Pulse Width Modulation (PWM)',
        content: 'Konfigurasi modul LEDC PWM hardware untuk menghasilkan sinyal frekuensi tinggi presisi pada driver motor daya.',
      },
    ],
    status: 'published',
    youtube_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    attachments: [
      {
        id: 'att-1',
        material_id: 'mat-01',
        file_name: 'Skematik_Rangkaian_ESP32_Sensorika.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        file_size: '2.4 MB',
      },
      {
        id: 'att-2',
        material_id: 'mat-01',
        file_name: 'Pinout_Diagram_ESP32_SMK_Elektronika.png',
        file_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        file_type: 'image',
        file_size: '850 KB',
      },
    ],
    order_index: 1,
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-02-12T14:30:00Z',
  },
  {
    id: 'mat-02',
    subject_id: 'sub-te-02',
    subject_name: 'Teknik Elektronika Daya & Rangkaian Terintegrasi',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.T., M.T.',
    title: 'Perancangan Catu Daya Switching (SMPS) & Proteksi Rangkaian Daya',
    slug: 'perancangan-catu-daya-switching-smps',
    description: 'Analisis prinsip kerja switching converter, karakteristik MOSFET daya, induktor ferit, dan proteksi arus lebih untuk mesin industri.',
    learning_objectives: [
      'Memahami keunggulan regulator switching dibanding regulator linier',
      'Menghitung nilai induktansi dan kapasitansi filter riak tegangan DC',
      'Merancang rangkaian proteksi sirkuit pendek (short circuit) menggunakan optocoupler',
    ],
    content: `
### Teknologi Catu Daya Switching (SMPS)
Berbeda dengan catu daya linier yang mendisipasikan kelebihan tegangan menjadi panas, Switched-Mode Power Supply (SMPS) menggunakan transistor sakelar (MOSFET) yang beroperasi pada kondisi jenuh (ON) dan cut-off (OFF) pada frekuensi puluhan hingga ratusan kiloHertz.

Efisiensi SMPS dapat mencapai lebih dari 85-92%, menjadikannya komponen vital pada seluruh instrumen otomasi dan kontrol mesin pabrik modern.
    `.trim(),
    subchapters: [
      {
        id: 'sub-te-2-1',
        title: 'Bab 1: Topologi Buck, Boost, dan Buck-Boost Converter',
        content: 'Penurunan persamaan duty cycle PWM terhadap rasio tegangan keluaran vs masukan pada konverter DC-DC.',
      },
      {
        id: 'sub-te-2-2',
        title: 'Bab 2: Pemilihan Komponen Semikonduktor Daya',
        content: 'Analisis rating tegangan breakdown Vds, arus kontinu Id, Rds(on), dan perhitungan luas pendingin heatsink aluminium.',
      },
    ],
    status: 'published',
    youtube_url: 'https://www.youtube.com/watch?v=Ow_Uzedfohk',
    attachments: [
      {
        id: 'att-3',
        material_id: 'mat-02',
        file_name: 'Panduan_Layout_PCB_CatuDaya_SMPS.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        file_size: '1.8 MB',
      },
    ],
    order_index: 2,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'mat-03',
    subject_id: 'sub-atph-01',
    subject_name: 'Agribisnis Tanaman Pangan & Hidroponik Modern',
    class_id: 'class-xii-atph-1',
    class_name: 'XII ATPH 1',
    teacher_id: 'user-guru-2',
    teacher_name: 'Siti Nurhaliza, S.P.',
    title: 'Teknik Fertigasi & Formulasi Nutrisi AB Mix Hidroponik NFT',
    slug: 'teknik-fertigasi-nutrisi-ab-mix-hidroponik',
    description: 'Panduan komprehensif budidaya hortikultura sistem Nutrient Film Technique (NFT), manajemen electrical conductivity (EC), dan regulasi pH larutan nutrisi.',
    learning_objectives: [
      'Memahami prinsip sirkulasi tipis pada sistem hidroponik NFT (Nutrient Film Technique)',
      'Mampu menghitung dan meracik formula nutrisi AB Mix sesuai fase vegetatif dan generatif',
      'Mengukur dan mengkalibrasi parameter EC (Electrical Conductivity) dan pH larutan',
      'Mendeteksi gejala defisiensi unsur hara makro (N, P, K) dan mikro pada perakaran',
    ],
    content: `
### Penerapan Hidroponik Modern Sistem NFT
Sistem NFT (Nutrient Film Technique) merupakan salah satu metode budidaya tanaman hortikultura yang paling efisien dan banyak diterapkan di industri agribisnis modern. Air dan nutrisi dialirkan dalam lapisan tipis (1-2 mm) melewati perakaran tanaman secara terus-menerus.

\`\`\`text
Formula Kunci Keseimbangan Nutrisi:
- EC Fase Vegetatif: 1.2 - 1.6 mS/cm
- EC Fase Generatif: 1.8 - 2.4 mS/cm
- Ambang Batas pH Optimal: 5.8 - 6.5
- Suhu Larutan Nutrisi: 22°C - 26°C
\`\`\`
    `.trim(),
    subchapters: [
      {
        id: 'sub-atph-1',
        title: 'Bab 1: Instalasi Talang & Kemiringan Sistem NFT',
        content: 'Penentuan kemiringan talang pipa 1-5% untuk menjamin sirkulasi larutan nutrisi tipis mengalir sempurna tanpa genangan berlebih.',
      },
      {
        id: 'sub-atph-2',
        title: 'Bab 2: Manajemen Pemantauan EC & pH Harian',
        content: 'Prosedur kalibrasi instrumen TDS/EC meter dan teknik penambahan larutan buffer pH Down / pH Up.',
      },
    ],
    status: 'published',
    youtube_url: 'https://www.youtube.com/watch?v=Ow_Uzedfohk',
    attachments: [
      {
        id: 'att-atph-1',
        material_id: 'mat-03',
        file_name: 'Tabel_Formulasi_Nutrisi_AB_Mix_Sayuran.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        file_size: '1.2 MB',
      },
    ],
    order_index: 3,
    created_at: '2026-02-16T08:00:00Z',
    updated_at: '2026-02-16T08:00:00Z',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    subject_id: 'sub-te-01',
    subject_name: 'Mikrokontroler & Otomasi Elektronika Industri',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.T., M.T.',
    title: 'Tugas Proyek 01: Perancangan Sistem Monitoring Suhu & Kendali Aktuator ESP32',
    description: 'Buatlah rancangan program mikrokontroler 32-bit untuk membaca transduser suhu analog dan mengaktifkan relay proteksi pendingin otomatis.',
    instructions: `
1. Gunakan mikrokontroler ESP32 atau simulator mikrokontroler (Wokwi/Proteus).
2. Baca input analog dari sensor suhu (LM35/DS18B20) melalui pin ADC.
3. Atur logika ambang batas suhu: jika suhu >= 40°C maka nyalakan relay & LED indikator merah.
4. Tampilkan log pembacaan suhu dan status aktuator secara berkala ke Serial Monitor.
5. Kirimkan tautan repository kode GitHub dan berkas laporan PDF atau rekaman video pengujian.
    `.trim(),
    start_date: '2026-02-10T08:00:00Z',
    due_date: '2026-11-30T23:59:00Z',
    submission_type: 'both',
    max_score: 100,
    weight: 25,
    status: 'published',
    rubric: [
      { id: 'rub-1', criteria: 'Akurasi pembacaan data sensor & kalibrasi ADC', weight: 40 },
      { id: 'rub-2', criteria: 'Kerapian struktur kode C/C++ & penanganan delay non-blocking', weight: 35 },
      { id: 'rub-3', criteria: 'Dokumentasi skematik rangkaian & kejelasan laporan', weight: 25 },
    ],
    submitted_count: 2,
    total_students: 36,
    created_at: '2026-02-10T08:30:00Z',
  },
  {
    id: 'asg-02',
    subject_id: 'sub-atph-01',
    subject_name: 'Agribisnis Tanaman Pangan & Hidroponik Modern',
    class_id: 'class-xii-atph-1',
    class_name: 'XII ATPH 1',
    teacher_id: 'user-guru-2',
    teacher_name: 'Siti Nurhaliza, S.P.',
    title: 'Praktik Mandiri: Logbook Pemantauan Nutrisi & Pertumbuhan Tanaman Hidroponik',
    description: 'Catat data perkembangan tinggi tanaman, jumlah daun, dan fluktuasi nilai EC/pH harian pada instalasi hidroponik greenhouse sekolah.',
    instructions: `
1. Lakukan pengukuran nilai EC dan pH setiap pagi pukul 07.30 dan siang pukul 13.00.
2. Catat jumlah penambahan air baku dan pekatan larutan stok AB Mix.
3. Lampirkan foto kondisi fisik perakaran dan daun tanaman uji.
4. Buat kesimpulan dan saran penanganan jika ditemukan gejala defisiensi unsur hara.
    `.trim(),
    start_date: '2026-02-15T08:00:00Z',
    due_date: '2026-12-05T23:59:00Z',
    submission_type: 'file',
    max_score: 100,
    weight: 25,
    status: 'published',
    rubric: [
      { id: 'rub-4', criteria: 'Kedisiplinan & Akurasi Pencatatan Data Harian', weight: 40 },
      { id: 'rub-5', criteria: 'Analisis Gejala & Koreksi Parameter Nutrisi', weight: 35 },
      { id: 'rub-6', criteria: 'Kerapian Format Laporan & Dokumentasi Foto', weight: 25 },
    ],
    submitted_count: 1,
    total_students: 35,
    created_at: '2026-02-15T08:30:00Z',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'subm-01',
    assignment_id: 'asg-01',
    assignment_title: 'Tugas Proyek 01: Perancangan Sistem Monitoring Suhu & Kendali Aktuator ESP32',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    student_nisn: '0067823412',
    student_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    content: 'Selamat siang Pak Budi. Saya telah menyelesaikan pembuatan sirkuit pengendali suhu menggunakan mikrokontroler ESP32, sensor DS18B20, dan modul relay 5V dengan optoisolator. Program menggunakan timer interrupt non-blocking millis() sehingga pembacaan sensor stabil tanpa jitter. GitHub repo: https://github.com/ahmad-rizky/esp32-temperature-controller',
    file_url: 'https://raw.githubusercontent.com/ahmad-rizky/esp32-temperature-controller/main/docs/schematic.png',
    file_name: 'Laporan_Proyek_Kendali_Suhu_AhmadRizky.pdf',
    file_size: '3.2 MB',
    submitted_at: '2026-02-18T16:45:00Z',
    status: 'sudah_dinilai',
    score: 95,
    feedback: 'Luar biasa Ahmad! Pemilihan optocoupler sangat tepat untuk mengisolasi noise beban induktif relay. Kode terstruktur dengan baik dan pengujian kalibrasi ADC sangat akurat.',
    graded_at: '2026-02-19T10:15:00Z',
    graded_by: 'Budi Santoso, S.T., M.T.',
  },
  {
    id: 'subm-02',
    assignment_id: 'asg-01',
    assignment_title: 'Tugas Proyek 01: Perancangan Sistem Monitoring Suhu & Kendali Aktuator ESP32',
    student_id: 'user-siswa-2',
    student_name: 'Rina Wulandari',
    student_nisn: '0067823413',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Tugas telah dikerjakan dengan menerapkan filter software moving-average untuk menstabilkan pembacaan ADC sensor suhu analog LM35.',
    file_url: 'https://raw.githubusercontent.com/rina/esp32-project/main/preview.png',
    file_name: 'Laporan_Praktik_ESP32_RinaWulandari_XII_TE_1.zip',
    file_size: '4.8 MB',
    submitted_at: '2026-02-19T09:20:00Z',
    status: 'sudah_dikumpulkan',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-01',
    subject_id: 'sub-te-01',
    subject_name: 'Mikrokontroler & Otomasi Elektronika Industri',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.T., M.T.',
    title: 'Kuis Evaluasi Kompetensi: Mikrokontroler & Sistem Kendali Digital',
    instructions: 'Kuis terdiri dari 5 butir soal pilihan ganda konsep mikrokontroler, ADC, dan otomasi industri. Bacalah setiap pertanyaan dengan teliti sebelum memilih opsi. Durasi pengerjaan maksimal 20 menit.',
    duration_minutes: 20,
    max_attempts: 2,
    pass_score: 75,
    status: 'published',
    due_date: '2026-11-28T23:59:00Z',
    question_count: 5,
    questions: [
      {
        id: 'q-1',
        quiz_id: 'quiz-01',
        question_text: 'Komponen internal mikrokontroler apa yang bertugas mengonversi tegangan analog kontinu dari transduser sensor menjadi bilangan biner/digital?',
        question_type: 'multiple_choice',
        options: [
          'Pulse Width Modulation (PWM)',
          'Analog-to-Digital Converter (ADC)',
          'Universal Asynchronous Receiver-Transmitter (UART)',
          'Watchdog Timer (WDT)',
        ],
        correct_answer: 'Analog-to-Digital Converter (ADC)',
        explanation: 'ADC (Analog-to-Digital Converter) mengonversi sinyal tegangan analog menjadi nilai digital diskrit yang dapat diproses CPU.',
        points: 20,
        order_index: 1,
      },
      {
        id: 'q-2',
        quiz_id: 'quiz-01',
        question_text: 'Metode kendali sinyal digital apa yang digunakan untuk mengatur kecepatan putaran motor DC atau tingkat intensitas cahaya dengan memvariasikan duty cycle?',
        question_type: 'multiple_choice',
        options: [
          'Pulse Width Modulation (PWM)',
          'Phase Shift Keying (PSK)',
          'Frequency Modulation (FM)',
          'Amplitude Modulation (AM)',
        ],
        correct_answer: 'Pulse Width Modulation (PWM)',
        explanation: 'PWM memodulasi lebar pulsa logika HIGH dalam periode waktu konstan untuk meregulasi daya rata-rata ke beban aktuator.',
        points: 20,
        order_index: 2,
      },
      {
        id: 'q-3',
        quiz_id: 'quiz-01',
        question_text: 'Berapa jumlah jalur kawat sinyal data utama yang digunakan pada protokol komunikasi serial sinkron I2C?',
        question_type: 'multiple_choice',
        options: [
          '1 Kawat (One-Wire Data)',
          '2 Kawat (SDA dan SCL)',
          '4 Kawat (MOSI, MISO, SCK, CS)',
          '8 Kawat (Parallel Bus)',
        ],
        correct_answer: '2 Kawat (SDA dan SCL)',
        explanation: 'I2C (Inter-Integrated Circuit) hanya menggunakan 2 jalur: Serial Data (SDA) dan Serial Clock (SCL).',
        points: 20,
        order_index: 3,
      },
      {
        id: 'q-4',
        quiz_id: 'quiz-01',
        question_text: 'Bahasa pemrograman grafis standar IEC 61131-3 yang menyerupai diagram relai kelistrikan industri dan paling umum digunakan pada PLC adalah?',
        question_type: 'multiple_choice',
        options: [
          'Ladder Diagram (LD)',
          'Structured Text (ST)',
          'Sequential Function Chart (SFC)',
          'Instruction List (IL)',
        ],
        correct_answer: 'Ladder Diagram (LD)',
        explanation: 'Ladder Diagram (LD) adalah bahasa standar pemrograman PLC berbasis kontak relai dan koil keluaran.',
        points: 20,
        order_index: 4,
      },
      {
        id: 'q-5',
        quiz_id: 'quiz-01',
        question_text: 'Komponen isolator optik apa yang digunakan untuk melindungi pin mikrokontroler dari lonjakan tegangan balik (back EMF) relai atau motor induktif?',
        question_type: 'multiple_choice',
        options: [
          'Optocoupler / Optoisolator',
          'Dioda Zener',
          'Kondensator Tantalum',
          'Transformator Toroid',
        ],
        correct_answer: 'Optocoupler / Optoisolator',
        explanation: 'Optocoupler mengisolasi sirkuit tegangan rendah mikrokontroler dari sirkuit daya beban menggunakan transmisi cahaya LED inframerah dan fototransistor.',
        points: 20,
        order_index: 5,
      },
    ],
    created_at: '2026-02-14T08:00:00Z',
  },
];

export const INITIAL_QUIZ_ATTEMPTS: Record<string, any>[] = [
  {
    id: 'att-user-1-quiz-1',
    quiz_id: 'quiz-01',
    quiz_title: 'Kuis Evaluasi Kompetensi: Mikrokontroler & Sistem Kendali Digital',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    started_at: '2026-02-16T14:00:00Z',
    completed_at: '2026-02-16T14:14:30Z',
    score: 100,
    max_score: 100,
    is_passed: true,
    status: 'graded',
    answers: {
      'q-1': 'Analog-to-Digital Converter (ADC)',
      'q-2': 'Pulse Width Modulation (PWM)',
      'q-3': '2 Kawat (SDA dan SCL)',
      'q-4': 'Ladder Diagram (LD)',
      'q-5': 'Optocoupler / Optoisolator',
    },
  },
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-01',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    student_nisn: '0067823412',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    subject_id: 'sub-te-01',
    subject_name: 'Mikrokontroler & Otomasi Elektronika Industri',
    assignment_score: 95,
    quiz_score: 100,
    exam_score: 92,
    final_score: 95.6,
    letter_grade: 'A',
    status_ketuntasan: 'Tuntas',
    notes: 'Pemahaman pemrograman hardware sangat memuaskan, aktif membantu rekan sekelas merangkai sirkuit sensor dan menyelesaikan proyek kendali tepat waktu.',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'grd-02',
    student_id: 'user-siswa-2',
    student_name: 'Rina Wulandari',
    student_nisn: '0067823413',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    subject_id: 'sub-te-01',
    subject_name: 'Mikrokontroler & Otomasi Elektronika Industri',
    assignment_score: 88,
    quiz_score: 85,
    exam_score: 87,
    final_score: 86.8,
    letter_grade: 'B',
    status_ketuntasan: 'Tuntas',
    notes: 'Konsisten dalam pengujian sirkuit praktikum, solderan rapi dan dokumentasi laporan sangat terstruktur.',
    updated_at: '2026-02-20T10:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Pelaksanaan Asesmen Sumatif Akhir Semester & Uji Kompetensi Keahlian (UKK) 2026',
    content: 'Diberitahukan kepada seluruh siswa kelas XII SMKN 1 Digital Nusantara bahwa jadwal simulasi Uji Kompetensi Keahlian (UKK) bersama Asesor Industri akan dimulai pada tanggal 10 Maret 2026. Pastikan seluruh berkas portofolio proyek dan tugas mandiri di LMS telah tuntas dikumpulkan.',
    author_id: 'user-admin-1',
    author_name: 'Drs. H. Suryanto, M.Pd.',
    author_role: 'admin',
    target_role: 'all',
    priority: 'penting',
    is_pinned: true,
    created_at: '2026-02-18T07:30:00Z',
  },
  {
    id: 'ann-02',
    title: 'Pembagian Kelompok Praktik Otomasi & Mikrokontroler Industri - XII TE 1',
    content: 'Halo rekan-rekan XII TE 1, instruksi pembagian kelompok proyek akhir semester perancangan sistem kendali berbasis mikrokontroler dan PLC telah diunggah pada tab Materi Pelajaran. Setiap kelompok beranggotakan 3-4 siswa dengan pembagian peran Hardware Engineer, Embedded Programmer, dan QA Tester.',
    author_id: 'user-guru-1',
    author_name: 'Budi Santoso, S.T., M.T.',
    author_role: 'guru',
    target_role: 'siswa',
    class_id: 'class-xii-te-1',
    class_name: 'XII TE 1',
    priority: 'normal',
    is_pinned: false,
    created_at: '2026-02-19T08:15:00Z',
  },
  {
    id: 'ann-03',
    title: 'Jadwal Pemeliharaan Server Cloud & Migrasi Database LMS',
    content: 'Pemberitahuan kepada seluruh Dewan Guru dan Tenaga Kependidikan: server LMS akan menjalani optimasi berkala pada Sabtu pukul 22.00 - 24.00 WIB. Seluruh data nilai dan submission otomatis tersinkronisasi.',
    author_id: 'user-admin-1',
    author_name: 'Drs. H. Suryanto, M.Pd.',
    author_role: 'admin',
    target_role: 'guru',
    priority: 'normal',
    is_pinned: false,
    created_at: '2026-02-20T11:00:00Z',
  },
];
