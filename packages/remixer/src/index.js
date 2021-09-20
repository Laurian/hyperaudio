import React from 'react';

import { styled, ThemeProvider } from '@mui/material/styles';

import Remix from './Remix';
import Source from './Source';
import { defaultTheme } from './themes';

const Layout = styled('div', {
  shouldForwardProp: prop => prop !== 'showSource',
})(({ theme, showSource }) => ({
  alignContent: 'flex-start',
  alignItems: 'stretch',
  display: 'flex',
  flexFlow: 'row nowrap',
  height: '100%',
  justifyContent: 'space-between',
  [`& .RemixerPane`]: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    display: 'flex',
    flex: '0 0 50%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    maxWidth: '50%',
    position: 'relative',
    [`&.RemixerPane--Source`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    [`&.RemixerPane--Remix`]: {
      flexBasis: showSource ? '50%' : '100%',
      maxWidth: showSource ? '50%' : 'none',
      [theme.breakpoints.down('md')]: {
        flexBasis: '100%',
        maxWidth: 'none',
      },
    },
  },
  [`& .topbar`]: {
    alignItems: 'center',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'flex-start',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: theme.zIndex.appBar,
  },
  [`& .topbarSide`]: {
    flexGrow: 0,
    flexShrink: 0,
  },
  [`& .topbarCore`]: {
    flexBasis: '100%',
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
    overflowX: 'auto',
    textAlign: 'center',
  },
  [`& .topbarSide--left`]: {
    textAlign: 'left',
  },
  [`& .topbarSide--right`]: {
    textAlign: 'right',
  },
  [`& .topbarPush`]: {
    ...theme.mixins.toolbar,
  },
}));

export const Remixer = props => {
  const [showSource, setShowSource] = React.useState(true);
  const [source, setSource] = React.useState(props.sources[0].id);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Layout showSource={showSource}>
        {showSource && <Source {...props} source={source} setSource={setSource} />}
        <Remix {...props} showSource={showSource} setShowSource={setShowSource} setSource={setSource} />
      </Layout>
    </ThemeProvider>
  );
};

Remixer.defaultProps = {
  editable: false,
};
