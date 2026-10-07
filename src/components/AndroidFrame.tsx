import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, BookOpen, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenGuide: () => void;
  onOpenShop: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenGuide,
  onOpenShop
}) => {
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);
  const [isMobileOrNative, setIsMobileOrNative] = useState<boolean>(false);
  const { soundEnabled, toggleSound, coins, isVip } = useGame();

  useEffect(() => {
    const checkNativeOrMobile = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobileOrNative(isStandalone || isSmallScreen);
    };

    checkNativeOrMobile();
    window.addEventListener('resize', checkNativeOrMobile);
    return () => window.removeEventListener('resize', checkNativeOrMobile);
  }, []);

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Native Mobile / TWA / Installed App mode - Edge-to-Edge Native UI
  if (isMobileOrNative) {
    return (
      <div className="w-full h-dvh max-h-dvh bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
        {children}
      </div>
    );
  }

  // Desktop Web Preview Mode with Simulator Frame
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 select-none">
      {/* Top Bar for Simulator Toolbar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 mb-2 sm:mb-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-950 shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white font-display">
                Mencongak Master Pro
              </span>
              {isVip && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-400/40">
                  PRO VIP
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Simulasi Aplikasi Android & Edukasi Hitung Cepat
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Guide / How to Monetize Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Pelajari Cara Membangun & Menjual ke Play Store"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panduan Jual & Rilis Play Store</span>
            <span className="sm:hidden">Panduan</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 text-amber-400 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Viewport Switcher */}
          <button
            onClick={() => setIsPhoneView(!isPhoneView)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Ubah Mode Tampilan"
          >
            {isPhoneView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>Mode Lebar</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mode HP Android</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Center Container */}
      <main className="w-full flex-1 flex items-center justify-center">
        {isPhoneView ? (
          /* Realistic Android Smartphone Shell */
          <div className="relative w-full max-w-[420px] aspect-[9/19.5] max-h-[92vh] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-amber-500/5 ring-1 ring-slate-700/80 border-4 border-slate-800 flex flex-col">
            {/* Camera Punchhole & Speaker notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center z-50 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
            </div>

            {/* Android Status Bar */}
            <div className="h-7 w-full px-5 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none shrink-0 z-40">
              <span>{currentTime}</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span>5G</span>
                <span>📶</span>
                <span>100% 🔋</span>
              </div>
            </div>

            {/* Internal Smartphone Display Screen */}
            <div className="relative flex-1 w-full bg-slate-950 rounded-[32px] overflow-hidden flex flex-col border border-slate-800/80 shadow-inner">
              {children}
            </div>

            {/* Android Bottom Navigation Pill */}
            <div className="h-4 w-full flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-slate-600 rounded-full opacity-60" />
            </div>
          </div>
        ) : (
          /* Fullscreen Tablet/Desktop Layout */
          <div className="w-full max-w-4xl min-h-[620px] bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 flex flex-col">
            {children}
          </div>
        )}
      </main>

      {/* Bottom Subtitle / Info */}
      <footer className="w-full max-w-5xl py-2 px-4 mt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-900">
        <div className="flex items-center gap-2">
          <span>Mencongak Master v2.4</span>
          <span>·</span>
          <span>Aplikasi Siap Rilis Android (TWA / Capacitor / React Native)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShop}
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Monetisasi & Toko Koin ({coins} Koin)</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
