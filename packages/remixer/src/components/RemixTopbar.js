import React, { useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import RedoIcon from '@mui/icons-material/Redo';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import UndoIcon from '@mui/icons-material/Undo';
import { styled } from '@mui/material/styles';

import { RecursiveMenuItem, ShareDialog } from '.';
import { HideSourceIcon, ShareIcon, ShowSourceIcon } from '../icons';

const Root = styled('div')(({ theme }) => {
  return {
    [`& .RemixTitleField`]: {
      borderWidth: '15px',
      [`& .MuiOutlinedInput-notchedOutline`]: {
        borderColor: 'transparent',
      },
    },
    [`& .RemixTitle`]: {
      textAlign: 'center',
      borderWidth: '15px',
    },
  };
});

export const RemixTopbar = props => {
  const { editable, showSource, setShowSource, remix } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [share, setShare] = React.useState(false);
  const [titleFocus, setTitleFocus] = React.useState(false);

  const open = Boolean(anchorEl);
  const onMoreOpen = e => setAnchorEl(e.currentTarget);
  const onMoreClose = () => setAnchorEl(null);
  const onShareOpen = () => setShare(true);
  const onShareClose = () => setShare(false);

  const onTitleFocus = e => {
    setTitleFocus(true);
  };
  const onTitleBlur = e => {
    setTitleFocus(false);
    console.log(e.target.value);
  };

  return (
    <Root>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          {!editable && (
            <Tooltip title={`${!showSource ? 'Show' : 'Hide'} source panel`}>
              <IconButton onClick={() => setShowSource(prevState => !prevState)}>
                {!showSource ? <ShowSourceIcon fontSize="small" /> : <HideSourceIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          {editable && (
            <>
              <Tooltip title="Undo">
                <IconButton size="small">
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton size="small">
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div className="topbarCore">
          <TextField
            fullWidth
            placeholder="Give your remix a title…"
            required
            size="small"
            disabled={!editable}
            type="text"
            value={remix.title}
            InputProps={{
              className: 'RemixTitleField',
            }}
            inputProps={{
              className: 'RemixTitle',
              minLength: 1,
              onBlur: onTitleBlur,
              onFocus: onTitleFocus,
            }}
          />
        </div>
        <div className="topbarSide topbarSide--right">
          {editable && (
            <>
              <Tooltip title="More remix options…">
                <IconButton size="small" onClick={onMoreOpen}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Popper
                anchorEl={anchorEl}
                onClick={onMoreClose}
                onClose={onMoreClose}
                open={open}
                placement="bottom-end"
              >
                <Grow in={open} appear={open}>
                  <Paper elevation={12}>
                    <ClickAwayListener onClickAway={onMoreClose}>
                      <MenuList dense={true}>
                        <RecursiveMenuItem
                          autoFocus={false}
                          label={
                            <>
                              <ListItemIcon>
                                <IosShareIcon fontSize="small" color="primary" />
                              </ListItemIcon>
                              <ListItemText primary="Export" primaryTypographyProps={{ color: 'primary' }} />
                              <ArrowRightIcon fontSize="small" />
                            </>
                          }
                          placement="left-start"
                          elevation={0}
                          MenuListProps={{ dense: true }}
                        >
                          <MenuItem onClick={() => console.log('Text')}>
                            <ListItemText primary="Text" primaryTypographyProps={{ color: 'primary' }} />
                          </MenuItem>
                          <MenuItem onClick={() => console.log('JSON')}>
                            <ListItemText primary="JSON" primaryTypographyProps={{ color: 'primary' }} />
                          </MenuItem>
                          <MenuItem onClick={() => console.log('WP Plugin-compatible HTML')}>
                            <ListItemText
                              primary="WP Plugin-compatible HTML"
                              primaryTypographyProps={{ color: 'primary' }}
                            />
                          </MenuItem>
                          <MenuItem onClick={() => console.log('Interactive transcript')}>
                            <ListItemText
                              primary="Interactive Transcript"
                              primaryTypographyProps={{ color: 'primary' }}
                            />
                          </MenuItem>
                        </RecursiveMenuItem>
                        <MenuItem>
                          <ListItemIcon>
                            <LockIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Make private" primaryTypographyProps={{ color: 'primary' }} />
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                          <ListItemIcon>
                            <DeleteSweepIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText primary="Clear" primaryTypographyProps={{ color: 'error' }} />
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              </Popper>
            </>
          )}
          <Tooltip title="Share remix">
            <IconButton onClick={onShareOpen} size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div className="topbarPush" />
      <ShareDialog isOpen={share} onClose={onShareClose} />
    </Root>
  );
};
