import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Edit3, 
  Lock, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  Camera,
  UserCheck
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProfilePhotoModal } from '../../components/employee/ProfilePhotoModal';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfileDetails, addProfileDocument, deleteProfileDocument } = useAppContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'documents'>('personal');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  // Form State for Personal Details
  const [formData, setFormData] = useState({
    phone: profile.phone,
    personalEmail: profile.personalEmail,
    address: profile.address,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validatePersonalDetails = () => {
    const errors: Record<string, string> = {};
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.personalEmail.trim()) {
      errors.personalEmail = 'Personal email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
      errors.personalEmail = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonalDetails = () => {
    if (!validatePersonalDetails()) return;

    setIsSaving(true);
    setTimeout(() => {
      updateProfileDetails(formData);
      setIsSaving(false);
      setIsEditMode(false);
      showToast('Personal details updated successfully!', 'success');
    }, 600);
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    // Validate type (.pdf, .png, .jpeg, .jpg, .doc, .docx)
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setUploadError('Invalid file type. Only PDF, PNG, JPG, and DOC files are permitted.');
      return;
    }

    let docType: 'pdf' | 'doc' | 'image' = 'pdf';
    if (['png', 'jpg', 'jpeg'].includes(ext)) docType = 'image';
    if (['doc', 'docx'].includes(ext)) docType = 'doc';

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    addProfileDocument({
      name: file.name,
      type: docType,
      size: sizeStr,
    });

    showToast(`Document "${file.name}" uploaded successfully!`, 'success');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 shadow-sm transition-all"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-500">Manage your personal details and employment documents.</p>
        </div>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 relative">
          <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Verified Employee Record
          </div>
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white text-3xl font-extrabold flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile.avatarInitials
                  )}
                </div>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-bold cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Edit
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{profile.name}</h2>
                <p className="text-sm font-bold text-teal-600">{profile.designation}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {profile.department} • Employee ID: <span className="font-bold text-slate-700">{profile.id}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={profile.status} />
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" /> Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'personal'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'job'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Documents ({profile.documents.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Personal Details */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Contact details and emergency contacts.</p>
            </div>

            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setFormErrors({});
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersonalDetails}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Locked HR Fields */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> HR-Managed Legal Fields (Locked)
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 relative group">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Full Legal Name</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{profile.name}</span>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 relative group">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Employee ID</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{profile.id}</span>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 relative group">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Work Email</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{profile.email}</span>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  * Note: Legal name, Employee ID, and Work Email are managed by HR. Contact HR administration to request updates.
                </p>
              </div>
            </div>

            {/* Editable Contact Fields */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Contact & Emergency Details
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                  {isEditMode ? (
                    <div>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none focus:ring-2 ${
                          formErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20'
                        }`}
                      />
                      {formErrors.phone && <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800">
                      {profile.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Personal Email</label>
                  {isEditMode ? (
                    <div>
                      <input
                        type="email"
                        value={formData.personalEmail}
                        onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                        className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none focus:ring-2 ${
                          formErrors.personalEmail ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20'
                        }`}
                      />
                      {formErrors.personalEmail && <p className="text-[11px] text-red-500 mt-1">{formErrors.personalEmail}</p>}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800">
                      {profile.personalEmail}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                  {isEditMode ? (
                    <div>
                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none focus:ring-2 resize-none ${
                          formErrors.address ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20'
                        }`}
                      />
                      {formErrors.address && <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800 leading-relaxed">
                      {profile.address}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Contact Person</label>
                    {isEditMode ? (
                      <div>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        {formErrors.emergencyContactName && <p className="text-[11px] text-red-500 mt-1">{formErrors.emergencyContactName}</p>}
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                        {profile.emergencyContactName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                    {isEditMode ? (
                      <div>
                        <input
                          type="text"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        {formErrors.emergencyContactPhone && <p className="text-[11px] text-red-500 mt-1">{formErrors.emergencyContactPhone}</p>}
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                        {profile.emergencyContactPhone}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Job Details */}
      {activeTab === 'job' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Job & Employment Details</h3>
            <p className="text-xs text-slate-500">Official employment attributes and organizational placement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.department}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Designation</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.designation}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Employment Type</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.employmentType}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Date of Joining</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.dateOfJoining}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Manager</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.reportingManager}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Work Location</span>
              <span className="text-sm font-extrabold text-slate-900">{profile.workLocation}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white relative ${
              isDragging ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-slate-200 hover:border-teal-400'
            }`}
          >
            <input
              type="file"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-10 h-10 text-teal-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Drag & Drop to Self-Upload Certifications & Documents</h4>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG, DOC (Max file size: 5MB)</p>

            {uploadError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl animate-fade-in max-w-md mx-auto">
                {uploadError}
              </div>
            )}
          </div>

          {/* Document List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Your Employment Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-sm transition-all flex items-start gap-3.5 bg-white group"
                >
                  <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
                    {doc.type === 'pdf' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {doc.size} • Uploaded {doc.uploadedAt}
                    </p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 ${
                      doc.category === 'hr_contract' ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                      {doc.category === 'hr_contract' ? 'HR Contract' : 'Self Uploaded'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => showToast(`Downloading ${doc.name}...`, 'info')}
                      className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {doc.category === 'self_uploaded' && (
                      <button
                        onClick={() => {
                          deleteProfileDocument(doc.id);
                          showToast('Document deleted', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete self-uploaded document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Change Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentInitials={profile.avatarInitials}
        onPhotoUpdated={(url) => updateProfileDetails({ avatarUrl: url })}
      />
    </div>
  );
};
