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

import { useOpenSCADProvider } from "../providers/OpenscadWorkerProvider";
import ThreeJsCanvas from "./Preview/ThreeJsCanvas";
import readFromSTLFile from "./Preview/readFromSTLFile";
import readFromSVGFile from "./Preview/readFromSVGFile";

export default function Preview() {
  const { previewFile, isRendering } = useOpenSCADProvider();
  const [geometry, setGeometry] = React.useState<THREE.Group | null>(null);
  const theme = useTheme();

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
        }}
      >
        <FormControl size="small" variant="outlined">
          <Select
            displayEmpty
            inputProps={{ "aria-label": "View options" }}
            sx={{ minWidth: "120px" }}
          >
            <MenuItem value="standard">標準ビュー</MenuItem>
            <MenuItem value="top">上から</MenuItem>
            <MenuItem value="front">正面</MenuItem>
            <MenuItem value="side">側面</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ThreeJsCanvas geometry={geometry} />
    </div>
  );
}
