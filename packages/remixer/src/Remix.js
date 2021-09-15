import React from 'react';

import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import UndoIcon from '@mui/icons-material/Undo';
import { styled } from '@mui/material/styles';

import { HideSourceIcon, ShareIcon, ShowSourceIcon } from './icons';

import { Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
    [`& .topbarSide`]: {
      flexBasis: theme.spacing(10),
      [theme.breakpoints.up('sm')]: {
        flexBasis: theme.spacing(10),
      },
      [`&.topbarSide--right > *`]: {
        marginLeft: theme.spacing(1),
      },
      [`&.topbarSide--left > *`]: {
        marginRight: theme.spacing(1),
      },
    },
  };
});

export default function Remix({ editable, showSource, setShowSource, remix }) {
  return (
    <Root className="RemixerPane RemixerPane--Remix">
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
              <Tooltip title="Undo">
                <IconButton size="small">
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div className="topbarCore">Title</div>
        <div className="topbarSide topbarSide--right">
          {editable && (
            <Tooltip title="More remix options…">
              <IconButton size="small">
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Share remix">
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div className="topbarPush" />
      <Theatre media={remix.media} />
      <Transcript transcript={remix.transcript} />
    </Root>
  );
}
