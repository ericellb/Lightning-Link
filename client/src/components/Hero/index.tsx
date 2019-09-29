import React from 'react';
import { Grid, makeStyles, Container, Typography, Avatar } from '@material-ui/core';
import { InsertLink } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    marginTop: '4em'
  },
  flex: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  gridTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  inlineText: {
    display: 'inline'
  },
  title: {
    fontWeight: 900,
    color: '#252628'
  },
  subtitle: {
    fontWeight: 400,
    color: '#56575b'
  },
  linkImage: {
    height: '550px',
    width: '550px',
    transform: 'rotate(135deg)',
    color: '#00adb5'
  }
}));

export default function Hero() {
  const classes = useStyles({});

  return (
    <Container>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={8} className={classes.gridTitle}>
          <div className={classes.flex}>
            <Typography variant="h3" className={classes.inlineText + ' ' + classes.title}>
              Lightning Fast Short URLs
            </Typography>
            <Typography variant="h4" className={classes.inlineText + ' ' + classes.subtitle}>
              Create, share and view analytics on Short URLs
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <InsertLink className={classes.linkImage}></InsertLink>
        </Grid>
      </Grid>
    </Container>
  );
}
