
import React, { useState } from 'react';
import Layout from './components/Layout';
import RequirementList from './components/RequirementList';
import CreateRequirementModal from './components/CreateRequirementModal';
import IntelligentInterpretationView from './components/IntelligentInterpretationView';
import MetricBindingView from './components/MetricBindingView';
import NotifyConfirmationModal from './components/NotifyConfirmationModal';
import { Requirement, ViewType } from './types';
import { MOCK_REQUIREMENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('LIST');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(MOCK_REQUIREMENTS[0]); // Default for demo
  const [isNotified, setIsNotified] = useState(false);
  
  // Manage the requirements list in state so we can add new items dynamically
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS as Requirement[]);
  
  // Lifted Notify Modal state
  const [notifyModal, setNotifyModal] = useState({
    isOpen: false,
    tableName: '',
    metricCount: 0
  });

  const handleCreateRequirement = (data: any) => {
    setIsCreateModalOpen(false);
    const newReq: Requirement = {
      id: Date.now().toString(),
      name: data.name,
      techOwner: data.techOwner,
      businessOwner: data.requester,
      tableCount: data.tables.length,
      selectedTables: data.tables,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add the new requirement to the top of the list
    setRequirements(prev => [newReq, ...prev]);
    
    // Select it and go to detail view
    setSelectedRequirement(newReq);
    setIsNotified(false);
    setCurrentView('DETAIL');
  };

  const handleEnterDetail = (req: Requirement) => {
    setSelectedRequirement(req);
    setIsNotified(false);
    setCurrentView('DETAIL');
  };

  const handleBackToList = () => {
    setIsNotified(false);
    setCurrentView('LIST');
  };

  const openNotifyModal = (tableName: string, metricCount: number) => {
    setNotifyModal({ isOpen: true, tableName, metricCount });
  };

  const handleNotifyConfirm = () => {
    setNotifyModal(prev => ({ ...prev, isOpen: false }));
    setIsNotified(true);
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    if (currentView === 'LIST') {
      return (
        <RequirementList 
          requirements={requirements}
          onEnterDetail={handleEnterDetail} 
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />
      );
    }
    
    if (currentView === 'DETAIL' && selectedRequirement) {
      return (
        <IntelligentInterpretationView 
          requirement={selectedRequirement} 
          onBack={handleBackToList}
          onOpenNotifyModal={openNotifyModal}
          isNotified={isNotified}
        />
      );
    }

    if (currentView === 'BINDING' && selectedRequirement) {
      return (
        <MetricBindingView 
          requirement={selectedRequirement}
          onBack={handleBackToList}
        />
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Layout 
        hideSidebar={currentView === 'DETAIL' || currentView === 'BINDING'} 
        currentView={currentView}
        onNavigate={handleNavigate}
      >
        {renderContent()}
      </Layout>

      {/* Render modals at the root level to ensure overlays cover the entire screen */}
      <CreateRequirementModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRequirement}
      />

      {selectedRequirement && (
        <NotifyConfirmationModal 
          isOpen={notifyModal.isOpen} 
          onClose={() => setNotifyModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleNotifyConfirm}
          requirementName={selectedRequirement.name}
          tableName={notifyModal.tableName}
          metricCount={notifyModal.metricCount}
        />
      )}
    </div>
  );
};

export default App;
