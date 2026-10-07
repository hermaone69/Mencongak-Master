import React, { useState } from 'react';
import { 
  X, CheckCircle2, Smartphone, DollarSign, Trophy, Sparkles, 
  Layers, ArrowRight, ExternalLink, CreditCard, Building2, Wallet, ShieldCheck,
  Copy, Check, Globe, Languages, FileText, RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<
    'answer' | 'database' | 'packaging' | 'payment' | 'monetization' | 'playstore'
  >('payment');

  const [listingLang, setListingLang] = useState<'id' | 'en'>('id');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    sounds.playTap();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const listings = {
    id: {
      title: 'Mencongak Master Pro',
      shortDesc: 'Kuasai trik hitung cepat & latihan aritmatika mental. Asah otak & latih kecepatan!',
      fullDesc: `🚀 Kuasai Aritmatika Mental & Jadilah Jago Hitung Cepat!

Mencongak Master Pro adalah aplikasi latihan matematika interaktif yang dirancang khusus untuk mengasah kecepatan berhitung, konsentrasi, dan ketajaman otak secara menyenangkan. 

Sangat cocok untuk siswa SD (Kelas 1–6), SMP, SMA, hingga umum yang ingin meningkatkan kemampuan berhitung kilat tanpa kalkulator!

✨ FITUR UNGGULAN:
• 💡 Trik Kilat Mencongak: Pelajari rahasia & teknik hitung cepat (perkalian 11, kuadrat angka berakhiran 5, estimasi persen, dll).
• 🎮 Berbagai Mode Permainan: Latihan berdasarkan tingkatan sekolah (SD Dasar, SD Lanjut, SMP/SMA, hingga Pro Master).
• ⚔️ Mode Duel AI & Multiplayer: Tantang AI cerdas atau tanding hitung cepat bersama teman dalam satu layar/perangkat!
• ⚡ Bantuan Power-Up: Gunakan Beku Waktu, Pelengkap Opsi (50:50), dan Pengganda Poin untuk meraih skor tertinggi.
• 🏆 Papan Peringkat (Leaderboard): Pantau rekor skor harian, mingguan, serta statistik keluarga & komunitas.
• 🛍️ Toko & Kustomisasi: Dapatkan koin, item bantuan, hingga Sertifikat Kelulusan resmi di dalam aplikasi.
• 🌐 Mode Bahasa: Mendukung penuh Bahasa Indonesia & Bahasa Inggris.

Latih otakmu setiap hari cukup 5–10 menit dan rasakan kemampuan berhitungmu meningkat drastis!

Unduh Mencongak Master Pro sekarang dan jadilah Juara Hitung Cepat!`
    },
    en: {
      title: 'Mental Math Master Pro',
      shortDesc: 'Master speed math tricks & arithmetic. Brain training & fast calculation duel!',
      fullDesc: `🚀 Master Mental Arithmetic & Speed Math Calculations!

Mental Math Master Pro is an interactive math training application designed to sharpen your calculation speed, focus, and brainpower in a fun, engaging way.

Perfect for elementary, middle school, high school students, and adults looking to boost their mental calculation speed without a calculator!

✨ KEY FEATURES:
• 💡 Fast Tricks & Secrets: Learn rapid mental math techniques (multiply by 11, square numbers ending in 5, quick percentages, and more).
• 🎮 Multiple Game Modes: Practice tailored levels ranging from Elementary Basics to Pro Arithmetic Master.
• ⚔️ AI Duel & Split-Screen Multiplayer: Challenge smart AI opponents or compete head-to-head with friends on a single device!
• ⚡ Power-Up Boosts: Utilize Freeze Time, 50:50 Option Eliminator, and 2x Score Multiplier to beat high scores.
• 🏆 Leaderboards & Stats: Track your daily and weekly records, family leaderboards, and personal progress.
• 🛍️ In-App Shop & Rewards: Unlock coins, power-ups, and earn printable Certificates of Achievement.
• 🌐 Bilingual Support: Seamlessly switch between English and Indonesian anytime.

Train your brain for just 5–10 minutes a day and watch your calculation speed skyrocket!

Download Mental Math Master Pro today and become a Mental Math Champion!`
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              🚀
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white font-display">
                Panduan Developer & Monetisasi Aplikasi
              </h3>
              <p className="text-[11px] text-slate-400">
                Cara Rilis, Listing Multi-Bahasa, Hubungkan Bank, & Menerima Pembayaran
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-2 bg-slate-950/80 border-b border-slate-800 text-[11px]">
          {[
            { id: 'answer', label: '1. Potensi' },
            { id: 'database', label: '2. Database' },
            { id: 'packaging', label: '3. Jadi APK' },
            { id: 'payment', label: '4. Bank & Bayar' },
            { id: 'monetization', label: '5. Cara Jual' },
            { id: 'playstore', label: '6. Play Store' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playTap();
                setActiveSection(tab.id as any);
              }}
              className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center cursor-pointer truncate ${
                activeSection === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* TAB 6: RILIS PLAY STORE & LISTING MULTI-BAHASA */}
          {activeSection === 'playstore' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/10 border border-sky-500/40 rounded-2xl">
                <h4 className="font-extrabold text-sm text-sky-300 flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-sky-400" />
                  Panduan Multi-Bahasa & Deskripsi Toko Play Store
                </h4>
                <p className="text-slate-200">
                  Google Play Console mendukung <strong>Listing Multi-Bahasa</strong>. Pengguna di Indonesia akan melihat deskripsi Bahasa Indonesia, sedangkan pengguna di luar negeri otomatis melihat deskripsi Bahasa Inggris!
                </p>
              </div>

              {/* Langkah Pengaturan Multi-Bahasa */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-amber-400" />
                  Cara Setting Multi-Bahasa (Indonesia + Inggris) di Play Console:
                </h5>
                <ol className="space-y-1.5 pl-2 text-slate-300 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span>Buka Play Console → Menu <strong>Main Store Listing</strong> (Tampilan Toko Utama).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span>Atur <strong>Default Language</strong> ke <code>Indonesian (id-ID)</code> dan isi deskripsi Indonesia.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span>Klik tombol <strong>Manage Translations / Tambah Bahasa</strong> → Pilih <code>English (United States - en-US)</code>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">4.</span>
                    <span>Copy-paste versi Bahasa Inggris di bawah ini ke kolom terjemahan tersebut.</span>
                  </li>
                </ol>
              </div>

              {/* Langkah-Langkah Upload File .AAB ke Google Play Console */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-2.5">
                <h5 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Langkah-Langkah Upload File .AAB ke Google Play Console:
                </h5>

                <div className="space-y-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                      Buat Aplikasi Baru
                    </div>
                    <p className="text-slate-300">
                      Buka <code>play.google.com/console</code> → Klik <strong>Create App</strong> → Isi Nama: <strong>Mencongak Master Pro</strong> → Default Language: <strong>Indonesian</strong> → Type: <strong>App / Game</strong> → Free/Paid: <strong>Free</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                      Selesaikan Formulir Kebijakan Aplikasi (App Content)
                    </div>
                    <p className="text-slate-300">
                      Di bilah kiri, klik <strong>App Content</strong> lalu lengkapi:
                      <br />• <strong>Privacy Policy:</strong> Masukkan URL Vercel/Website Anda.
                      <br />• <strong>App Access:</strong> Pilih "All functionality is available without restrictions".
                      <br />• <strong>Content Rating:</strong> Isi kuesioner rating umur (Game Edukasi).
                      <br />• <strong>Target Audience:</strong> Pilih kelompok umur (misal 6-8, 9-12, 13-17, 18+).
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                      Upload File .AAB (Jalur Produksi / Production Track)
                    </div>
                    <p className="text-slate-300">
                      Buka menu <strong>Production</strong> (Produksi) di menu sebelah kiri → Klik <strong>Create New Release</strong> → Upload/Seret file <strong><code>app-release-signed.aab</code></strong> (hasil download dari PWABuilder) → Isi Catatan Rilis: <em>"Rilis Perdana Mencongak Master Pro"</em>.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">4</span>
                      Lengkapi Aset Grafis (Store Listing)
                    </div>
                    <p className="text-slate-300">
                      Masuk ke menu <strong>Main Store Listing</strong>:
                      <br />• Gunakan template Judul & Deskripsi di bawah ini (klik tombol Salin).
                      <br />• Upload <strong>App Icon</strong> (512x512 px) & <strong>Feature Graphic</strong> (1024x500 px).
                      <br />• Upload 2–8 foto screenshot tampilan aplikasi dari HP Anda.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">5</span>
                      Tinjau & Terbitkan ke Publik (Publish)
                    </div>
                    <p className="text-slate-300">
                      Klik <strong>Save</strong> → <strong>Review Release</strong> → Klik <strong>Start Rollout to Production</strong>. Google akan meninjau aplikasi Anda (1–3 hari kerja) dan aplikasi Anda resmi tayang di Play Store seluruh dunia!
                    </p>
                  </div>
                </div>
              </div>

              {/* PANDUAN CARA UPDATE APLIKASI DI GOOGLE PLAY CONSOLE */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-indigo-300 text-xs sm:text-sm">
                      Cara Update Aplikasi di Play Console (Jika Ada Fitur Baru / Perubahan):
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Ada 2 cara update: <strong>Update Instan Otomatis (PWA)</strong> dan <strong>Update Rilis Resmi di Play Store</strong>.
                    </p>
                  </div>
                </div>

                {/* 1. Rahasia Update Cepat PWA */}
                <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1 text-[11px]">
                  <div className="font-bold text-sky-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    1. Update Instan Tanpa Review Google (Untuk Perubahan Kode / Soal / Fitur Web):
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Karena aplikasi ini berbasis PWA, jika Anda hanya <strong>menambah soal, memperbaiki bug, atau mengubah fitur di aplikasi</strong>, Anda <strong>CUKUP deploy ulang ke Vercel / Firebase Hosting</strong>! Semua pengguna yang membuka aplikasi akan langsung menikmati fitur baru secara otomatis tanpa perlu menunggu review Play Store.
                  </p>
                </div>

                {/* 2. Langkah Update Resmi Play Console */}
                <div className="space-y-2 text-[11px]">
                  <div className="font-bold text-white text-xs">
                    2. Langkah Update Versi Resmi di Play Console (Muncul Tombol "Update" di Play Store):
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                      Naikkan Version Code di PWABuilder (Wajib!)
                    </div>
                    <p className="text-slate-300">
                      Sebelum download file <code>.aab</code> baru dari PWABuilder, buka pengaturan opsi Android di PWABuilder:
                      <br />• <strong>Version Code:</strong> Naikkan angkanya (misal versi pertama <code>1</code>, update ini harus jadi <code>2</code>, rilis berikutnya <code>3</code>). <em>Google akan menolak jika version code sama!</em>
                      <br />• <strong>Version Name:</strong> Ganti versinya (misal dari <code>1.0.0</code> menjadi <code>1.1.0</code>).
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                      Buka Play Console → Menu Production (Produksi)
                    </div>
                    <p className="text-slate-300">
                      Buka <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-sky-400 underline">play.google.com/console</a> → Pilih aplikasi Anda → Di bilah menu kiri, pilih <strong>Production</strong> (Produksi) → Di pojok kanan atas, klik tombol <strong>Create new release</strong> (Buat rilis baru).
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                      Upload File .AAB Versi Terbaru
                    </div>
                    <p className="text-slate-300">
                      Seret atau upload file <code>app-release-signed.aab</code> baru yang sudah ber-Version Code <code>2</code>. Tunggu sampai proses validasi Google selesai berwarna hijau centang.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">4</span>
                      Tulis Catatan Rilis (Release Notes)
                    </div>
                    <p className="text-slate-300">
                      Di kolom <strong>Release notes</strong>, tulis perubahan yang dirasakan pengguna, contoh:
                      <br /><code className="text-emerald-400">- Penambahan fitur mode baru dan tantangan harian</code>
                      <br /><code className="text-emerald-400">- Peningkatan kestabilan & perbaikan tampilan</code>
                    </p>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">5</span>
                      Tinjau & Mulai Peluncuran (Rollout)
                    </div>
                    <p className="text-slate-300">
                      Klik <strong>Next</strong> (Berikutnya) → Periksa ringkasan → Klik tombol <strong>Start rollout to Production</strong> (Mulai peluncuran ke Produksi).
                      <br /><em>Review untuk update biasanya jauh lebih cepat (hanya beberapa jam sampai 1 hari kerja), dan setelah disetujui, tombol <strong>Perbarui / Update</strong> akan langsung muncul di Google Play Store seluruh pengguna!</em>
                    </p>
                  </div>
                </div>
              </div>

              {/* Catatan Konversi Harga Otomatis */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Apakah Harga Otomatis Terkonversi untuk Pembeli Luar Negeri?
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong>YA, OTOMATIS!</strong> Anda hanya perlu memasukkan harga acuan dalam Rupiah (misal Rp 29.000). Google Play Console akan <strong>mengonversi harganya secara otomatis</strong> ke mata uang lokal pembeli (USD, EUR, SGD, MYR, dll) berdasarkan nilai tukar resmi harian.
                </p>
              </div>

              {/* Template Deskripsi Siap Copy */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Draft Deskripsi Toko Siap Salin:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setListingLang('id')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        listingLang === 'id'
                          ? 'bg-amber-400 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇮🇩 Indonesia
                    </button>
                    <button
                      onClick={() => setListingLang('en')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        listingLang === 'en'
                          ? 'bg-amber-400 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇺🇸 English
                    </button>
                  </div>
                </div>

                {/* Judul */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Judul Aplikasi (App Title - Max 30 Karakter):</span>
                    <button
                      onClick={() => handleCopy('title', listings[listingLang].title)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'title' ? 'Tersalin!' : 'Salin Judul'}
                    </button>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-white font-mono text-xs">
                    {listings[listingLang].title}
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Deskripsi Singkat (Short Description - Max 80 Karakter):</span>
                    <button
                      onClick={() => handleCopy('short', listings[listingLang].shortDesc)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedKey === 'short' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'short' ? 'Tersalin!' : 'Salin Deskripsi Singkat'}
                    </button>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-slate-200 text-xs">
                    {listings[listingLang].shortDesc}
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Deskripsi Lengkap (Full Description):</span>
                    <button
                      onClick={() => handleCopy('full', listings[listingLang].fullDesc)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'full' ? 'Tersalin!' : 'Salin Deskripsi Lengkap'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 font-sans text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {listings[listingLang].fullDesc}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARA HUBUNGKAN PEMBAYARAN & REKENING BANK */}
          {activeSection === 'payment' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 rounded-2xl">
                <h4 className="font-extrabold text-sm text-emerald-300 flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Bagaimana Cara Menerima Pembayaran & Masuk Rekening?
                </h4>
                <p className="text-slate-200">
                  Google Play menangani <strong>100% proses transaksi secara otomatis</strong>. Pembeli di Indonesia bisa membayar pakai <strong>GoPay, DANA, OVO, ShopeePay, Pulsa, atau Transfer Bank</strong>, dan Google akan mentransfer uangnya langsung ke rekening bank lokal Anda!
                </p>
              </div>

              {/* Langkah 1: Hubungkan Rekening Bank */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h5 className="font-bold text-white text-xs sm:text-sm">
                    Hubungkan Rekening Bank Anda (Google Merchant Center)
                  </h5>
                </div>
                <p className="text-slate-400">
                  Untuk menerima pencairan uang hasil penjualan VIP dan Koin dari Google Play:
                </p>
                <ol className="space-y-1.5 pl-2 text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Buka akun <strong>Google Play Console</strong> di <code>play.google.com/console</code></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Masuk ke menu <strong>Monetisasi (*Monetization*)</strong> &gt; <strong>Pengaturan Pembayaran (*Payments Profile*)</strong></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Pilih <strong>"Tambahkan Metode Pembayaran" (Add Payment Method)</strong></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Masukkan nama bank Anda di Indonesia (BCA, Mandiri, BRI, BNI, Bank Jago, CIMB, dll), nomor rekening, dan nama pemilik rekening yang sesuai KTP</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Verifikasi Rekening:</strong> Dalam 2-3 hari kerja, Google akan mengirim deposit uji coba kecil (misal Rp 230). Buka mutasi rekening Anda dan masukkan angka tersebut di Play Console untuk memverifikasi rekening</span>
                  </li>
                </ol>
              </div>

              {/* Langkah 2: Cara Mendaftarkan Produk VIP & Koin */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h5 className="font-bold text-white text-xs sm:text-sm">
                    Daftarkan Produk Toko Game di Play Console
                  </h5>
                </div>
                <p className="text-slate-400">
                  Di Play Console pada aplikasi Anda, buka menu <strong>Produk Dalam Aplikasi (*In-app products*)</strong> lalu buat ID produk berikut:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="font-bold text-amber-300">ID: vip_pro_pass</div>
                    <div className="text-slate-400 mt-0.5">Nama: VIP Pro Mencongak Pass</div>
                    <div className="text-emerald-400 font-bold">Harga: Rp 29.000</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="font-bold text-amber-300">ID: coin_pack_100</div>
                    <div className="text-slate-400 mt-0.5">Nama: Kantong Koin (100 Koin)</div>
                    <div className="text-emerald-400 font-bold">Harga: Rp 5.000</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="font-bold text-amber-300">ID: coin_pack_500</div>
                    <div className="text-slate-400 mt-0.5">Nama: Peti Koin Juara (600 Koin)</div>
                    <div className="text-emerald-400 font-bold">Harga: Rp 19.000</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="font-bold text-amber-300">ID: cert_pro</div>
                    <div className="text-slate-400 mt-0.5">Nama: Lisensi E-Sertifikat</div>
                    <div className="text-emerald-400 font-bold">Harga: Rp 15.000</div>
                  </div>
                </div>
              </div>

              {/* Langkah 3: Jadwal Pencairan Dana */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h5 className="font-bold text-emerald-300 text-xs sm:text-sm">
                    Kapan & Bagaimana Uang Dikirim ke Rekening?
                  </h5>
                </div>
                <p className="text-slate-300">
                  • <strong>Jadwal Pembayaran Google:</strong> Setiap tanggal <strong>15 hingga 21 setiap bulan</strong>, Google mentransfer total pendapatan bulan sebelumnya langsung ke rekening bank lokal Anda dalam mata uang <strong>Rupiah (IDR)</strong>.
                </p>
                <p className="text-slate-300">
                  • <strong>Batas Minimum Pencairan (*Threshold*):</strong> Biasanya $1 (atau setara ~Rp 15.000), sehingga penjualan sekecil apapun akan langsung cair setiap bulan.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'answer' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Jawaban: SANGAT BISA!
                </h4>
                <p className="text-slate-200">
                  Google AI Studio dapat membangun seluruh antarmuka interaktif, mesin matematika aritmatika otomatis, efek audio Web Audio, sistem poin, level progression, trik hitung cepat, hingga papan peringkat real-time seperti aplikasi yang sedang Anda uji coba ini.
                </p>
              </div>

              <h4 className="font-bold text-white text-sm">Mengapa Mencongak Sangat Potensial Dijual?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">1.</span>
                  <div>
                    <strong className="text-white">Pasar Sangat Luas (Siswa SD, SMP, SMA, & Peserta CPNS/BUMN):</strong>
                    <p className="text-slate-400 mt-0.5">Semua orang butuh kecepatan hitung dasar untuk ujian sekolah, UTBK, Tes Bakat Skolastik, maupun tes kedinasan.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">2.</span>
                  <div>
                    <strong className="text-white">Gamifikasi Poin & Papan Peringkat (High Retention):</strong>
                    <p className="text-slate-400 mt-0.5">Sistem streak api harian, combo multiplier, dan duel membuat anak-anak & pengguna ketagihan berlatih setiap hari.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">3.</span>
                  <div>
                    <strong className="text-white">Willingness to Pay Orang Tua:</strong>
                    <p className="text-slate-400 mt-0.5">Orang tua rela membayar Rp 20.000 - Rp 50.000 untuk aplikasi edukasi yang terbukti meningkatkan nilai matematika anak.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <h4 className="font-bold text-sm text-amber-300 mb-1">
                  Apakah Perlu Database? (Jawabannya: Tergantung Model Aplikasi)
                </h4>
                <p className="text-slate-200">
                  Aplikasi ini bisa berjalan <strong>tanpa database server (100% Offline)</strong>, atau menggunakan <strong>Database Cloud (Online Real-time)</strong>. Berikut perbandingannya:
                </p>
              </div>

              {/* Model 1: Tanpa Database Cloud */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-400 font-bold text-sm">Opsi 1: Tanpa Database Cloud (Penyimpanan Lokal HP)</strong>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    HEMAT 100% BIAYA
                  </span>
                </div>
                <p className="text-slate-400">
                  Skor, koin, level, dan trik disimpan langsung di memori HP pengguna (LocalStorage / SQLite internal).
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-emerald-400 font-bold">✓ Kelebihan:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-300">
                      <li>• <strong>Rp 0 Biaya Server</strong> (Gratis selamanya)</li>
                      <li>• Bisa dimainkan 100% <strong>tanpa internet / kuota</strong></li>
                      <li>• Sangat disukai orang tua & anak-anak</li>
                      <li>• Rilis ke Play Store jauh lebih cepat & mudah</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-rose-400 font-bold">✕ Kekurangan:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-400">
                      <li>• Papan peringkat bersifat lokal/simulasi</li>
                      <li>• Jika ganti HP, skor tidak otomatis berpindah</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'packaging' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Bagaimana Mengubah Kode Web Ini Jadi File APK/AAB Android?</h4>
              <p className="text-slate-400">
                Aplikasi ini dibangun menggunakan arsitektur modern yang 100% kompatibel dengan framework Android:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-amber-300 font-bold">Opsi A: Google Bubblewrap / TWA (Rekomendasi Resmi Google)</strong>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">TERMUDAH</span>
                  </div>
                  <p className="text-slate-400">
                    Google menyediakan tool bernama <code>@bubblewrap/cli</code>. Hanya dengan mengetikkan <code>bubblewrap init --manifest=https://app-kamu.com/manifest.json</code>, Bubblewrap langsung men-generate file <code>.aab</code> siap upload ke Play Store tanpa menulis kode Java/Kotlin.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-amber-300 font-bold">Opsi B: Capacitor JS (`@capacitor/android`)</strong>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold">LEBIH FLEKSIBEL</span>
                  </div>
                  <p className="text-slate-400">
                    Install Capacitor: <code>npm i @capacitor/core @capacitor/android</code>, lalu jalankan <code>npx cap add android</code>. Buka di Android Studio dan klik tombol Build APK!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'monetization' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Strategi Menghasilkan Uang (Monetisasi)</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400">1. Model Freemium + VIP Pro Pass (In-App Purchase)</div>
                  <p className="text-slate-400 mt-1">
                    Gratiskan mode latihan dasar (SD 1-3). Kunci materi Trik Kilat Menengah, Mode Duel Grandmaster, dan E-Sertifikat di balik pembelian <strong>VIP Pass (Rp 29.000 sekali beli)</strong> via Google Play Billing.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400">2. Iklan Berhadiah (Google AdMob Rewarded Ads)</div>
                  <p className="text-slate-400 mt-1">
                    Saat pemain kehabisan 3 nyawa di Mode Bertahan, tawarkan opsi: <em>"Tonton video sponsor 15 detik untuk mendapatkan 1 nyawa tambahan atau 30 koin gratis"</em>. Ini menghasilkan pendapatan pasif tanpa mengganggu kenyamanan.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400">3. Lisensi Sekolah & Bimbingan Belajar (B2B)</div>
                  <p className="text-slate-400 mt-1">
                    Jual sistem papan peringkat khusus per kelas/sekolah dengan biaya lisensi Rp 500.000 - Rp 2.000.000 per institusi sebagai software latihan interaktif siswa.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Aplikasi ini sudah dirancang dengan standar arsitektur Google Play.
          </span>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
