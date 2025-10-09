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
  selectedRecords?: ExportableRecord[];
  disabled?: boolean;
  onSelectionChange?: (selectedRecords: ExportableRecord[]) => void;
}

export default function ExportButton({ 
  records, 
  selectedRecords = records, 
  disabled = false, 
  onSelectionChange 
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFormats, setExportedFormats] = useState<string[]>([]);
  const [localSelectedRecords, setLocalSelectedRecords] = useState<ExportableRecord[]>(selectedRecords);

  const handleExport = async (format: string) => {
    if (localSelectedRecords.length === 0) return;
    
    setIsExporting(true);
    setExportedFormats([]);

    try {
      switch (format) {
        case 'json':
          ExportService.exportToJSON(localSelectedRecords);
          break;
        case 'csv':
          ExportService.exportToCSV(localSelectedRecords);
          break;
        case 'xml':
          ExportService.exportToXML(localSelectedRecords);
          break;
        case 'pdf':
          await ExportService.exportToPDF(localSelectedRecords);
          break;
        case 'all':
          await ExportService.exportAllFormats(localSelectedRecords);
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
        {localSelectedRecords.length > 0 && (
          <span className="bg-primary-foreground/20 px-2 py-1 rounded-full text-xs">
            {localSelectedRecords.length}
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
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              style={{ 
                maxWidth: 'none',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                transform: 'none'
              }}
            >
              <div className="w-full max-w-2xl max-h-[90vh] bg-card rounded-xl shadow-2xl border border-subtle overflow-hidden flex flex-col">
                <div className="p-4 border-b border-subtle flex-shrink-0">
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
                    Export {localSelectedRecords.length} of {records.length} weather record{records.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Selection Controls */}
                <div className="p-4 border-b border-subtle flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Select Records</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setLocalSelectedRecords(records);
                          onSelectionChange?.(records);
                        }}
                        className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => {
                          setLocalSelectedRecords([]);
                          onSelectionChange?.([]);
                        }}
                        className="text-xs px-3 py-1 bg-accent rounded hover:bg-accent/80 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {records.map((record) => {
                      const isSelected = localSelectedRecords.some(selected => selected._id === record._id);
                      return (
                        <label key={record._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer border border-subtle">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newSelected = [...localSelectedRecords, record];
                                setLocalSelectedRecords(newSelected);
                                onSelectionChange?.(newSelected);
                              } else {
                                const newSelected = localSelectedRecords.filter(selected => selected._id !== record._id);
                                setLocalSelectedRecords(newSelected);
                                onSelectionChange?.(newSelected);
                              }
                            }}
                            className="w-4 h-4 text-primary bg-background border-subtle rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">
                              {record.location}
                            </span>
                            <div className="text-xs text-muted">
                              {record.isHistorical ? 'Historical' : 'Current'} • {record.dateRange.start.split('T')[0]} to {record.dateRange.end.split('T')[0]}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Export Options */}
                <div className="p-4 flex-1 overflow-y-auto">
                  <h4 className="text-sm font-medium text-foreground mb-3">Export Formats</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </div>

                {records.length === 0 && (
                  <div className="p-8 text-center text-muted text-sm">
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
