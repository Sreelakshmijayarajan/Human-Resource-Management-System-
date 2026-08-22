import React, { useState } from 'react';
import { X, UploadCloud, Camera, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInitials: string;
  onPhotoUpdated: (avatarUrl?: string) => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentInitials,
  onPhotoUpdated,
}) => {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes('image')) {
        showToast('Please select a valid image file (PNG or JPG)', 'error');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onPhotoUpdated(previewUrl);
      showToast('Profile photo updated successfully', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#161E28] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 dark:border-white/[0.08] z-10">
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#121821] border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0c8fe9]" /> Change Profile Photo
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-tr from-teal-500 to-[#0c8fe9] text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-4 border-white dark:border-[#121821]">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span>{currentInitials}</span>
            )}
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-white/[0.08] hover:border-[#0c8fe9]/40 rounded-2xl p-6 transition-colors bg-slate-50/50 dark:bg-[#121821] relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-[#0c8fe9] mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
              {selectedFile ? selectedFile.name : 'Click or drag image to upload'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-1">PNG, JPG, or GIF up to 5MB</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-[#121821] border-t border-slate-100 dark:border-white/[0.06] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-[#E5E7EB] hover:bg-slate-200 dark:hover:bg-[#1B2531] rounded-xl border dark:border-white/[0.08]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="px-5 py-2 bg-[#0c8fe9] hover:bg-[#0070c7] text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};
