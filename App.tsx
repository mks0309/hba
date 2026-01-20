
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { Dashboard } from './components/Dashboard'; 
import { ReviewerDashboard } from './components/ReviewerDashboard'; 
import { DashboardLayout } from './components/DashboardLayout';
import { ToastProvider, useToast } from './components/ToastContext';
import { User, UserRole, AppStatus, ReviewData } from './types';
import { USER_CREDENTIALS } from './data/UserCredentials';

// Default Fallback
const DEFAULT_USER: User = USER_CREDENTIALS["12345678"];

// Initial Review State
const INITIAL_REVIEW_DATA: ReviewData = {
  remarks: {},
  rejectedDocs: []
};

type AuthStep = 'login' | 'role-selection' | 'dashboard';

const AppContent: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Applicant');
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  
  // Layout Navigation State
  const [activeTab, setActiveTab] = useState('inbox');

  // Centralized Application State
  const [appStatus, setAppStatus] = useState<AppStatus>('DRAFT');
  const [reviewData, setReviewData] = useState<ReviewData>(INITIAL_REVIEW_DATA);

  // Toast Context hook is available here if we move logic to AppContent inside provider
  // But for simplicity of structure, assuming ToastProvider wraps AppContent in parent export
  
  const handleLogin = (empId: string) => {
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      
      const foundUser = USER_CREDENTIALS[empId];
      if (foundUser) {
        setCurrentUser(foundUser);
        setAuthStep('role-selection');
      } else {
        // Fallback for demo if unknown ID entered
        setCurrentUser({
           name: "IOCL Employee",
           emp_id: empId,
           designation: "Officer",
           dept: "Marketing Division"
        });
        setAuthStep('role-selection');
      }
    }, 1500);
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setAuthStep('dashboard');
    // Set default tab based on role
    if (role === 'Applicant') {
      setActiveTab('new');
    } else {
      setActiveTab('inbox');
    }

    // Demo state logic: if Law is selected, show pending state
    if (role === 'Law' && appStatus === 'DRAFT') {
      setAppStatus('PENDING_LAW');
    }
  };

  const handleLogout = () => {
    setAuthStep('login');
    setCurrentUser(DEFAULT_USER);
    // Reset state for demo
    setAppStatus('DRAFT'); 
  };

  const handleReviewAction = (action: 'RETURN' | 'RECOMMEND' | 'APPROVE', note?: string) => {
    if (action === 'RETURN') {
      setAppStatus('RETURNED');
    } else if (action === 'RECOMMEND') {
      setAppStatus('PENDING_HR');
    } else if (action === 'APPROVE') {
      setAppStatus('APPROVED');
    }
  };

  return (
    <div className="fluid-bg relative min-h-screen w-full font-sans text-slate-900 overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {authStep === 'login' && (
            <div key="login-wrapper" className="flex items-center justify-center min-h-screen p-4">
               <Login onLogin={handleLogin} isLoading={isLoading} />
            </div>
          )}

          {authStep === 'role-selection' && (
            <motion.div 
              key="role-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen w-full"
            >
               <RoleSelection user={currentUser} onRoleSelect={handleRoleSelect} />
            </motion.div>
          )}

          {authStep === 'dashboard' && (
            <DashboardLayout
              user={currentUser}
              userRole={userRole}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            >
              <motion.div
                 key="content-wrapper"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.4 }}
              >
                {userRole === 'Applicant' ? (
                  <Dashboard 
                    user={currentUser} 
                    appStatus={appStatus}
                    reviewData={reviewData}
                    activeTab={activeTab}
                  />
                ) : (
                  <ReviewerDashboard 
                    user={currentUser}
                    currentUserRole={userRole}
                    reviewData={reviewData}
                    activeTab={activeTab}
                    onUpdateReview={setReviewData}
                    onAction={handleReviewAction}
                    onLogout={handleLogout}
                  />
                )}
              </motion.div>
            </DashboardLayout>
          )}

        </AnimatePresence>
      </div>
  );
}

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
