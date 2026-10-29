import React from 'react';
import { BookOpen, Brain, Heart, Cpu, Sparkles, Shield, Compass, CheckCircle2 } from 'lucide-react';

export const PedagogicalMapping: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full text-slate-200">
      {/* Title */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Pemetaan Pedagogi & Integrasi Teori HPPK 2
            </h2>
            <span className="text-xs text-teal-300 font-medium">
              Dokumentasi Akademik: BBB Digital untuk MBPK Masalah Pembelajaran
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          Halaman ini menerangkan secara teliti bagaimana setiap ciri dalam permainan 3D <strong>Detektif Cilik: Misteri Kotak Hilang</strong> direka bentuk berlandaskan teori pembelajaran, perkembangan sosio-emosi, kerangka 3E, dan etika digital.
        </p>
      </div>

      {/* 4 Core Learning Theories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Lev Vygotsky */}
        <div className="bg-slate-800/80 border border-teal-500/40 rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2 text-teal-300 font-extrabold text-sm border-b border-slate-700 pb-2">
            <Brain className="w-4 h-4 text-teal-400" />
            <span>1. Teori Perkembangan Kognitif (Lev Vygotsky)</span>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong>Zon Perkembangan Proksimal (ZPD) & Perancah (Scaffolding):</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Tahap 0 (Berdikari):</strong> Murid membaca ayat asal tanpa petunjuk untuk merekodkan keupayaan bebas sebenar.
              </li>
              <li>
                <strong>Tahap 1 (Sorotan Visual):</strong> Kata sendi ruang dan kata kunci diwarnakan bagi memfokuskan perhatian visual.
              </li>
              <li>
                <strong>Tahap 2 (Pecahan Frasa):</strong> Struktur sintaksis ayat dipecahkan kepada blok unit bermakna (chunking).
              </li>
              <li>
                <strong>Tahap 3 (Contoh Berpandu):</strong> Model perlakuan konkrit disediakan sebelum latihan pemindahan setara dicuba.
              </li>
            </ul>
          </div>
        </div>

        {/* 2. B. F. Skinner */}
        <div className="bg-slate-800/80 border border-amber-500/40 rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm border-b border-slate-700 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2. Teori Pembelajaran Tingkah Laku (B. F. Skinner)</span>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong>Pelaziman Operan & Peneguhan Positif (Reinforcement):</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Maklum Balas Segera:</strong> Peneguhan berbentuk visual (ikon semak, lencana detektif) dan auditori nada ceria serta-merta selepas jawapan tepat.
              </li>
              <li>
                <strong>Pujian Khusus Tingkah Laku:</strong> Mengiktiraf usaha membaca dan ketekunan menyemak bukti, bukan sekadar kelajuan.
              </li>
              <li>
                <strong>Tanpa Dendaan Merugikan:</strong> Tiada kehilangan 'nyawa' (lives) atau bunyi penolakan kasar yang mematahkan semangat murid MBPK.
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Erik Erikson */}
        <div className="bg-slate-800/80 border border-indigo-500/40 rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm border-b border-slate-700 pb-2">
            <Heart className="w-4 h-4 text-indigo-400" />
            <span>3. Perkembangan Psikososial (Erik Erikson)</span>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong>Ketekunan Lawan Rasa Rendah Diri (Industry vs Inferiority):</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Karakter Sahabat (Si Kancil):</strong> Memberi dorongan mesra sepanjang eksplorasi tanpa rasa terasing.
              </li>
              <li>
                <strong>Peluang Mencuba Semula (Retry Safe):</strong> Kesilapan dianggap sebagai proses penemuan petunjuk baru.
              </li>
              <li>
                <strong>Tiada Ranking Terbuka:</strong> Menolak perbandingan awam sesama rakan sekelas untuk memelihara keyakinan kendiri murid.
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Pemprosesan Maklumat */}
        <div className="bg-slate-800/80 border border-rose-500/40 rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2 text-rose-300 font-extrabold text-sm border-b border-slate-700 pb-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>4. Teori Pemprosesan Maklumat & Beban Kognitif</span>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong>Pengurangan Beban Kognitif Luaran (Extraneous Load):</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Satu Tugasan Pada Satu Masa:</strong> Fokus kepada satu perabot/objek dalam satu interaksi modal.
              </li>
              <li>
                <strong>Ruang Pandangan 3D Bersih:</strong> Dok kawalan bawah boleh disembunyikan supaya tidak menghalang objek penyiasatan.
              </li>
              <li>
                <strong>Tipografi Terbaca:</strong> Pilihan saiz fon besar, kontras tinggi, dan mod pengurangan gerakan bagi murid sensitif sensori.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* KPPB & Kerangka 3E */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <span>Kerangka Pembelajaran Bermakna (KPPB & 3E Framework)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 block mb-1">
              Engagement (Keterlibatan)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Penerokaan persekitaran sekolah 3D, naratif detektif penyiasatan misteri, interaksi objek perabot, dan watak maskot Si Kancil memotivasikan penglibatan aktif murid.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
              Enhancement (Peningkatan)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bantuan berpandu penyesuaian (scaffolding 4 aras), pembezaan jawapan berdikari vs dibantu, serta ujian pra dan pasca intervensi membimbing peningkatan literasi ayat secara terukur.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400 block mb-1">
              Extension (Pelanjutan Dunia Nyata)
            </span>
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="mb-1">
                <strong>Aktiviti Luar Talian di Bilik Darjah:</strong>
              </p>
              <p className="italic text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                Guru memberi kad arahan fizikal sebenar: <em>"Letakkan buku di atas meja"</em> atau <em>"Simpan kotak di bawah kerusi"</em> untuk menilai pemindahan kemahiran ke ruang fizikal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Ethics & Integrity */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Etika Digital, Integriti & Keselamatan Data Murid</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sistem ini dibina mengikut piawaian integriti penyelidikan universiti: tiada data peribadi murid (nama sebenar, MyKid/MyKad, foto) disimpan atau dihantar ke pihak ketiga. Pangkalan data dilindungi dengan <strong>Row Level Security (RLS)</strong> di mana hanya guru pemilik sesi boleh mengakses rekod perkembangan murid mereka.
        </p>
      </div>
    </div>
  );
};
