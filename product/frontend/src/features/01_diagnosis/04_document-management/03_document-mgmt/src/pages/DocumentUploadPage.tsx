import { useNavigate } from 'react-router-dom';
import { StandaloneDocumentUploadPanel } from '../../components/document/StandaloneDocumentUploadPanel';
import { useDocumentManagement } from '../hooks/useDocumentManagement';
import { documentTypeSamples, departments } from '../data/documentData';

export function DocumentUploadPage() {
  const navigate = useNavigate();
  const documentManagement = useDocumentManagement();

  return (
    <StandaloneDocumentUploadPanel 
      documentTypes={documentTypeSamples}
      departments={departments}
      onUpload={documentManagement.handleUploadDocument}
      onClose={() => navigate('/order')}
    />
  );
}
