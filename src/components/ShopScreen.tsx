import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingBag, Crown, Zap, Shield, Sparkles, Award, Check, Coins, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { ShopItem } from '../types';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { PaymentModal } from './PaymentModal';
import { getTranslation, getLocalizedShopItem, getLocalizedDiscountBadge, getLocalizedPrice } from '../utils/translations';

interface ShopScreenProps {
  onOpenCertificate: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  onOpenCertificate
}) => {
  const { shopItems, buyShopItem, coins, isVip, language, themeMode } = useGame();
  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';
  const t = getTranslation(language);

  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [selectedIapItem, setSelectedIapItem] = useState<ShopItem | null>(null);

  const DEFAULT_COIN_PACKS: ShopItem[] = [
    {
      id: 'coin_pack_100',
      name: language === 'id' ? 'Kantong Koin (100 Koin)' : 'Coin Pouch (100 Coins)',
      description: language === 'id' ? 'Untuk membeli power-up dan membuka trik kilat' : 'For purchasing power-ups & unlocking tricks',
      priceIdr: 'Rp 5.000',
      coinsReward: 100,
      icon: '💰',
      category: 'coin_pack',
      owned: false
    },
    {
      id: 'coin_pack_500',
      name: language === 'id' ? 'Peti Koin Juara (500 + 100 Bonus)' : 'Champion Chest (500 + 100 Bonus)',
      description: language === 'id' ? 'Paket terfavorit pemain untuk stok power-up berlimpah' : 'Most popular pack for abundant power-up reserves',
      priceIdr: 'Rp 19.000',
      originalPriceIdr: 'Rp 25.000',
      discountBadge: language === 'id' ? 'PALING POPULER' : 'MOST POPULAR',
      coinsReward: 600,
      icon: '🪙',
      category: 'coin_pack',
      owned: false
    },
    {
      id: 'coin_pack_1500',
      name: language === 'id' ? 'Gudang Koin Sultan (1.500 + 500 Bonus)' : 'Sultan Vault (1,500 + 500 Bonus)',
      description: language === 'id' ? 'Bonus 500 koin gratis & buka semua trik seketika' : 'Bonus 500 free coins & unlock all tricks instantly',
      priceIdr: 'Rp 49.000',
      originalPriceIdr: 'Rp 75.000',
      discountBadge: language === 'id' ? 'HEMAT 35%' : 'SAVE 35%',
      coinsReward: 2000,
      icon: '💎',
      category: 'coin_pack',
      owned: false
    }
  ];

  // Filter items by category
  const vipItem = shopItems.find(i => i.id === 'vip_pro_pass');
  const certItem = shopItems.find(i => i.id === 'cert_pro');
  const loadedCoinPacks = shopItems.filter(i => i.category === 'coin_pack');
  const coinPacks = loadedCoinPacks.length > 0 ? loadedCoinPacks : DEFAULT_COIN_PACKS;
  const powerUps = shopItems.filter(i => i.category === 'powerup');

  // Handle direct coin purchase for powerups
  const handleBuyWithCoins = (item: ShopItem) => {
    sounds.playTap();
    if (coins < (item.priceCoins || 0)) {
      sounds.playWrong();
      setPurchaseError(language === 'id' ? `Koin tidak cukup! Butuh ${item.priceCoins} koin.` : `Not enough coins! Need ${item.priceCoins} coins.`);
      setTimeout(() => setPurchaseError(null), 2500);
      return;
    }

    if (buyShopItem(item.id)) {
      const loc = getLocalizedShopItem(item.id, language);
      setPurchaseSuccess(language === 'id' ? `Berhasil membeli: ${loc.name || item.name}!` : `Successfully purchased: ${loc.name || item.name}!`);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setPurchaseSuccess(null), 2500);
    }
  };

  // Open Google Play Payment Modal for Rupiah items
  const handleOpenIapModal = (item: ShopItem) => {
    sounds.playTap();
    setSelectedIapItem(item);
  };

  // Confirm payment from Google Play modal
  const handleConfirmIapPayment = (item: ShopItem) => {
    if (buyShopItem(item.id)) {
      const loc = getLocalizedShopItem(item.id, language);
      setPurchaseSuccess(language === 'id' ? `Pembayaran berhasil! ${loc.name || item.name} kini aktif.` : `Payment successful! ${loc.name || item.name} is now active.`);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setPurchaseSuccess(null), 3000);
    }
  };

  const isCertAccessible = certItem?.owned || isVip;

  return (
    <div className={`flex-1 flex flex-col justify-between p-3.5 sm:p-4 ${
      isLight ? 'bg-slate-50 text-slate-900' : isNeon ? 'bg-[#021411] text-emerald-100' : 'bg-slate-950 text-slate-100'
    } select-none overflow-y-auto transition-colors duration-200`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isLight ? 'text-amber-800' : isNeon ? 'text-emerald-400' : 'text-amber-500'
            }`}>
              {t.shopOfficialHeader}
            </span>
            <h1 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight font-display`}>
              {t.shopTitle}
            </h1>
          </div>
          <div className={`flex items-center gap-1.5 ${
            isLight
              ? 'bg-amber-100 border-2 border-amber-300 text-amber-950 font-black'
              : isNeon
              ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold'
              : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
          } px-3 py-1.5 rounded-2xl shadow-xs`}>
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono-math">
              {coins} {t.coins}
            </span>
          </div>
        </div>
        <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : isNeon ? 'text-emerald-300/80 font-medium' : 'text-slate-400'} mt-0.5`}>
          {t.shopSubtitle}
        </p>

        {/* Feedback Banners */}
        {purchaseSuccess && (
          <div className="my-2.5 p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-800 font-extrabold flex items-center gap-2 animate-bounce shadow-md">
            <Check className="w-4 h-4 shrink-0" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {purchaseError && (
          <div className="my-2.5 p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-800 font-extrabold flex items-center gap-2 animate-shake shadow-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{purchaseError}</span>
          </div>
        )}

        {/* 1. Featured VIP Promo Banner (Clean & Beautiful) */}
        {vipItem && (
          <div className={`my-3 p-4 rounded-3xl ${
            isLight ? 'bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border-2 border-amber-300 text-slate-900 shadow-xl' : 'bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-slate-900/90 border border-amber-500/40 text-slate-100 shadow-xl'
          } relative overflow-hidden`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs">
                    <Crown className="w-4 h-4" />
                    <span>{t.vipPassTitle}</span>
                  </div>
                  {vipItem.discountBadge && (
                    <span className="text-[9px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                      {getLocalizedDiscountBadge(vipItem.discountBadge, language)}
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'} mt-0.5`}>
                  {t.vipPassHeading}
                </h3>

                <ul className={`text-xs ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'} space-y-1.5 mt-2.5`}>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">✓</span>
                    <span>{t.vipFeature1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">✓</span>
                    <span>{t.vipFeature2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">✓</span>
                    <span>{t.vipFeature3}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">✓</span>
                    <span>{t.vipFeature4}</span>
                  </li>
                </ul>
              </div>

              <div className={`w-12 h-12 rounded-2xl ${
                isLight ? 'bg-amber-200/80 border border-amber-300' : 'bg-amber-400/20 border border-amber-400/30'
              } flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                👑
              </div>
            </div>

            {/* Price & Action Area */}
            <div className={`mt-4 pt-3 border-t ${isLight ? 'border-amber-300' : 'border-amber-500/25'} flex items-center justify-between gap-3`}>
              <div>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'} line-through block`}>
                  {language === 'id' ? 'Harga Asli:' : 'Original:'} {getLocalizedPrice(vipItem.originalPriceIdr || 'Rp 49.000', language)}
                </span>
                <div className="text-lg font-black text-amber-600 font-mono-math leading-tight">
                  {getLocalizedPrice(vipItem.priceIdr, language)}
                </div>
              </div>

              {isVip ? (
                <div className="px-3.5 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.vipActiveForever}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenIapModal(vipItem)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  {t.buyVipButton} ({getLocalizedPrice(vipItem.priceIdr, language)})
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Top-Up Paket Koin (In-App Purchases) */}
        <div className="my-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xs font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-200'} flex items-center gap-1.5`}>
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              {t.coinPacksTitle}
            </h3>
            <span className={`text-[10px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{language === 'id' ? 'Saldo' : 'Balance'}: {coins} {t.coins}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {coinPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => handleOpenIapModal(pack)}
                className={`${
                  isLight
                    ? 'bg-white border-2 border-slate-200/90 hover:border-amber-400 text-slate-900 shadow-md'
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 text-white shadow-md'
                } p-2.5 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer active:scale-95 relative`}
              >
                {pack.discountBadge && (
                  <span className="absolute -top-2 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                    {getLocalizedDiscountBadge(pack.discountBadge, language)}
                  </span>
                )}
                <div className="text-2xl mt-1 mb-0.5">{pack.icon}</div>
                <div className={`text-[10px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'} truncate w-full`}>
                  {pack.id === 'coin_pack_100' ? t.packBag : pack.id === 'coin_pack_500' ? t.packChest : t.packVault}
                </div>
                <div className={`font-extrabold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  +{pack.coinsReward} {t.coins}
                </div>
                <div className={`text-[10px] ${
                  isLight ? 'text-amber-700 bg-amber-100 border-amber-300' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                } font-mono-math font-bold mt-1 px-2 py-0.5 rounded-md border w-full truncate`}>
                  {getLocalizedPrice(pack.priceIdr, language)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Certificate Licensing Card (Clean & Balanced) */}
        {certItem && (
          <div className={`my-2.5 p-3.5 rounded-2xl ${
            isLight ? 'bg-white border-2 border-slate-200 shadow-md text-slate-900' : 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md'
          } flex items-center justify-between gap-3`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-2xl ${isLight ? 'bg-amber-100 border border-amber-200' : 'bg-amber-400/10 border border-amber-400/30'} flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                🎓
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'} leading-tight`}>
                    {t.certCardTitle}
                  </h4>
                  {isCertAccessible && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-700 font-extrabold px-1.5 py-0.2 rounded">
                      {t.certCardLicensed}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'} mt-0.5 leading-tight`}>
                  {isCertAccessible
                    ? t.certCardDescReady
                    : `${t.certCardDescBuy} (${getLocalizedPrice(certItem.priceIdr, language)})`}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {isCertAccessible ? (
                <button
                  onClick={() => {
                    sounds.playTap();
                    onOpenCertificate();
                  }}
                  className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-800 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 whitespace-nowrap shadow-sm"
                >
                  {t.printCertificate}
                </button>
              ) : (
                <button
                  onClick={() => handleOpenIapModal(certItem)}
                  className={`px-3 py-2 ${
                    isLight ? 'bg-amber-100 border-2 border-amber-300 text-amber-950 hover:bg-amber-200' : 'bg-slate-800 border border-slate-700 text-amber-300'
                  } text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 whitespace-nowrap`}
                >
                  {t.buyLicense} ({getLocalizedPrice(certItem.priceIdr, language)})
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. Power-ups Section (Dibeli Pakai Koin Game) */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xs font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              {t.powerupsHeading}
            </h3>
            <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.powerupsSubheading}</span>
          </div>

          <div className="space-y-2">
            {powerUps.map(item => {
              const localized = getLocalizedShopItem(item.id, language);
              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md ${
                    isLight ? 'bg-white border-2 border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${isLight ? 'bg-amber-100/80 border border-amber-200' : 'bg-slate-800/80 border border-slate-700/60'} flex items-center justify-center text-xl shrink-0 shadow-inner`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-extrabold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {localized.name || item.name}
                      </h4>
                      <p className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'} leading-tight mt-0.5`}>
                        {localized.description || item.description}
                      </p>
                      <span className={`inline-block text-[10px] ${
                        isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'bg-slate-800 text-emerald-400 font-bold border border-slate-700/50'
                      } px-2 py-0.5 rounded-md mt-1`}>
                        {t.ownedLabel} {item.quantity || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyWithCoins(item)}
                    className={`px-3 py-2 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm ${
                      coins >= (item.priceCoins || 0)
                        ? isLight
                          ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950'
                          : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/20'
                        : isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.priceCoins} {t.coins}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Google Play Billing Checkout Simulator Modal */}
      <PaymentModal
        item={selectedIapItem}
        isOpen={!!selectedIapItem}
        onClose={() => setSelectedIapItem(null)}
        onConfirmPurchase={handleConfirmIapPayment}
      />
    </div>
  );
};
