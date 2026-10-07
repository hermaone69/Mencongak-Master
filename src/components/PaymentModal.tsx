import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ChevronRight, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { ShopItem } from '../types';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getLocalizedShopItem, getLocalizedDiscountBadge, getLocalizedPrice } from '../utils/translations';

interface PaymentModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurchase: (item: ShopItem) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmPurchase
}) => {
  const { language } = useGame();
  const [paymentMethod, setPaymentMethod] = useState<'gopay' | 'dana' | 'pulsa' | 'card'>('gopay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const isEn = language === 'en';
  const localized = getLocalizedShopItem(item.id, language);

  const handlePay = () => {
    sounds.playTap();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPurchase(item);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Google Play Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center font-black text-xs text-emerald-400 bg-emerald-500/20">
              ▶
            </div>
            <span className="font-bold text-xs text-slate-200 tracking-tight">
              Google Play Billing
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Details */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {localized.name || item.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {localized.description || item.description}
                </p>
                {item.discountBadge && (
                  <span className="inline-block mt-1 text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                    {getLocalizedDiscountBadge(item.discountBadge, language)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              {item.originalPriceIdr && (
                <div className="text-[11px] text-slate-500 line-through">
                  {getLocalizedPrice(item.originalPriceIdr, language)}
                </div>
              )}
              <div className="text-base font-black text-amber-400 font-mono-math">
                {getLocalizedPrice(item.priceIdr, language)}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              {isEn ? 'Select Payment Method:' : 'Pilih Metode Pembayaran:'}
            </label>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'gopay', label: 'E-Wallet (GoPay/DANA)', icon: Wallet },
                { id: 'pulsa', label: isEn ? 'Phone Billing / Carrier' : 'Pulsa Telkomsel/XL', icon: Smartphone },
                { id: 'card', label: isEn ? 'Credit / Debit Card' : 'Kartu Debit/Kredit', icon: CreditCard }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      sounds.playTap();
                      setPaymentMethod(method.id as any);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-semibold truncate">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Google Protection info */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isEn ? 'Protected by Google Play Protect & 256-bit Encryption. Instant purchase.' : 'Dilindungi oleh Google Play Protect & Enkripsi 256-bit. Pembayaran aman & instan.'}
            </span>
          </div>

          {/* 1-Tap Buy CTA Button */}
          <button
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span className="animate-pulse">{isEn ? 'Processing Payment...' : 'Memproses Pembayaran...'}</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEn ? 'Buy with 1-Tap' : 'Beli dengan 1-Ketukan'} ({getLocalizedPrice(item.priceIdr, language)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
