'use client';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-600 hover:text-green-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
