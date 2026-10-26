'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileText,
  Plus,
  Trash2,
  Video,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Save,
  Layers,
  BookOpen,
  Cpu,
  Sprout,
  Table,
  ShieldAlert,
  Eye,
  Sparkles,
} from 'lucide-react';
import { PublicationStatus, SubChapter, MaterialAttachment } from '@/lib/types';
import Link from 'next/link';

export default function CreateMaterialPage() {
  const router = useRouter();
  const { classes, subjects, addMaterial, currentUser } = useLms();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [objectives, setObjectives] = useState<string[]>([
    'Memahami standar kompetensi kejuruan dan keselamatan kerja industri',
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [subchapters, setSubchapters] = useState<SubChapter[]>([
    {
      id: 'sub-1',
      title: 'Bab 1: Konsep & Teori Dasar',
      content: 'Penjelasan teori mendalam dan relevansi dengan standar industri kompetensi SMK.',
    },
  ]);
  const [attachments, setAttachments] = useState<MaterialAttachment[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Template Loader 1: Teknik Elektronika (TE)
  const applyTeTemplate = () => {
    const teSubject = subjects.find((s) => s.department_id === 'dept-te' || s.code.includes('TE')) || subjects[0];
    const teClass = classes.find((c) => c.department_id === 'dept-te') || classes[0];

    setTitle('Pemrograman Sistem Mikrokontroler & Kendali PWM Aktuator Motor');
    setSubjectId(teSubject?.id || '');
    setClassId(teClass?.id || '');
    setDescription('Modul praktikum perancangan algoritma PWM hardware untuk pengaturan kecepatan motor DC dan integrasi driver H-Bridge L298N.');
    setObjectives([
      'Memahami konsep duty cycle pada sinyal modulasi Pulse Width Modulation (PWM)',
      'Mengonfigurasi modul timer register mikrokontroler untuk menghasilkan frekuensi PWM 5 kHz',
      'Merangkai sirkuit driver motor daya H-Bridge dengan pengaman dioda freewheeling',
      'Menganalisis karakteristik torsi dan arus start motor menggunakan amperemeter DC',
    ]);
    setContent(`### Teori Kendali Modulasi Lebar Pulsa (PWM)
Pada sistem otomasi elektronika industri, pengaturan kecepatan motor induksi atau motor arus searah (DC) umumnya tidak dilakukan dengan menurunkan tegangan secara linier (karena disipasi daya tinggi pada transistor). Sebagai gantinya, digunakan teknik **Pulse Width Modulation (PWM)**.

\`\`\`cpp
// Program Kendali Kecepatan Motor DC Menggunakan PWM ESP32
const int enablePin = 18;  // Pin PWM Driver Motor
const int in1Pin = 19;     // Arah Putaran Maju
const int in2Pin = 21;     // Arah Putaran Mundur

const int pwmFreq = 5000;    // Frekuensi 5 kHz
const int pwmChannel = 0;    // Channel PWM hardware
const int pwmResolution = 8; // Resolusi 8-bit (0 - 255)

void setup() {
  Serial.begin(115200);
  pinMode(in1Pin, OUTPUT);
  pinMode(in2Pin, OUTPUT);
  
  // Konfigurasi PWM ESP32
  ledcAttachChannel(enablePin, pwmFreq, pwmResolution, pwmChannel);
  
  // Putar Searah Jarum Jam (CW)
  digitalWrite(in1Pin, HIGH);
  digitalWrite(in2Pin, LOW);
}

void loop() {
  // Percepat bertahap dari 0% ke 100% duty cycle
  for (int duty = 0; duty <= 255; duty += 15) {
    ledcWrite(enablePin, duty);
    Serial.printf("Duty Cycle: %d (%d%%)\\n", duty, (duty * 100) / 255);
    delay(200);
  }
  delay(1000);
}
\`\`\`

> [!WARNING]
> **Standar K3 Kelistrikan:** Pastikan ground (GND) rangkaian mikrokontroler logika telah dihubungkan bersama (Common Ground) dengan ground catu daya motor 12V/24V.`);
    setSubchapters([
      {
        id: 'sub-te-1',
        title: 'Bab 1: Skematik Sirkuit Driver H-Bridge & Isolasi Optocoupler',
        content: 'Pemasangan resistor pull-down 10k pada gerbang MOSFET atau pin enable driver untuk mencegah motor berputar liar saat mikrokontroler booting.',
      },
      {
        id: 'sub-te-2',
        title: 'Bab 2: Pemrograman Duty Cycle PWM & Respon Kecepatan',
        content: 'Eksperimen variasi duty cycle dari 20% hingga 100% dan pencatatan RPM poros motor menggunakan tachometer digital optik.',
      },
    ]);
    setYoutubeUrl('https://www.youtube.com/watch?v=wm5gMKuwSYk');
  };

  // Template Loader 2: Agribisnis Tanaman Pangan dan Hortikultura (ATPH)
  const applyAtphTemplate = () => {
    const atphSubject = subjects.find((s) => s.department_id === 'dept-atph' || s.code.includes('ATPH')) || subjects[0];
    const atphClass = classes.find((c) => c.department_id === 'dept-atph') || classes[0];

    setTitle('Budidaya Tanaman Sayuran Buah Melon Hidroponik Substrat Dutch Bucket');
    setSubjectId(atphSubject?.id || '');
    setClassId(atphClass?.id || '');
    setDescription('Panduan teknis agribisnis budidaya melon hidroponik sistem Dutch Bucket, peracikan nutrisi generatif, dan teknik pemangkasan cabang lateral.');
    setObjectives([
      'Menyiapkan media tanam steril campuran arang sekam dan cocopeat dengan perbandingan 1:1',
      'Meracik larutan hara AB Mix khusus buah dengan nilai EC 2.2 - 2.8 mS/cm',
      'Melakukan seleksi buah optimal pada ruas cabang ke-9 hingga ke-12',
      'Mengendalikan hama kutu kebul dan penyakit busuk pangkal batang secara terpadu',
    ]);
    setContent(`### Teknologi Hidroponik Dutch Bucket untuk Tanaman Buah
Sistem Dutch Bucket merupakan metode irigasi tetes (drip fertigation) yang dirancang khusus untuk komoditas hortikultura buah semusim berakar dalam seperti melon, semangka, dan tomat.

### Tabel Formulasi Nutrisi & Parameter Pertumbuhan
| Parameter | Fase Awal Tanam (HST 1-15) | Fase Vegetatif Cepat (HST 16-35) | Fase Pembungaan & Pembuahan (HST 36-60) | Fase Pematangan / Manis (HST 61-75) |
| :--- | :--- | :--- | :--- | :--- |
| Nilai EC Target | 1.2 - 1.5 mS/cm | 1.8 - 2.2 mS/cm | 2.4 - 2.8 mS/cm | 2.2 - 2.5 mS/cm |
| Ambang Batas pH | 6.0 - 6.5 | 6.0 - 6.5 | 6.2 - 6.8 | 6.0 - 6.5 |
| Frekuensi Drip | 3 kali / hari | 5 kali / hari | 6 - 8 kali / hari | 4 kali / hari |

> [!IMPORTANT]
> **SOP Penyerbukan & Seleksi Buah:**
> - Lakukan polinasi buatan pada pukul 06.30 - 09.00 pagi saat bunga betina mekar sempurna.
> - Sisakan 1-2 buah terbaik per pohon yang bentuknya paling simetris dan bebas cacat fisik.`);
    setSubchapters([
      {
        id: 'sub-atph-1',
        title: 'Bab 1: Instalasi Dutch Bucket & Pemasangan Dripper Emiter',
        content: 'Pengaturan kemiringan saluran pembuangan larutan sisa dan pemasangan pipa siphon untuk memastikan aerasi oksigen akar tetap maksimal.',
      },
      {
        id: 'sub-atph-2',
        title: 'Bab 2: Manajemen Penjarangan Buah & Pengikatan Tali Ajir',
        content: 'Teknik pengikatan tangkai buah menggunakan jaring penopang (fruit net) agar beban buah melon tidak mematahkan batang utama tanaman.',
      },
    ]);
    setYoutubeUrl('https://www.youtube.com/watch?v=Ow_Uzedfohk');
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddSubchapter = () => {
    const newSub: SubChapter = {
      id: `sub-${Date.now()}`,
      title: `Bab ${subchapters.length + 1}: Topik Pembelajaran Lanjutan`,
      content: 'Tuliskan rincian instruksi materi di sini...',
    };
    setSubchapters([...subchapters, newSub]);
  };

  const handleUpdateSubchapter = (id: string, field: 'title' | 'content', value: string) => {
    setSubchapters(
      subchapters.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveSubchapter = (id: string) => {
    setSubchapters(subchapters.filter((s) => s.id !== id));
  };

  const handleAddAttachment = () => {
    if (newFileName.trim()) {
      const isPdf = newFileName.toLowerCase().endsWith('.pdf');
      const newAtt: MaterialAttachment = {
        id: `att-${Date.now()}`,
        file_name: newFileName.trim(),
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: isPdf ? 'pdf' : 'other',
        file_size: '2.5 MB',
      };
      setAttachments([...attachments, newAtt]);
      setNewFileName('');
    }
  };

  const handleSave = (status: PublicationStatus) => {
    if (!title.trim()) {
      alert('Mohon masukkan judul materi pembelajaran.');
      return;
    }

    const sub = subjects.find((s) => s.id === subjectId);
    const cls = classes.find((c) => c.id === classId);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    addMaterial({
      subject_id: subjectId,
      subject_name: sub?.name,
      class_id: classId,
      class_name: cls?.name,
      teacher_id: currentUser.id,
      teacher_name: currentUser.full_name,
      title,
      slug,
      description,
      learning_objectives: objectives,
      content: content || 'Materi pembelajaran resmi kejuruan SMK.',
      subchapters,
      status,
      youtube_url: youtubeUrl || undefined,
      attachments,
      order_index: 1,
    });

    router.push('/guru/materials');
  };

  return (
    <DashboardLayout
      title="Editor & Pembuat Materi Pembelajaran"
      subtitle="Susun Modul Kejuruan Interaktif untuk Siswa Teknik Elektronika & Agribisnis (ATPH)"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Quick Vocational Presets Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-slate-900/30 to-emerald-900/20 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Gunakan Preset Template Kejuruan 1-Klik:</span>
            </span>
            <p className="text-xs text-slate-500">
              Muat struktur modul lengkap standar kurikulum SMK untuk mempercepat penulisan materi praktik.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={applyTeTemplate}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>+ Preset TE (Elektronika)</span>
            </button>

            <button
              type="button"
              onClick={applyAtphTemplate}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sprout className="w-4 h-4" />
              <span>+ Preset ATPH (Agribisnis)</span>
            </button>
          </div>
        </div>

        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/guru/materials"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">
                {title || 'Modul Materi Pembelajaran Baru'}
              </h1>
              <p className="text-xs text-slate-400">Isi data identitas, tujuan capaian, dan materi praktikum</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Kembali ke Form' : 'Pratinjau'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              Simpan Draf
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Terbitkan Modul</span>
            </button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Pratinjau Siswa: {subjects.find((s) => s.id === subjectId)?.name}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
              <p className="text-xs text-slate-500">{description}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
              {content}
            </div>

            {subchapters.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Daftar Subbab ({subchapters.length}):
                </h4>
                <div className="space-y-2">
                  {subchapters.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{sub.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap mt-1">{sub.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Create Form */
          <div className="space-y-6">
            {/* 1. Basic Metadata */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Identitas & Informasi Modul</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Judul Modul Materi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Arsitektur Mikrokontroler ESP32 & Antarmuka Sensor Industri"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Mata Pelajaran Kejuruan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          [{sub.code}] {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Rombongan Belajar Sasaran
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.department_name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Deskripsi Ringkas Materi
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ringkasan kompetensi yang dicakup modul ini..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Capaian Pembelajaran */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tujuan & Indikator Capaian Kompetensi ({objectives.length})</span>
                </span>
              </h2>

              <div className="space-y-2 text-xs">
                {objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{obj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Tambahkan tujuan pembelajaran..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Main Theory Content with Specialized Buttons */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Konten Teori & Prosedur Praktik</span>
                </h2>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setContent(
                        (prev) =>
                          prev +
                          `\n\n\`\`\`cpp\n// Kode Mikrokontroler TE\nvoid setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n  // Instruksi kendali sensor/aktuator\n}\n\`\`\`\n`
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold hover:bg-blue-100"
                  >
                    <Cpu className="w-3 h-3 text-blue-600" />
                    <span>+ Snippet C++ TE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContent(
                        (prev) =>
                          prev +
                          `\n\n### Formulasi Nutrisi AB Mix & pH Air Baku (ATPH)\n| Fase | EC Target | pH | Frekuensi Sirkulasi |\n| :--- | :--- | :--- | :--- |\n| Vegetatif | 1.4 - 1.8 mS/cm | 6.0 - 6.5 | 24 Jam Kontinu |\n| Generatif | 2.2 - 2.6 mS/cm | 6.2 - 6.8 | 24 Jam Kontinu |\n`
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100"
                  >
                    <Sprout className="w-3 h-3 text-emerald-600" />
                    <span>+ Tabel Nutrisi ATPH</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan materi teks instruksional, format markdown, tabel, dan sintaks kode..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* 4. Subchapters */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Subbab & Modul Praktik Terstruktur ({subchapters.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddSubchapter}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Subbab</span>
                </button>
              </div>

              <div className="space-y-4">
                {subchapters.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={sub.title}
                        onChange={(e) => handleUpdateSubchapter(sub.id, 'title', e.target.value)}
                        placeholder="Judul Subbab"
                        className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSubchapter(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={sub.content}
                      onChange={(e) => handleUpdateSubchapter(sub.id, 'content', e.target.value)}
                      placeholder="Instruksi praktikum untuk subbab ini..."
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Video & Attachments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>Video Demonstrasi Praktikum (YouTube)</span>
                </h2>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-500" />
                  <span>Lampiran Dokumen ({attachments.length})</span>
                </h2>

                <div className="space-y-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                        {att.file_name} ({att.file_size})
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Nama file lampiran..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                    >
                      Lampirkan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/guru/materials"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Batal
              </Link>
              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Terbitkan Modul</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
