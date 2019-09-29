import React, { useState } from 'react';
import { makeStyles, Container, TextField, Grid, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: '#0b1736',
    height: '30vh'
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    height: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
    height: '56px',
    marginTop: '8px'
  }
}));

export default function Shortener() {
  const classes = useStyles({});
  const [destURL, setDestURL] = useState('');

  return (
    <div className={classes.container}>
      <Container className={classes.flex}>
        <Grid container className={classes.flex} spacing={4}>
          <Grid item xs={9}>
            <TextField
              id="filled-name"
              placeholder="Your URL"
              autoComplete="off"
              className={classes.textField}
              value={destURL}
              onChange={e => setDestURL(e.target.value)}
              margin="normal"
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
          <Grid item xs={3}>
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
