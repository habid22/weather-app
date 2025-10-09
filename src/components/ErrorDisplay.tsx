'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onClear?: () => void;
}

export default function ErrorDisplay({ error, onRetry, onClear }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card border border-subtle rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-foreground" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Weather Data Error
          </h3>
          <p className="text-muted mb-4 font-medium">{error}</p>
          
          <div className="flex space-x-3">
            {onRetry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="flex items-center space-x-2 btn-primary hover:shadow-lg transition-all duration-200 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Again</span>
              </motion.button>
            )}
            
            {onClear && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClear}
                className="btn-secondary hover:shadow-lg transition-all duration-200"
              >
                Dismiss
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
