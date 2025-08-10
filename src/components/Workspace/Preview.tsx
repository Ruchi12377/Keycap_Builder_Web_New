import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import type * as THREE from "three";

import type { LegendItem } from "../Workspace";
import { useOpenSCADProvider } from "../providers/OpenscadWorkerProvider";
import ThreeJsCanvas from "./Preview/ThreeJsCanvas";
import readFromSTLFile from "./Preview/readFromSTLFile";
import readFromSVGFile from "./Preview/readFromSVGFile";

interface PreviewProps {
  legendItems: LegendItem[];
  onLegendChange?: (legendItem: LegendItem) => void;
}

export default function Preview({ legendItems, onLegendChange }: PreviewProps) {
  const { previewFile, isRendering } = useOpenSCADProvider();
  const [geometry, setGeometry] = React.useState<THREE.Group | null>(null);
  const [selectedLegendId, setSelectedLegendId] = React.useState<string>("");
  const theme = useTheme();

  const handleLegendChange = (legendId: string) => {
    setSelectedLegendId(legendId);
    const selectedLegend = legendItems.find(item => item.id === legendId);
    if (selectedLegend && onLegendChange) {
      onLegendChange(selectedLegend);
    }
  };

  useEffect(() => {
    if (!previewFile) {
      return;
    }

    (async () => {
      let newGeometry: React.SetStateAction<THREE.Group<THREE.Object3DEventMap>>;

      if (previewFile.name.endsWith(".stl")) {
        newGeometry = await readFromSTLFile(
          previewFile,
          theme.palette.primary.main,
        );
      } else if (previewFile.name.endsWith(".svg")) {
        newGeometry = await readFromSVGFile(
          previewFile,
          theme.palette.primary.main,
          theme.palette.secondary.main,
        );
      } else {
        throw new Error("Unsupported file type");
      }
      setGeometry(newGeometry);
    })();
  }, [previewFile, theme.palette.primary.main, theme.palette.secondary.main]);

  const loading = (
    <div
      style={{
        zIndex: 999,
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.5)",
      }}
    >
      <div
        style={{
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%,-50%)",
        }}
      >
        <CircularProgress />
      </div>
    </div>
  );

  if (!previewFile && isRendering) {
    return loading;
  }

  if (!previewFile) {
    return null;
  }

  return (
    <div style={{ height: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "4px",
          padding: "5px",
          display: "flex",
          gap: "10px",
        }}
      >
        <FormControl size="small" variant="outlined">
          <Select
            value={selectedLegendId}
            onChange={(e) => handleLegendChange(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Legend selection" }}
            sx={{ minWidth: "120px" }}
          >
            <MenuItem value="">レジェンドを選択</MenuItem>
            {legendItems.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.main} {item.shift} {item.fn}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ThreeJsCanvas geometry={geometry} />
    </div>
  );
}
