import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles, Container } from '@material-ui/core';
import { OfflineBolt } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.3em'
  },
  responsiveText: {
    fontSize: 'calc(14px + 6 * ((100vw - 320px) / 880))',
    [theme.breakpoints.up('md')]: {
      fontSize: '18px'
    }
  }
}));

export default function Header() {
  const classes = useStyles({});

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Typography variant="h6" className={classes.title + ' ' + classes.flex + ' ' + classes.responsiveText}>
            <OfflineBolt className={classes.icon} /> LTNG URL
          </Typography>
          <Button color="inherit" className={classes.responsiveText}>
            Login
          </Button>
          <Button color="inherit" className={classes.responsiveText}>
            Sign Up
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
