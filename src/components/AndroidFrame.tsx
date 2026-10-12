import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Crown, 
  RotateCw, 
  Maximize2, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export type SimulatorMode = 'phone' | 'tablet' | 'wide';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenShop: () => void;
}

// Comprehensive detector for physical smartphones, iPads, Android tablets, and PWAs
function detectIsPhysicalMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. PWA Standalone display mode (installed as APK / TWA / iOS bookmark)
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  if (isStandalone) return true;

  const ua = navigator.userAgent || '';

  // 2. Mobile & Tablet User-Agents
  const isMobileOrTabletUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua);
  if (isMobileOrTabletUA) return true;

  // 3. iPadOS 13+ (Safari on iPad reports as Macintosh but has touch points)
  const isIPadOS = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  if (isIPadOS) return true;

  // 4. Touch screens with mobile or tablet resolutions (up to 1200px)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (hasTouch) {
    return true;
  }

  // 5. Mobile & Tablet Viewport size (<= 1024px width or <= 1024px height)
  if (window.innerWidth <= 1024 || window.innerHeight <= 1024) {
    return true;
  }

  return false;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenShop
}) => {
  const { soundEnabled, toggleSound, coins, isVip, language } = useGame();

  // Detection states
  const [isPhysicalMobile, setIsPhysicalMobile] = useState<boolean>(false);
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('phone');
  const [tabletOrientation, setTabletOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [forceNativeFullscreen, setForceNativeFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleDeviceCheck = () => {
      const isMobile = detectIsPhysicalMobileOrTablet();
      setIsPhysicalMobile(isMobile);
    };

    handleDeviceCheck();
    window.addEventListener('resize', handleDeviceCheck);
    window.addEventListener('orientationchange', handleDeviceCheck);
    return () => {
      window.removeEventListener('resize', handleDeviceCheck);
      window.removeEventListener('orientationchange', handleDeviceCheck);
    };
  }, []);

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // =========================================================================
  // 1. NATIVE EDGE-TO-EDGE FULLSCREEN MODE (REAL HP / TABLET / TWA / PWA)
  // =========================================================================
  // When opened on a real Phone or Tablet:
  // - 100% NO simulator frame, NO fake status bar, NO fake camera notch!
  // - Pure Edge-to-Edge native experience!
  // - Fits 100% viewport (h-dvh) with safe-area support.
  // =========================================================================
  if (isPhysicalMobile || forceNativeFullscreen) {
    return (
      <div className="w-full h-dvh max-h-dvh bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none relative">
        {/* If on desktop user manually forced fullscreen preview, show a floating toggle back */}
        {forceNativeFullscreen && !isPhysicalMobile && (
          <div className="absolute top-2 right-2 z-50">
            <button
              onClick={() => setForceNativeFullscreen(false)}
              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full shadow-lg hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>✕ Keluar Preview Fullscreen</span>
            </button>
          </div>
        )}

        {/* Responsive Container: Full width on phones, beautifully centered max-w-2xl on tablets */}
        <div className="w-full h-full max-w-2xl mx-auto flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP BROWSER / PC SIMULATOR MODE
  // =========================================================================
  // Provides developers & reviewers with a multi-device simulator:
  // - 📱 Mode HP (Phone Simulator 390px)
  // - 📲 Mode Tablet (Tablet Simulator 720px + Portrait/Landscape toggle)
  // - 💻 Mode Lebar (Widescreen responsive)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 select-none font-sans">
      {/* Top Simulator Control Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2.5 py-2.5 px-3.5 mb-2 sm:mb-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
        {/* Brand & Title */}
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
              Simulasi Multi-Perangkat (HP Android, Tablet iPad, & Play Store)
            </p>
          </div>
        </div>

        {/* Device Viewport Selector (HP vs Tablet vs Lebar) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          {/* Mode HP */}
          <button
            onClick={() => setSimulatorMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              simulatorMode === 'phone'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Simulasi Tampilan HP Android (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mode HP</span>
          </button>

          {/* Mode Tablet */}
          <button
            onClick={() => setSimulatorMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              simulatorMode === 'tablet'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Simulasi Tampilan Tablet / iPad (720px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Mode Tablet</span>
          </button>

          {/* Mode Lebar */}
          <button
            onClick={() => setSimulatorMode('wide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              simulatorMode === 'wide'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Responsif Lebar"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Mode Lebar</span>
          </button>

          {/* Tablet Rotation Button (Only visible in Tablet mode) */}
          {simulatorMode === 'tablet' && (
            <button
              onClick={() => setTabletOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
              className="p-1.5 rounded-lg text-amber-300 hover:bg-slate-800 border border-amber-500/30 transition-colors cursor-pointer ml-1"
              title="Putar Orientasi Tablet (Portrait / Landscape)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-2">
          {/* Edge-to-Edge Preview Button */}
          <button
            onClick={() => setForceNativeFullscreen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Preview Tampilan Asli Edge-to-Edge (Tanpa Bingkai Simulator)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Preview Layar Penuh</span>
          </button>


          {/* Sound Mute / Unmute */}
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
        </div>
      </header>

      {/* Main Center Simulator Canvas */}
      <main className="w-full flex-1 flex items-center justify-center py-2">
        {/* OPTION A: PHONE SIMULATOR SHELL */}
        {simulatorMode === 'phone' && (
          <div className="relative w-full max-w-[400px] aspect-[9/19.5] max-h-[90vh] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-amber-500/10 ring-1 ring-slate-700/80 border-4 border-slate-800 flex flex-col transition-all duration-300">
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
        )}

        {/* OPTION B: TABLET SIMULATOR SHELL (iPad / Android Tablet) */}
        {simulatorMode === 'tablet' && (
          <div
            className={`relative bg-slate-900 rounded-[36px] p-4 shadow-2xl shadow-sky-500/10 ring-1 ring-slate-700/80 border-4 border-slate-800 flex flex-col transition-all duration-300 ${
              tabletOrientation === 'portrait'
                ? 'w-full max-w-[680px] aspect-[3/4] max-h-[90vh]'
                : 'w-full max-w-[940px] aspect-[4/3] max-h-[85vh]'
            }`}
          >
            {/* Tablet Front Camera Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center z-50 pointer-events-none">
              <div className="w-1 h-1 rounded-full bg-slate-600" />
            </div>

            {/* Tablet Status Header */}
            <div className="h-6 w-full px-4 flex items-center justify-between text-[10px] font-semibold text-slate-400 select-none shrink-0 z-40 mb-1">
              <span>{currentTime} · Mode Tablet</span>
              <div className="flex items-center gap-2">
                <span>Wi-Fi 🛜</span>
                <span>100% 🔋</span>
              </div>
            </div>

            {/* Tablet Display Screen */}
            <div className="relative flex-1 w-full bg-slate-950 rounded-[24px] overflow-hidden flex flex-col border border-slate-800/80 shadow-inner">
              <div className="w-full h-full max-w-2xl mx-auto flex flex-col overflow-hidden relative">
                {children}
              </div>
            </div>

            {/* Tablet Bottom Home Bar */}
            <div className="h-3 w-full flex items-center justify-center shrink-0 mt-1">
              <div className="w-36 h-1 bg-slate-600 rounded-full opacity-60" />
            </div>
          </div>
        )}

        {/* OPTION C: WIDE DESKTOP RESPONSIVE CONTAINER */}
        {simulatorMode === 'wide' && (
          <div className="w-full max-w-3xl min-h-[640px] max-h-[90vh] bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl p-3 sm:p-5 flex flex-col overflow-hidden">
            <div className="w-full h-full flex flex-col overflow-hidden relative">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* Simulator Bottom Notice */}
      <footer className="w-full max-w-5xl py-2 px-4 mt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-900">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Deteksi Otomatis Aktif:
          </span>
          <span>Saat dibuka di HP atau Tablet fisik, aplikasi otomatis 100% Fullscreen Edge-to-Edge.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShop}
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Toko Koin ({coins} Koin)</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
