
export type DocumentType = 'Original' | 'Xerox';

export interface ChecklistItemData {
  id: number;
  label: string;
  required: boolean;
  fixedType: DocumentType;
}

export interface ChecklistData {
  partA: ChecklistItemData[];
  partB: ChecklistItemData[];
  partC: ChecklistItemData[];
  partD: ChecklistItemData[];
}

export type ApplicationType = 'Resale' | 'UnderConstruction';

export interface User {
  name: string;
  emp_id: string;
  designation: string;
  dept: string;
}

// New Types for Workflow
export type UserRole = 'Applicant' | 'ES' | 'Law' | 'Engineering' | 'HR' | 'Finance' | 'Admin';

export type AppStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'PENDING_LAW' 
  | 'PENDING_HR' 
  | 'PENDING_ENGG'
  | 'PENDING_RELATIONS'
  | 'PENDING_FINANCE'
  | 'APPROVED_FINANCE'
  | 'PENDING_ED'        // With ED for Final Authority
  | 'APPROVED_BY_ED'    // Approved by ED, returned to ES for Sanction issuance
  | 'SANCTIONED'        // Final Sanction Order Issued
  | 'RETURNED'
  | 'APPROVED';         // Generic Approved Status

export interface ReviewData {
  remarks: Record<string, string>; // Key: "section-id", Value: "Remark text"
  rejectedDocs: string[]; // Array of "section-id"
}

// New Type for Reviewer Inbox
export interface InboxItem {
  id: string;
  refNo: string;
  applicant: {
    name: string;
    designation: string;
    dept: string;
    empId: string;
  };
  submittedTime: string;
  status: AppStatus;
  priority: 'High' | 'Normal';
}
