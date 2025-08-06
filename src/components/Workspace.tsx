import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import type { Parameter } from "../lib/openSCAD/parseParameter";
import parseOpenScadParameters from "../lib/openSCAD/parseParameter";
import Buttons from "./Workspace/Buttons";
import CodeEditor from "./Workspace/CodeEditor";
import Console from "./Workspace/Console";
import Customizer from "./Workspace/Customizer";
import FileSystem from "./Workspace/FileSystem";
import Legend from "./Workspace/Legend";
import Preview from "./Workspace/Preview";
import Sidebar from "./Workspace/Sidebar";
import { useFileSystemProvider } from "./providers/FileSystemProvider";
import { useOpenSCADProvider } from "./providers/OpenscadWorkerProvider";
import { useWorkspaceProvider } from "./providers/WorkspaceProvider";

export type EditorMode = "legend" | "editor" | "customizer" | "file";

// Define the interface for legend item
export interface LegendItem {
  id: string;
  main: string;
  shift: string;
  fn: string;
  bump: boolean;
  center: boolean;
}

export default function Workspace() {
  const { preview, previewFile, isRendering } = useOpenSCADProvider();
  const { files } = useFileSystemProvider();
  const { code } = useWorkspaceProvider();
  const [mode, setMode] = useState<EditorMode>("customizer");
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [legendItems, setLegendItems] = useState<LegendItem[]>([
    { id: "0", main: "A", shift: "+", fn: "@", bump: false, center: false },
    { id: "1", main: "B", shift: "-", fn: "&", bump: false, center: false },
  ]);

  // Whenever the code changes, attempt to parse the parameters
  useEffect(() => {
    if (!code) {
      return;
    }

    const newParams = parseOpenScadParameters(code);
    // Add old values to new params
    if (parameters.length) {
      // REFACTOR: rework to use a map instead of two loops
      for (const newParam of newParams) {
        const oldParam = parameters.find(
          (param) => param.name === newParam.name,
        );
        if (oldParam) {
          newParam.value = oldParam.value;
        }
      }
    }
    setParameters(newParams);

    if (mode === "customizer" && (!newParams || !newParams.length)) {
      setMode("editor");
    }

    // Render the preview if we have code and we don"t have a previewFile yet
    if (code?.length && !previewFile && !isRendering) {
      preview(code, newParams);
    }
  }, [code]);

  // Hydrate font options
  useEffect(() => {
    for (const p of parameters) {
      if (p.isFont) {
        p.options = files
          .filter((f) => f.type === "font")
          .map((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, "");
            return { value: nameWithoutExt, label: nameWithoutExt };
          });
      }
    }
  }, [files, parameters]);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ height: "100%", borderRight: "1px solid #ccc", p: 1 }}>
        <Sidebar mode={mode} onChange={(value) => setMode(value)} />
      </Box>
      <Grid container sx={{ height: "100%", flexGrow: 1 }}>
        <Grid
          size={{ xs: 4 }}
          sx={{ borderRight: 1, height: "80%", borderColor: "#ccc", pt: 2 }}
        >
          {mode === "legend" && (
            <Legend legendItems={legendItems} setLegendItems={setLegendItems} />
          )}
          {mode === "customizer" && (
            <Customizer
              parameters={parameters}
              onChange={(p) => setParameters(p)}
            />
          )}
          {mode === "editor" && <CodeEditor />}
          {mode === "file" && <FileSystem />}
        </Grid>
        <Grid size={{ xs: 8 }} sx={{ height: "80%", position: "relative" }}>
          <Preview />
        </Grid>
        <Grid
          size={{ xs: 4 }}
          sx={{
            height: "20%",
            borderRight: 1,
            borderTop: 1,
            borderColor: "#ccc",
          }}
        >
          <Buttons
            code={code}
            parameters={parameters}
            legendItems={legendItems}
          />
        </Grid>
        <Grid
          size={{ xs: 8 }}
          sx={{
            height: "20%",
            overflow: "scroll",
            fontSize: "0.8em",
            borderTop: 1,
            borderColor: "#ccc",
          }}
        >
          <Console />
        </Grid>
      </Grid>
    </Box>
  );
}
