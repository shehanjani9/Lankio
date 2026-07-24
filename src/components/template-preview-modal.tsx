'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Monitor, Tablet, Smartphone, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Template } from '@/lib/templates-data';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_CONFIG: Record<ViewportMode, { width: string; icon: typeof Monitor }> = {
  desktop: { width: '100%', icon: Monitor },
  tablet: { width: '768px', icon: Tablet },
  mobile: { width: '390px', icon: Smartphone },
};

// If the iframe hasn't fired onLoad within this window, assume the target
// is blocking embedding (X-Frame-Options/CSP frame-ancestors) rather than
// just being slow -- browsers give no reliable onError for that case, since
// a cross-origin frame-block isn't a script-visible error, so a timeout is
// the only practical way to detect it.
const LOAD_TIMEOUT_MS = 6000;

export function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: Template | null;
  onClose: () => void;
}) {
  const t = useTranslations('TemplateHub');
  const reduceMotion = useReducedMotion();
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset viewport + loading/timeout state each time a different template is
  // opened, and start the load-timeout watch for that template's iframe.
  useEffect(() => {
    if (!template) return;

    setViewport('desktop');
    setLoading(true);
    setTimedOut(false);

    timeoutRef.current = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [template]);

  function handleIframeLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setTimedOut(false);
  }

  // Escape-to-close and body scroll lock while the modal is open.
  useEffect(() => {
    if (!template) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [template, onClose]);

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#05060a]/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={template.name}
          onClick={onClose}
        >
          <div
            className="flex items-center justify-between border-b border-[color:var(--glass-border)] px-5 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-[color:var(--text-primary)]">
                {template.name}
              </h3>
              <span className="font-mono-label text-[10px] text-[color:var(--text-muted)]">
                {t(`categories.${template.category}`)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="glass-panel flex gap-1 p-1">
                {(Object.keys(VIEWPORT_CONFIG) as ViewportMode[]).map((mode) => {
                  const { icon: Icon } = VIEWPORT_CONFIG[mode];
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewport(mode)}
                      aria-label={t(`viewports.${mode}`)}
                      aria-pressed={viewport === mode}
                      className={cn(
                        'flex items-center justify-center rounded-full p-2 transition-colors',
                        viewport === mode
                          ? 'bg-primary text-white'
                          : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                      )}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>

              <a
                href={template.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('openInNewTab')}
                className="glass-panel glass-panel-interactive flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-primary)]"
              >
                <ExternalLink size={16} />
              </a>

              <button
                onClick={onClose}
                aria-label={t('close')}
                className="glass-panel glass-panel-interactive flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            className="flex flex-1 items-start justify-center overflow-auto p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ width: VIEWPORT_CONFIG[viewport].width }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeInOut' }}
              style={{ maxWidth: '100%' }}
              className="glass-panel flex h-[75vh] flex-col overflow-hidden"
            >
              <div className="flex items-center gap-1.5 border-b border-[color:var(--glass-border)] bg-[#12131a] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#06B6D4]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]/70" />
                <span className="font-mono-label ml-2 truncate text-[10px] text-[color:var(--text-muted)]">
                  {template.demoUrl}
                </span>
              </div>

              <div className="relative flex-1 bg-[#0d0e14]">
                <iframe
                  key={template.id}
                  src={template.demoUrl}
                  title={`${template.name} live preview`}
                  onLoad={handleIframeLoad}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="h-full w-full border-0"
                />

                <AnimatePresence>
                  {(loading || timedOut) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0e14]"
                    >
                      {timedOut ? (
                        <>
                          <AlertTriangle size={22} className="text-secondary" />
                          <p className="max-w-xs text-center text-sm text-[color:var(--text-secondary)]">
                            {t('loadTimeoutMessage')}
                          </p>
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
                          >
                            {t('openInNewTab')}
                            <ExternalLink size={14} />
                          </a>
                        </>
                      ) : (
                        <>
                          <Loader2 size={22} className="animate-spin text-primary" />
                          <p className="text-sm text-[color:var(--text-muted)]">{t('loadingDemo')}</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
