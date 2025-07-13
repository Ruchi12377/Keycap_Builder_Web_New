import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Alert, AlertTitle, Button, Checkbox, FormControlLabel, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

// Define the interface for legend item
interface LegendItem {
  id: string;
  main: string;
  shift: string;
  fn: string;
  bump: boolean;
  center: boolean;
}

export default function Legend() {
  // State to store legend items
  const [legendItems, setLegendItems] = useState<LegendItem[]>([
    { id: '1', main: '', shift: '', fn: '', bump: false, center: false }
  ]);

  // Function to handle text change
  const handleTextChange = (id: string, field: 'main' | 'shift' | 'fn', value: string) => {
    setLegendItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Function to handle bump toggle
  const handleBumpChange = (id: string, checked: boolean) => {
    setLegendItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, bump: checked } : item
      )
    );
  };

  // Function to handle center toggle
  const handleCenterChange = (id: string, checked: boolean) => {
    setLegendItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? {
          ...item,
          center: checked,
          // Clear shift and fn fields if center is enabled
          ...(checked ? { shift: '', fn: '' } : {})
        } : item
      )
    );
  };

  // Function to add a new legend item
  const addLegendItem = () => {
    const newId = Date.now().toString();
    setLegendItems(prevItems => [...prevItems, { id: newId, main: '', shift: '', fn: '', bump: false, center: false }]);
  };

  // Function to delete a legend item
  const deleteLegendItem = (id: string) => {
    setLegendItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div style={{ height: '100%', overflow: 'scroll' }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        <AlertTitle>凡例設定 (Legend Settings)</AlertTitle>
        キーキャップの文字の設定を調整します。
      </Alert>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>キーキャップ凡例 (Keycap Legends)</Typography>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Main</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Fn</TableCell>
                <TableCell>Bump</TableCell>
                <TableCell>Center</TableCell>
                <TableCell width="50px"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {legendItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={item.main}
                      onChange={(e) => handleTextChange(item.id, 'main', e.target.value)}
                      sx={{ p: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={item.shift}
                      onChange={(e) => handleTextChange(item.id, 'shift', e.target.value)}
                      disabled={item.center}
                      sx={{ p: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={item.fn}
                      onChange={(e) => handleTextChange(item.id, 'fn', e.target.value)}
                      disabled={item.center}
                      sx={{ p: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.bump}
                          onChange={(e) => handleBumpChange(item.id, e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.center}
                          onChange={(e) => handleCenterChange(item.id, e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                      sx={{ m: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteLegendItem(item.id)}
                      disabled={legendItems.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addLegendItem}
          sx={{ mb: 1 }}
        >
          追加 (Add)
        </Button>
      </Paper>
    </div>
  );
}
