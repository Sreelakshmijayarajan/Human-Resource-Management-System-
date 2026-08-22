export interface ProfileDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
  uploadedAt: string;
  category: 'hr_contract' | 'self_uploaded';
}

export interface EmployeeProfile {
  id: string;
  name: string;
  firstName?: string;
  designation: string;
  department: string;
  employmentType: string;
  dateOfJoining: string;
  reportingManager: string;
  workLocation: string;
  status: 'active' | 'on_leave' | 'inactive';
  email: string;
  phone: string;
  personalEmail: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  avatarInitials: string;
  avatarUrl?: string;
  documents: ProfileDocument[];
}

export const initialEmployeeProfile: EmployeeProfile = {
  id: 'EMP-001',
  name: 'Sanjay Kumar',
  designation: 'Senior Product Designer',
  department: 'Product & Design',
  employmentType: 'Full-Time Permanent',
  dateOfJoining: '2022-03-15',
  reportingManager: 'Sneha Rao (Engineering Director)',
  workLocation: 'Dayflow HQ • Indiranagar, Bengaluru',
  status: 'active',
  email: 'sanjay.kumar@dayflow.io',
  phone: '+91 98765 43210',
  personalEmail: 'sanjay.design@gmail.com',
  address: '123 Tech Park, Indiranagar 100ft Road, Bengaluru, KA 560038',
  emergencyContactName: 'Ananya Kumar (Spouse)',
  emergencyContactPhone: '+91 98123 45678',
  avatarInitials: 'SK',
  documents: [
    {
      id: 'doc-101',
      name: 'Employment_Contract_Sanjay_Kumar.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '2022-03-15',
      category: 'hr_contract',
    },
    {
      id: 'doc-102',
      name: 'ID_Proof_Aadhaar_Passport.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedAt: '2022-03-16',
      category: 'hr_contract',
    },
    {
      id: 'doc-103',
      name: 'UX_Design_Master_Certification.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadedAt: '2024-01-20',
      category: 'self_uploaded',
    },
    {
      id: 'doc-104',
      name: 'Design_Leadership_Course_Degree.png',
      type: 'image',
      size: '850 KB',
      uploadedAt: '2025-06-11',
      category: 'self_uploaded',
    },
  ],
};
