import { Alert, AlertTitle, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { useWorkspaceProvider } from '../providers/WorkspaceProvider';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  onChange?: (code: string) => void;
}

export default function CodeEditor({ onChange }: CodeEditorProps) {
  const { code, setCode } =
    useWorkspaceProvider();

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        <AlertTitle>Code Editor</AlertTitle>
        Edit the code to your liking.
      </Alert>
      <Editor height="90vh" defaultLanguage="openscad" defaultValue={code}
        onChange={() => handleCodeChange} />;
    </div>
  );
}
