import React, { createContext, useEffect, useState } from 'react';

type ContextType = {
  code: string;
  setCode: (code: string) => void;
};

// Create a context for the provider
const WorkspaceContext = createContext<ContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

// Create a provider component
export default function WorkspaceProvider({ children }: Props) {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (!code) {
      (async () => {
        const response = await fetch('/keycap.scad');
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        setCode(await response.text());
      })();
    }
  }, []);

  const value = {
    code,
    setCode
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceProvider() {
  const context = React.useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      'useWorkspaceProvider must be used within a WorkspaceProvider'
    );
  }

  return context;
}
