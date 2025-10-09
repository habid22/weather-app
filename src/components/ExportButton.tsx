'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  FileImage,
  Check,
  Loader2,
  X
} from 'lucide-react';
import { ExportService, ExportableRecord } from '@/lib/exportService';

interface ExportButtonProps {
  records: ExportableRecord[];
  disabled?: boolean;
}

export default function ExportButton({ records, disabled = false }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFormats, setExportedFormats] = useState<string[]>([]);

  const handleExport = async (format: string) => {
    if (records.length === 0) return;
    
    setIsExporting(true);
    setExportedFormats([]);

    try {
      switch (format) {
        case 'json':
          ExportService.exportToJSON(records);
          break;
        case 'csv':
          ExportService.exportToCSV(records);
          break;
        case 'xml':
          ExportService.exportToXML(records);
          break;
        case 'pdf':
          await ExportService.exportToPDF(records);
          break;
        case 'all':
          await ExportService.exportAllFormats(records);
          setExportedFormats(['json', 'csv', 'xml', 'pdf']);
          break;
      }
      
      if (format !== 'all') {
        setExportedFormats([format]);
      }
      
      // Clear success indicators after 3 seconds
      setTimeout(() => {
        setExportedFormats([]);
      }, 3000);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'json',
      label: 'JSON',
      description: 'Structured data format',
      icon: FileCode,
      color: 'text-green-600'
    },
    {
      id: 'csv',
      label: 'CSV',
      description: 'Spreadsheet format',
      icon: FileSpreadsheet,
      color: 'text-blue-600'
    },
    {
      id: 'xml',
      label: 'XML',
      description: 'Markup format',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Document format',
      icon: FileImage,
      color: 'text-red-600'
    },
    {
      id: 'all',
      label: 'All Formats',
      description: 'Export all formats',
      icon: Download,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || records.length === 0}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 group"
      >
        <Download className="w-4 h-4 group-hover:animate-bounce" />
        <span className="font-medium">Export</span>
        {records.length > 0 && (
          <span className="bg-primary-foreground/20 px-2 py-1 rounded-full text-xs">
            {records.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Export Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl shadow-2xl border border-subtle z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Export Data</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4 text-muted" />
                  </button>
                </div>
                <p className="text-sm text-muted mt-1">
                  Export {records.length} weather record{records.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-2">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  const isExported = exportedFormats.includes(option.id);
                  const isExportingFormat = isExporting && !isExported;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option.id)}
                      disabled={isExporting}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 group"
                    >
                      <div className={`p-2 rounded-lg bg-background border border-subtle group-hover:border-primary/50 transition-colors ${option.color}`}>
                        {isExportingFormat ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isExported ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-foreground">{option.label}</div>
                        <div className="text-sm text-muted">{option.description}</div>
                      </div>
                      {isExported && (
                        <div className="text-green-600 text-sm font-medium">
                          ✓ Exported
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {records.length === 0 && (
                <div className="p-4 text-center text-muted text-sm">
                  No records to export
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
