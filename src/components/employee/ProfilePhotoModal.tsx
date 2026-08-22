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

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 z-10">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" /> Change Profile Photo
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-4 border-white">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span>{currentInitials}</span>
            )}
          </div>

          <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-6 transition-colors bg-slate-50/50 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Click or drag image to upload'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or GIF up to 5MB</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};
