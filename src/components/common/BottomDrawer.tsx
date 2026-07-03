import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XClose } from '@untitled-ui/icons-react';
import { Button } from '../ui';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function BottomDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}: BottomDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-40"
            onClick={onClose}
          />

          {/* Drawer/Modal Container */}
          <div className="fixed inset-0 flex justify-center items-end sm:items-center z-50 pointer-events-none">
            <motion.div
              id="drawer-body"
              role="dialog"
              aria-modal="true"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="pointer-events-auto w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-slate-100"
            >
              {/* Drag Indicator / Tap Target for Close on Mobile */}
              <div className="flex flex-col items-center pt-3 pb-2 cursor-pointer sm:hidden bg-white active:bg-slate-50" onClick={onClose}>
                <div className="w-12 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-4 pt-1 sm:pt-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 leading-snug">{title}</h3>
                  {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1.5 rounded-full"
                >
                  <XClose className="w-5 h-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 px-5 py-4 pb-12 sm:pb-6 no-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
