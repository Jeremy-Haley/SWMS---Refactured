import React, { useState } from 'react';
import { CompanyProvider, useCompany } from './contexts/CompanyContext';
import { AuthPage } from './Pages/AuthPage';
import { Header } from './components/layout/Header';
import { SWMSList } from './components/swms/SWMSList';
import { SWMSForm } from './components/swms/SWMSForm';
import { SWMSViewer } from './components/swms/SWMSViewer';
import { TemplateModal } from './components/modals/TemplateModal';
import { QRCodeModal } from './components/modals/QRCodeModal';
import { useSWMSManager } from './hooks/useSWMSManager';
import './index.css';

// Main app content (only shown when authenticated)
function AppContent() {
  const { isAuthenticated, loading, company } = useCompany();

  const {
    swmsList,
    currentView,
    formData,
    editingSWMS,
    viewingSWMS,
    startNewSWMS,
    startEditSWMS,
    viewSWMS,
    deleteSWMS,
    saveSWMS,
    cancelForm,
    setCurrentView,
    updateFormField,
    updateCompanyField,
    addJobStepFromTemplate,
    addMultipleJobStepsFromTemplates,
    addCustomJobStep,
    updateJobStep,
    removeJobStep,
    addSignOff,
    updateSignOff,
    removeSignOff,
  } = useSWMSManager();

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  // Get list of already-added template names
  const addedTemplateNames = formData.jobSteps.map((step) => step.name);

  const handleAddTemplate = (templateKey, template) => {
    addJobStepFromTemplate(templateKey, template);
  };

  const handleAddMultipleTemplates = (templatesArray) => {
    addMultipleJobStepsFromTemplates(templatesArray);
    setShowTemplateModal(false);
  };

  const handleSearchEmergencyServices = async (location) => {
    const confirmed = window.confirm(
      `Search for emergency services near "${location}"?\n\n` +
        `This will search for:\n` +
        `• Nearest police station\n` +
        `• Nearest hospital/medical center\n\n` +
        `Note: You can ask Claude (the AI assistant) to search for emergency services ` +
        `and Claude will automatically fill in the fields with real information from the web.`
    );

    if (confirmed) {
      alert(
        `To get real emergency service information:\n\n` +
          `Ask Claude: "Can you search for the nearest police station and hospital near ${location} and fill in the emergency contacts fields?"\n\n` +
          `Claude will use web search to find:\n` +
          `• Police station name, address, and phone\n` +
          `• Hospital/medical center name, address, and phone\n\n` +
          `Then Claude will update the fields automatically!`
      );
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '8px',
            }}
          >
            SWMS Manager
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Show authentication page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app if authenticated
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
      }}
    >
      <Header
        currentView={currentView}
        onNavigateHome={() => setCurrentView('list')}
        onNavigateToForm={startNewSWMS}
      />

      <div
        style={{ maxWidth: '1400px', margin: '24px auto', padding: '0 24px' }}
      >
        {currentView === 'list' && (
          <SWMSList
            swmsList={swmsList}
            onCreateNew={startNewSWMS}
            onView={viewSWMS}
            onEdit={startEditSWMS}
            onDelete={deleteSWMS}
          />
        )}

        {currentView === 'form' && (
          <SWMSForm
            formData={formData}
            editingSWMS={editingSWMS}
            onSave={saveSWMS}
            onCancel={cancelForm}
            updateFormField={updateFormField}
            updateCompanyField={updateCompanyField}
            onOpenTemplateModal={() => setShowTemplateModal(true)}
            onUpdateJobStep={updateJobStep}
            onRemoveJobStep={removeJobStep}
            onAddCustomJobStep={addCustomJobStep}
            onAddSignOff={addSignOff}
            onUpdateSignOff={updateSignOff}
            onRemoveSignOff={removeSignOff}
            onSearchEmergencyServices={handleSearchEmergencyServices}
            onGenerateQRCode={() => setShowQRCodeModal(true)}
          />
        )}

        {currentView === 'view' && viewingSWMS && (
          <SWMSViewer
            swms={viewingSWMS}
            onBack={() => setCurrentView('list')}
            onEdit={() => startEditSWMS(viewingSWMS)}
            onGenerateQRCode={() => setShowQRCodeModal(true)}
          />
        )}
      </div>

      <TemplateModal
        show={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onAddTemplate={handleAddTemplate}
        onAddMultipleTemplates={handleAddMultipleTemplates}
        addedTemplateNames={addedTemplateNames}
      />

      <QRCodeModal
        show={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        swmsId={viewingSWMS?.id || formData.id}
        projectName={
          viewingSWMS?.projectName || formData.projectName || 'Untitled SWMS'
        }
        swms={viewingSWMS || formData}
      />
    </div>
  );
}

// Main App component - wraps everything with CompanyProvider
export default function App() {
  return (
    <CompanyProvider>
      <AppContent />
    </CompanyProvider>
  );
}
