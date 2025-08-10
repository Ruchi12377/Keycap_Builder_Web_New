import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useState } from "react";
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
    // Row 1 - 数字行
    { id: "0", main: "`", shift: "~", fn: "", bump: false, center: false },
    { id: "1", main: "1", shift: "!", fn: "F1", bump: false, center: false },
    { id: "2", main: "2", shift: "@", fn: "F2", bump: false, center: false },
    { id: "3", main: "3", shift: "#", fn: "F3", bump: false, center: false },
    { id: "4", main: "4", shift: "$", fn: "F4", bump: false, center: false },
    { id: "5", main: "5", shift: "%", fn: "F5", bump: false, center: false },
    { id: "6", main: "6", shift: "^", fn: "F6", bump: false, center: false },
    { id: "7", main: "7", shift: "&", fn: "F7", bump: false, center: false },
    { id: "8", main: "8", shift: "*", fn: "F8", bump: false, center: false },
    { id: "9", main: "9", shift: "(", fn: "F9", bump: false, center: false },
    { id: "10", main: "0", shift: ")", fn: "F10", bump: false, center: false },
    { id: "11", main: "-", shift: "_", fn: "F11", bump: false, center: false },
    { id: "12", main: "=", shift: "+", fn: "F12", bump: false, center: false },
    { id: "13", main: "BS", shift: "", fn: "", bump: false, center: true },

    // Row 2 - QWERTY行
    { id: "14", main: "Tab", shift: "", fn: "", bump: false, center: true },
    { id: "15", main: "Q", shift: "", fn: "", bump: false, center: false },
    { id: "16", main: "W", shift: "", fn: "", bump: false, center: false },
    { id: "17", main: "E", shift: "", fn: "", bump: false, center: false },
    { id: "18", main: "R", shift: "", fn: "", bump: false, center: false },
    { id: "19", main: "T", shift: "", fn: "", bump: false, center: false },
    { id: "20", main: "Y", shift: "", fn: "", bump: false, center: false },
    { id: "21", main: "U", shift: "", fn: "", bump: false, center: false },
    { id: "22", main: "I", shift: "", fn: "", bump: false, center: false },
    { id: "23", main: "O", shift: "", fn: "", bump: false, center: false },
    { id: "24", main: "P", shift: "", fn: "", bump: false, center: false },
    { id: "25", main: "[", shift: "{", fn: "", bump: false, center: false },
    { id: "26", main: "]", shift: "}", fn: "", bump: false, center: false },
    { id: "27", main: "\\", shift: "|", fn: "", bump: false, center: false },

    // Row 3 - ASDF行
    { id: "28", main: "CL", shift: "", fn: "", bump: false, center: true },
    { id: "29", main: "A", shift: "", fn: "", bump: false, center: false },
    { id: "30", main: "S", shift: "", fn: "", bump: false, center: false },
    { id: "31", main: "D", shift: "", fn: "", bump: false, center: false },
    { id: "32", main: "F", shift: "", fn: "", bump: true, center: false },
    { id: "33", main: "G", shift: "", fn: "", bump: false, center: false },
    { id: "34", main: "H", shift: "", fn: "", bump: false, center: false },
    { id: "35", main: "J", shift: "", fn: "", bump: true, center: false },
    { id: "36", main: "K", shift: "", fn: "", bump: false, center: false },
    { id: "37", main: "L", shift: "", fn: "", bump: false, center: false },
    { id: "38", main: ";", shift: ":", fn: "", bump: false, center: false },
    { id: "39", main: "'", shift: "\"", fn: "", bump: false, center: false },
    { id: "40", main: "Ret", shift: "", fn: "", bump: false, center: true },

    // Row 4 - ZXCV行
    { id: "41", main: "Shift", shift: "", fn: "", bump: false, center: true },
    { id: "42", main: "Z", shift: "", fn: "", bump: false, center: false },
    { id: "43", main: "X", shift: "", fn: "", bump: false, center: false },
    { id: "44", main: "C", shift: "", fn: "", bump: false, center: false },
    { id: "45", main: "V", shift: "", fn: "", bump: false, center: false },
    { id: "46", main: "B", shift: "", fn: "", bump: false, center: false },
    { id: "47", main: "N", shift: "", fn: "", bump: false, center: false },
    { id: "48", main: "M", shift: "", fn: "", bump: false, center: false },
    { id: "49", main: ",", shift: "<", fn: "", bump: false, center: false },
    { id: "50", main: ".", shift: ">", fn: "", bump: false, center: false },
    { id: "51", main: "/", shift: "?", fn: "", bump: false, center: false },
    { id: "52", main: "Shift", shift: "", fn: "", bump: false, center: true },

    // Row 5 - Ctrl/Alt/Space
    { id: "53", main: "Ctrl", shift: "", fn: "", bump: false, center: false },
    { id: "54", main: "Win", shift: "", fn: "", bump: false, center: false },
    { id: "55", main: "Alt", shift: "", fn: "", bump: false, center: false },
    { id: "56", main: "Space", shift: "", fn: "", bump: false, center: true },
    { id: "58", main: "Fn", shift: "", fn: "", bump: false, center: false },
    { id: "60", main: "Ctrl", shift: "", fn: "", bump: false, center: false },

    // Row 6 - 矢印キー
    { id: "61", main: "←", shift: "", fn: "", bump: false, center: true },
    { id: "62", main: "↓", shift: "", fn: "", bump: false, center: true },
    { id: "63", main: "↑", shift: "", fn: "", bump: false, center: true },
    { id: "64", main: "→", shift: "", fn: "", bump: false, center: true }
  ]);
  const [selectedLegendItem, setSelectedLegendItem] = useState<LegendItem | null>(null);

  const handleLegendChange = (legendItem: LegendItem) => {
    setSelectedLegendItem(legendItem);
    // selectedLegendItemが変更されると、useEffectが再実行され、
    // パラメータが更新されてプレビューが再レンダリングされます
  };

  // legendItemの値をパラメータに適用するヘルパー関数
  const applyLegendValuesToParameters = useCallback((params: Parameter[], legendItem: LegendItem | null): Parameter[] => {
    if (!legendItem || !params.length) {
      return params;
    }

    // パラメータのコピーを作成して値を更新
    return params.map(param => {
      const updatedParam = { ...param };

      // legend関連のパラメータに値を適用
      switch (param.name) {
        case 'per_main_text_string':
          updatedParam.value = legendItem.main;
          break;
        case 'per_shift_text_string':
          updatedParam.value = legendItem.shift;
          break;
        case 'per_fn_text_string':
          updatedParam.value = legendItem.fn;
          break;
        case 'per_homing_dot':
          updatedParam.value = legendItem.bump;
          break;
        default:
          // その他のパラメータはそのまま
          break;
      }

      return updatedParam;
    });
  }, []);

  // Parse parameters when code changes
  useEffect(() => {
    if (!code) {
      return;
    }

    const newParams = parseOpenScadParameters(code);

    // Add old values to new params using functional state update to avoid stale closure
    setParameters((prevParameters) => {
      // Start with the new parameters
      const updatedParams = [...newParams];

      // Preserve old values from previous parameters
      if (prevParameters.length) {
        for (const newParam of updatedParams) {
          const oldParam = prevParameters.find(
            (param) => param.name === newParam.name,
          );
          if (oldParam) {
            newParam.value = oldParam.value;
          }
        }
      }

      return updatedParams;
    });

    if (mode === "customizer" && (!newParams || !newParams.length)) {
      setMode("editor");
    }
  }, [code, mode]);

  // Render preview when parameters, code, or selectedLegendItem changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!code || !parameters.length || isRendering) {
      return;
    }

    const modifiedParams = applyLegendValuesToParameters(parameters, selectedLegendItem);
    preview(code, modifiedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, parameters, selectedLegendItem]);

  // Hydrate font options
  useEffect(() => {
    console.log("Hydrating font options with files:", files);
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
          <Preview
            legendItems={legendItems}
            onLegendChange={handleLegendChange}
          />
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
