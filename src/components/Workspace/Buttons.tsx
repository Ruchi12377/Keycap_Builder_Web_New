import LoopIcon from '@mui/icons-material/Loop';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Parameter } from '../../lib/openSCAD/parseParameter';
import { useOpenSCADProvider } from '../providers/OpenscadWorkerProvider';
import { LegendItem } from '../Workspace';
import JSZip from 'jszip';

const loopAnimation = {
  animation: 'spin 2s linear infinite',
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(360deg)',
    },
    '100%': {
      transform: 'rotate(0deg)',
    },
  },
};

type Props = {
  code: string;
  parameters: Parameter[];
  legendItems?: LegendItem[];
};

export default function Buttons({ code, parameters, legendItems }: Props) {
  const {
    execExport,
    isExporting,
    isRendering,
    previewFile,
    preview,
  } = useOpenSCADProvider();

  const handleRender = async () => {
    preview(code, parameters);
  };

  /**
 * Makes a string safe for use in filenames by replacing unsafe characters
 */
  const makeFilenameSafe = (name: string): string => {
    return name
      .replace(/\//g, "slash")
      .replace(/\\/g, "backslash")
      .replace(/:/g, "colon")
      .replace(/\*/g, "asterisk")
      .replace(/\?/g, "question")
      .replace(/"/g, "quote")
      .replace(/</g, "less")
      .replace(/>/g, "greater")
      .replace(/\|/g, "pipe");
  };


  /**
 * Downloads a file to the user's device
 */
  const downloadFile = (filename: string, obj: File | Blob): void => {
    const url = URL.createObjectURL(obj);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    // Clean up to avoid memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };


  async function handleExport() {
    const exportedFiles: { file: File, name: string }[] = [];
    for (const item of legendItems) {
      let main, shift, fn = '';
      parameters.filter(x => x.name.startsWith("per_")).forEach(param => {
        switch (param.name) {
          case 'per_main_text_string':
            param.value = item.main;
            main = item.main;
            break;
          case 'per_shift_text_string':
            param.value = item.shift;
            shift = item.shift;
            break;
          case 'per_fn_text_string':
            param.value = item.fn;
            fn = item.fn;
            break;
          case 'per_homing_dot':
            param.value = item.bump;
            break;
          default:
            console.log(`${param.name} was not hydrated.`);
        }
      });
      const file = await execExport(code, "stl", parameters);
      exportedFiles.push({ file, name: makeFilenameSafe(`keycap_${main}_${shift}_${fn}.stl`) });
    }

    // Handle download - single file or zip archive
    if (exportedFiles.length === 1) {
      const file = exportedFiles[0];
      downloadFile(file.name, file.file);
    } else {
      const zip = new JSZip();
      for (const { name, file } of exportedFiles) {
        zip.file(name, file);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadFile("keycaps.zip", zipBlob);
    }
  }

  return (
    <Stack direction="row" spacing={2} sx={{ m: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRender}
        startIcon={isRendering && <LoopIcon sx={loopAnimation} />}
      >
        Render
      </Button>
      <Button
        disabled={isRendering || isExporting || !previewFile}
        startIcon={isExporting && <LoopIcon sx={loopAnimation} />}
        onClick={() => {
          handleExport();
        }}
      >
        Export STL
      </Button>
    </Stack>
  );
}
