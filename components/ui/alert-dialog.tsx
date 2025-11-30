'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description: string;
}

export function AlertDialog({ open, onClose, title, description }: AlertDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-lg p-6 mx-4 max-w-md w-full",
        "animate-in fade-in-0 zoom-in-95"
      )}>
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h2>
        )}
        <p className="text-sm text-gray-600 mb-6">
          {description}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
