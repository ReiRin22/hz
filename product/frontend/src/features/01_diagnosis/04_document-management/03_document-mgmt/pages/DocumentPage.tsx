import { useOutletContext } from 'react-router-dom';
import { DocumentManagementPanel } from '../../components/DocumentManagementPanel';
import { useDocumentManagement } from '../hooks/useDocumentManagement';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function DocumentPage() {
  const { currentPatient } = useOutletContext<OutletContext>();
  const documentManagement = useDocumentManagement();

  return (
    <DocumentManagementPanel 
      currentPatient={currentPatient} 
      documents={documentManagement.documents}
      onSaveDocument={documentManagement.handleSaveDocument}
      onUpdateDocument={documentManagement.handleUpdateDocument}
      onDeleteDocument={documentManagement.handleDeleteDocument}
      onUploadDocument={documentManagement.handleUploadDocument}
    />
  );
}
