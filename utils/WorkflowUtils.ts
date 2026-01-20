
import { Check, Clock, User, Users, Scale, Hammer, Wallet, Crown, FileCheck2, ShieldCheck, GitFork } from 'lucide-react';
import { AppStatus } from '../types';

export interface WorkflowStep {
  id: number;
  role: string;
  label: string;
  icon: any;
  statusMatch: AppStatus[];
  type?: 'parallel';
  subSteps?: { dept: string, icon: any }[];
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { 
    id: 1, 
    role: "Applicant", 
    label: "Submission", 
    icon: User,
    statusMatch: ['SUBMITTED']
  },
  { 
    id: 2, 
    role: "ES / State HR", 
    label: "Initial Verification", 
    icon: ShieldCheck,
    statusMatch: ['PENDING_LAW', 'PENDING_HR', 'PENDING_ENGG', 'PENDING_RELATIONS'] 
  },
  { 
    id: 3, 
    role: "Departments", 
    label: "Parallel Clearances", 
    icon: GitFork,
    type: 'parallel',
    subSteps: [
        { dept: "Law Dept", icon: Scale },
        { dept: "HR & ER", icon: Users },
        { dept: "Engineering", icon: Hammer }
    ],
    statusMatch: ['PENDING_FINANCE'] // Assuming this step is done when pending finance
  },
  { 
    id: 4, 
    role: "ES / State HR", 
    label: "Consolidation", 
    icon: FileCheck2,
    statusMatch: ['PENDING_FINANCE']
  },
  { 
    id: 5, 
    role: "Finance", 
    label: "Budget Concurrence", 
    icon: Wallet,
    statusMatch: ['APPROVED_FINANCE', 'PENDING_ED']
  },
  { 
    id: 6, 
    role: "ES / State HR", 
    label: "Final Scrutiny", 
    icon: ShieldCheck,
    statusMatch: ['PENDING_ED']
  },
  { 
    id: 7, 
    role: "ED (Region)", 
    label: "Final Authority Approval", 
    icon: Crown,
    statusMatch: ['APPROVED_BY_ED', 'SANCTIONED']
  },
  { 
    id: 8, 
    role: "ES / State HR", 
    label: "Sanction Order Issuance", 
    icon: FileCheck2,
    statusMatch: ['SANCTIONED']
  }
];

export const getCurrentStepIndex = (status: AppStatus): number => {
  switch (status) {
    case 'DRAFT': return 0;
    case 'SUBMITTED': return 1;
    // Verification & Parallel Steps
    case 'PENDING_LAW': 
    case 'PENDING_HR': 
    case 'PENDING_ENGG': 
    case 'PENDING_RELATIONS': return 2;
    // Consolidation
    case 'PENDING_FINANCE': return 4; // Visualizes that we are waiting on Finance (Step 5)
    // Finance Done, ES Scrutiny
    case 'APPROVED_FINANCE': return 5;
    // Sent to ED
    case 'PENDING_ED': return 6;
    // ED Approved, Back to ES
    case 'APPROVED_BY_ED': return 7;
    // Done
    case 'SANCTIONED': return 8;
    case 'RETURNED': return 0; // Reset
    default: return 0;
  }
};
