'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Eye,
  Cpu,
  Sprout,
  Code,
  Table,
  ShieldAlert,
  Flame,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { PublicationStatus, SubChapter, MaterialAttachment } from '@/lib/types';
import Link from 'next/link';

function EditMaterialContent() {
  const params = useParams();
  const router = useRouter();
  const materialId = params.id as string;

  const { materials, subjects, classes, updateMaterial, currentUser } = useLms();
  const material = materials.find((m) => m.id === materialId);

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [status, setStatus] = useState<PublicationStatus>('published');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  const [subchapters, setSubchapters] = useState<SubChapter[]>([]);
  const [attachments, setAttachments] = useState<MaterialAttachment[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'pdf' | 'image' | 'other'>('pdf');
  const [previewMode, setPreviewMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing material data
  useEffect(() => {
    if (material) {
      setTitle(material.title || '');
      setSubjectId(material.subject_id || (subjects[0]?.id || ''));
      setClassId(material.class_id || (classes[0]?.id || ''));
      setStatus(material.status || 'published');
      setDescription(material.description || '');
      setContent(material.content || '');
      setYoutubeUrl(material.youtube_url || '');
      setObjectives(material.learning_objectives || []);
      setSubchapters(material.subchapters || []);
      setAttachments(material.attachments || []);
    }
  }, [material, subjects, classes]);

  if (!material) {
    return (
      <DashboardLayout title="Materi Tidak Ditemukan">
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-sm text-slate-500">Materi dengan ID "{materialId}" tidak ditemukan atau telah dihapus.</p>
          <Link
            href="/guru/materials"
            className="inline-flex px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Kembali ke Daftar Materi
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const isTeSubject = selectedSubject?.department_id === 'dept-te' || selectedSubject?.code?.includes('TE');
  const isAtphSubject = selectedSubject?.department_id === 'dept-atph' || selectedSubject?.code?.includes('ATPH');

  // Vocational Snippet Generators
  const insertTeCodeSnippet = () => {
    const snippet = `\n\n\`\`\`cpp
// Program Kendali Mikrokontroler ESP32 - Sensorika Industri
const int sensorPin = 34; // Pin ADC1_CH6 Input Sensor
const int actuatorPin = 23; // Pin Aktuator Relay
const int thresholdValue = 2800; // Ambang batas tegangan ADC

void setup() {
  Serial.begin(115200);
  pinMode(actuatorPin, OUTPUT);
}

void loop() {
  int rawADC = analogRead(sensorPin);
  float voltage = (rawADC / 4095.0) * 3.3;
  Serial.printf("Data Sensor: %d | Tegangan: %.2f V\\n", rawADC, voltage);

  if (rawADC > thresholdValue) {
    digitalWrite(actuatorPin, HIGH); // Aktifkan sistem pendingin
  } else {
    digitalWrite(actuatorPin, LOW);
  }
  delay(500);
}
\`\`\`\n`;
    setContent((prev) => prev + snippet);
  };

  const insertTePinoutTable = () => {
    const snippet = `\n\n### Tabel Pemetaan Pin Mikrokontroler & Aktuator
| Nama Modul/Sensor | Tipe Sinyal | Pin Mikrokontroler | Mode Konfigurasi | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| Sensor Suhu LM35 | Analog (0-3.3V) | GPIO 34 (ADC1) | INPUT_ANALOG | Membaca fluktuasi suhu ruang |
| Display OLED 0.96" | Serial I2C | GPIO 21 (SDA), GPIO 22 (SCL) | I2C BUS (100kHz) | Menampilkan status real-time |
| Modul Relay 2-Channel | Digital Output | GPIO 23, GPIO 19 | OUTPUT (Active LOW) | Mengisolasi beban motor induksi |\n`;
    setContent((prev) => prev + snippet);
  };

  const insertTeSafetySnippet = () => {
    const snippet = `\n\n> [!WARNING]
> **Standar Keselamatan Kerja (K3) Bengkel Elektronika:**
> 1. Gunakan gelang antistatis (ESD wrist strap) saat menyentuh komponen sensitif MOSFET dan IC mikrokontroler.
> 2. Pastikan tegangan catu daya DC telah dimatikan sebelum mengubah wiring rangkaian breadboard/PCB.
> 3. Jangan melampaui batas arus nominal pin GPIO mikrokontroler (maksimum 12-20 mA per pin).\n`;
    setContent((prev) => prev + snippet);
  };

  const insertAtphNutrientTable = () => {
    const snippet = `\n\n### Panduan Formulasi Nutrisi AB Mix & Keseimbangan Parameter
| Fase Tanaman | Target EC (mS/cm) | Target TDS (PPM) | Target pH | Waktu Sirkulasi Pompa |
| :--- | :--- | :--- | :--- | :--- |
| Semai / Pembibitan | 0.8 - 1.2 | 400 - 600 PPM | 5.8 - 6.2 | 15 menit ON / 30 menit OFF |
| Vegetatif (Daun) | 1.4 - 1.8 | 700 - 900 PPM | 6.0 - 6.5 | 24 Jam Sirkulasi Kontinu |
| Generatif (Buah) | 2.0 - 2.5 | 1000 - 1250 PPM | 6.0 - 6.8 | 24 Jam Sirkulasi Kontinu |\n`;
    setContent((prev) => prev + snippet);
  };

  const insertAtphClimateSnippet = () => {
    const snippet = `\n\n### Pemantauan Parameter Iklim Mikro Greenhouse
- **Suhu Optimal Daun**: 24°C - 28°C (aktifkan misting nozzle jika suhu > 32°C).
- **Kelembapan Relatif (RH)**: 65% - 75% untuk mencegah serangan spora jamur embun tepung.
- **Intensitas Penyinaran**: Minimum 6-8 jam penyinaran matahari penuh atau 12.000 - 15.000 Lux.\n`;
    setContent((prev) => prev + snippet);
  };

  const insertAtphPestControlSnippet = () => {
    const snippet = `\n\n> [!IMPORTANT]
> **Standar Pengendalian Hama & Penyakit Terpadu (PHT):**
> 1. Pasang perangkap lekat kuning (Yellow Sticky Trap) setiap 5 meter untuk memonitor populasi kutu kebul dan thrips.
> 2. Sanitasi instalasi pipa talang NFT dengan larutan hidrogen peroksida (H2O2) 3% setiap rotasi panen baru untuk mematikan patogen Pythium (busuk akar).
> 3. Prioritaskan pestisida nabati (ekstrak daun nimba/bawang putih) sebelum penanganan kimiawi.\n`;
    setContent((prev) => prev + snippet);
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
      title: `Bab ${subchapters.length + 1}: Topik Pembelajaran Praktik`,
      content: 'Tuliskan panduan instruksional langkah demi langkah praktikum di sini...',
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
      const newAtt: MaterialAttachment = {
        id: `att-${Date.now()}`,
        file_name: newFileName.trim(),
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: newFileType,
        file_size: '2.5 MB',
      };
      setAttachments([...attachments, newAtt]);
      setNewFileName('');
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSave = (targetStatus?: PublicationStatus) => {
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

    updateMaterial(material.id, {
      title,
      slug,
      subject_id: subjectId,
      subject_name: sub?.name,
      class_id: classId,
      class_name: cls?.name,
      description,
      content,
      youtube_url: youtubeUrl.trim() || undefined,
      learning_objectives: objectives,
      subchapters,
      attachments,
      status: targetStatus || status,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/guru/materials');
    }, 1200);
  };

  return (
    <DashboardLayout
      title={`Editor Materi: ${material.title}`}
      subtitle="Perbarui Konten Instruksional, Kode/SOP Praktik, dan Media Pembelajaran Kejuruan"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/guru/materials"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {material.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : status === 'draft'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {status}
                </span>
                {isTeSubject && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    <Cpu className="w-3 h-3" /> TE
                  </span>
                )}
                {isAtphSubject && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Sprout className="w-3 h-3" /> ATPH
                  </span>
                )}
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {title || 'Judul Materi Pembelajaran'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                previewMode
                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Kembali ke Editor' : 'Pratinjau Siswa'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
            >
              Simpan Draf
            </button>

            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terbitkan</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Perubahan materi berhasil disimpan ke sistem! Mengalihkan ke daftar materi...</span>
          </div>
        )}

        {previewMode ? (
          /* Live Preview Mode */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Pratinjau Tampilan Siswa: {selectedSubject?.name} • {classes.find((c) => c.id === classId)?.name}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>

            {objectives.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-2">
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Tujuan Pembelajaran:</span>
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
              {content}
            </div>

            {subchapters.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Daftar Subbab ({subchapters.length}):
                </h4>
                <div className="space-y-2">
                  {subchapters.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
                    >
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{sub.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{sub.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Main Editor Form */
          <div className="space-y-6">
            {/* 1. Metadata Modul */}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Status Publikasi
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PublicationStatus)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="published">Terbit (Dapat Diakses Siswa)</option>
                      <option value="draft">Draf (Hanya Guru Pengampu)</option>
                      <option value="archived">Arsip (Non-Aktif)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Deskripsi Ringkas / Abstrak Materi
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

            {/* 2. Capaian / Tujuan Pembelajaran */}
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
                    placeholder="Tambahkan tujuan pembelajaran (contoh: Mampu memprogram timer interrupt ADC)..."
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

            {/* 3. Editor Konten Utama & Snippet Khusus Kejuruan */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Konten Teori & Prosedur Praktik</span>
                </h2>

                {/* Specialized Vocational Snippets Toolbar */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                    Sisipkan Template:
                  </span>
                  {/* TE Tools */}
                  <button
                    type="button"
                    onClick={insertTeCodeSnippet}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold hover:bg-blue-100"
                    title="Sisipkan Blok Kode C++ ESP32/Arduino"
                  >
                    <Cpu className="w-3 h-3 text-blue-600" />
                    <span>+ Kode C++ TE</span>
                  </button>

                  <button
                    type="button"
                    onClick={insertTePinoutTable}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold hover:bg-blue-100"
                    title="Sisipkan Tabel Pinout & Aktuator"
                  >
                    <Table className="w-3 h-3 text-blue-600" />
                    <span>+ Tabel Pinout TE</span>
                  </button>

                  {/* ATPH Tools */}
                  <button
                    type="button"
                    onClick={insertAtphNutrientTable}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100"
                    title="Sisipkan Tabel Nutrisi AB Mix Hidroponik"
                  >
                    <Sprout className="w-3 h-3 text-emerald-600" />
                    <span>+ Formulasi Nutrisi ATPH</span>
                  </button>

                  <button
                    type="button"
                    onClick={insertAtphPestControlSnippet}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100"
                    title="Sisipkan Standar PHT & Penyakit Tanaman"
                  >
                    <ShieldAlert className="w-3 h-3 text-emerald-600" />
                    <span>+ SOP PHT ATPH</span>
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

            {/* 4. Subbab Pembelajaran Terstruktur */}
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
                {subchapters.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={sub.title}
                        onChange={(e) => handleUpdateSubchapter(sub.id, 'title', e.target.value)}
                        placeholder="Judul Subbab (contoh: Bab 1: Pengondisian Sinyal ADC)"
                        className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSubchapter(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Hapus Subbab"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={sub.content}
                      onChange={(e) => handleUpdateSubchapter(sub.id, 'content', e.target.value)}
                      placeholder="Instruksi detail praktikum untuk subbab ini..."
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Video Praktikum & Lampiran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* YouTube Video URL */}
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
                <p className="text-[11px] text-slate-400">
                  Video akan disematkan langsung di modul belajar siswa untuk memandu praktikum laboratorium atau greenhouse.
                </p>
              </div>

              {/* Lampiran Dokumen */}
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
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Nama file (contoh: Panduan_Praktikum_ESP32.pdf)..."
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

            {/* Bottom Floating Save Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/guru/materials"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Batal
              </Link>
              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Materi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function EditMaterialPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-center text-xs text-slate-400">
          Memuat editor materi pembelajaran...
        </div>
      }
    >
      <EditMaterialContent />
    </React.Suspense>
  );
}
