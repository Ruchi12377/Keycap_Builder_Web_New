import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImportFromUrlDialog from './Layout/ImportFromUrlDialog';
import { StarOutline } from '@mui/icons-material';

const toolbarHeight = 64; // TODO Will this work everywhere?

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showImportDialog, setShowImportDialog] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
    switch (e.target.id) {
      case 'import_from_url':
        setShowImportDialog(true);
        break;
    }
  };

  return (
    <Box component="div" sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {showImportDialog && (
            <ImportFromUrlDialog
              onClose={() => {
                setShowImportDialog(false);
              }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AutoAwesomeIcon/>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                textDecoration: 'none',
                boxShadow: 'none',
                color: 'white',
              }}
              href="__WEBSITE_URL"
            >
              KeyCap Builder Web
            </Typography>
          </Box>
          <Box component="div" sx={{ flexGrow: 1 }}></Box>

          <Tooltip title="Report an issue">
            <IconButton
              component="a"
              href={'__GITHUB_ISSUE_URL'}
              target="_blank"
            >
              <BugReportIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go to GitHub repository">
            <IconButton
              component="a"
              href={'__GITHUB_REPO_URL'}
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, pt: 0 }}>
        <Toolbar />
        <Box
          component="div"
          sx={{
            width: `100vw`,
            height: `calc(100vh - ${toolbarHeight}px)`,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
