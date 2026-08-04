'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function CookieConsent() {
  const { t } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    const savedConsent = localStorage.getItem('padel_cookie_consent');
    if (!savedConsent) {
      setTimeout(() => setIsVisible(true), 0);
    } else {
      const isGranted = savedConsent === 'granted';
      setTimeout(() => setAnalyticsConsent(isGranted), 0);
    }
  }, []);

  const dispatchConsentEvent = (analytics: boolean) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('cookie-consent-update', {
        detail: { analytics },
      });
      window.dispatchEvent(event);
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('padel_cookie_consent', 'granted');
    setAnalyticsConsent(true);
    dispatchConsentEvent(true);
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  const handleDeclineOptional = () => {
    localStorage.setItem('padel_cookie_consent', 'denied');
    setAnalyticsConsent(false);
    dispatchConsentEvent(false);
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  const handleSavePreferences = () => {
    const status = analyticsConsent ? 'granted' : 'denied';
    localStorage.setItem('padel_cookie_consent', status);
    dispatchConsentEvent(analyticsConsent);
    setIsVisible(false);
    setShowSettingsModal(false);
  };

  return (
    <>
      {/* Re-open button in bottom left corner when banner is hidden */}
      {!isVisible && !showSettingsModal && (
        <button
          onClick={() => setShowSettingsModal(true)}
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-full bg-navy-900/90 text-navy-200 border border-navy-700/60 shadow-lg hover:bg-navy-800 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-300 backdrop-blur-md"
          title={t.cookiePreferences}
          aria-label={t.cookiePreferences}
        >
          <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09.3.2.6.35.88 1.12 2.1 3.52 3.09 5.86 2.37.52-.16 1.01-.41 1.45-.73 1.05 1.7 2.92 2.76 4.96 2.76.4 0 .8-.04 1.18-.12-1.21 2.82-4.04 4.56-7.01 4.56z" />
          </svg>
          <span className="hidden sm:inline">{t.cookiePreferences}</span>
        </button>
      )}

      {/* Main Cookie Banner at Bottom */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-navy-950/95 border-t border-navy-700/60 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {t.cookieConsentTitle}
                </h3>
                <p className="text-xs sm:text-sm text-navy-300 leading-relaxed">
                  {t.cookieConsentDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-600/40 text-navy-200 transition-all"
              >
                {t.cookieSettings}
              </button>
              <button
                onClick={handleDeclineOptional}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-600/40 text-navy-200 hover:text-white transition-all"
              >
                {t.cookieDeclineOptional}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-lg shadow-gold-500/20 transition-all"
              >
                {t.cookieAcceptAll}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-navy-900 border border-navy-700/60 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-navy-700/40 pb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-bold text-white">
                  {t.cookieSettingsTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-navy-400 hover:text-white transition-colors"
                aria-label={t.close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Essential Cookies */}
              <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{t.cookieEssentialTitle}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Wymagane
                    </span>
                  </div>
                  <p className="text-xs text-navy-300 leading-relaxed">
                    {t.cookieEssentialDesc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 accent-gold-500 w-4 h-4 cursor-not-allowed opacity-70"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{t.cookieAnalyticsTitle}</span>
                  </div>
                  <p className="text-xs text-navy-300 leading-relaxed">
                    {t.cookieAnalyticsDesc}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-navy-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-700/40">
              <button
                onClick={handleDeclineOptional}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 transition-all"
              >
                {t.cookieDeclineOptional}
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-lg shadow-gold-500/20 transition-all"
              >
                {t.cookieSavePreferences}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
