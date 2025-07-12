import { useEffect, useState } from 'react';
import { useFileSystemProvider } from '../components/providers/FileSystemProvider';
import WorkspaceFile from '../lib/WorkspaceFile';

export default function useImport() {
  const { files, writeFile } = useFileSystemProvider();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<Error | null>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/fonts.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const jsonObject = await response.json();
        const array = jsonObject as string[];
        await Promise.all(array.map(async (font) => {
          const fontResponse = await fetch(`/fonts/${font}`);
          if (!fontResponse.ok) {
            throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
          }
          const content = await fontResponse.bytes();
          await writeFile(
            new WorkspaceFile([content], font, {
              type: 'font',
              path: 'fonts/' + font
            }),
          );
        }));
        return;
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { error, files, isLoading };
}
