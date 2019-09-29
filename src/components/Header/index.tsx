import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles, Container } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function Header() {
  const classes = useStyles({});

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            ez URL
          </Typography>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Sign Up</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
