import React, { useState } from 'react';
import { makeStyles, Container, TextField, Grid, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: '#0b1736',
    padding: '2em',
    boxSizing: 'border-box'
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    height: '100%'
  },
  textField: {
    width: '100%',
    background: 'white',
    borderRadius: '8px'
  },
  textFieldInput: {
    color: 'black'
  },
  textFieldLabel: {
    color: 'black'
  },
  notchedOutline: {
    borderRadius: '6px',
    borderColor: '#1b3987 !important'
  },
  textFieldFocus: {
    borderRadius: '6px',
    boxShadow: '0px 0px 4px #fff'
  },
  shortenButton: {
    backgroundColor: '#1b3987',
    color: 'white',
    width: '100%',
    height: '56px'
  },
  item1: {
    order: 2,
    marginBottom: '2em',
    [theme.breakpoints.up('md')]: {
      marginBottom: '0em',
      order: 1
    }
  },
  item2: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 2
    }
  }
}));

export default function Shortener() {
  const classes = useStyles({});
  const [destURL, setDestURL] = useState('');

  return (
    <div className={classes.container}>
      <Container className={classes.flex}>
        <Grid container className={classes.flex} spacing={2}>
          <Grid item md={9} xs={12} className={classes.item2}>
            <TextField
              id="filled-name"
              placeholder="Shorten your link"
              autoComplete="off"
              className={classes.textField}
              value={destURL}
              onChange={e => setDestURL(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                className: classes.textFieldLabel
              }}
              InputProps={{
                classes: {
                  input: classes.textFieldInput,
                  notchedOutline: classes.notchedOutline,
                  focused: classes.textFieldFocus
                }
              }}
            />
          </Grid>
          <Grid item md={3} xs={12} className={classes.item2}>
            <Button variant="contained" className={classes.shortenButton}>
              {' '}
              Shorten{' '}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
