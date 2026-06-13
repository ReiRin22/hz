"use client";
import SchemaCreationOrganism from './components/organisms/SchemaCreationOrganism';

interface REC002PageProps {
  onConfirm?: (schemaUuid: string, base64Image: string) => void;
  onCancel?: () => void;
}

export default function REC002Page({ onConfirm, onCancel }: REC002PageProps = {}) {
  return <SchemaCreationOrganism onConfirm={onConfirm} onCancel={onCancel} />;
}
