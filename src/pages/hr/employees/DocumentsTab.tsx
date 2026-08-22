import React, { useState, useRef } from 'react';
import { Employee, EmployeeDocument } from '../../../types';
import { UploadCloud, FileText, Image as ImageIcon, Download, Trash2, File } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useHRData } from '../../../context/HRDataContext';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

interface DocumentsTabProps {
  employee: Employee;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const { updateEmployee } = useHRData();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [docToDelete, setDocToDelete] = useState<EmployeeDocument | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Mock uploading process
    const newDocs: EmployeeDocument[] = files.map(file => {
      let type: EmployeeDocument['type'] = 'pdf';
      if (file.type.includes('image')) type = 'image';
      else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) type = 'doc';

      return {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadedAt: new Date().toISOString().split('T')[0]
      };
    });

    updateEmployee(employee.id, {
      documents: [...(employee.documents || []), ...newDocs]
    });
    
    showToast(`Successfully uploaded ${files.length} document(s)`, 'success');
  };

  const handleDelete = () => {
    if (docToDelete) {
      updateEmployee(employee.id, {
        documents: employee.documents.filter(d => d.id !== docToDelete.id)
      });
      showToast('Document deleted successfully', 'success');
      setDocToDelete(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'doc': return <File className="w-8 h-8 text-blue-600" />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Click or drag documents to upload</h3>
        <p className="text-xs text-slate-500">Supports PDF, DOC, JPG, PNG (Max 10MB)</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Uploaded Documents</h3>
        {(!employee.documents || employee.documents.length === 0) ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employee.documents.map(doc => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow group">
                <div className="bg-slate-50 p-2 rounded-lg">
                  {getIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate" title={doc.name}>{doc.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{doc.size} &middot; {doc.uploadedAt}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDocToDelete(doc); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors" 
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!docToDelete}
        title="Delete Document"
        message={`Are you sure you want to delete ${docToDelete?.name}?`}
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};
