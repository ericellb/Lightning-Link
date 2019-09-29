import React from 'react';
import { Grid, makeStyles, Container, Typography, Avatar } from '@material-ui/core';
import { InsertLink } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    marginTop: '0em'
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
    fontSize: 'calc(36px + 6 * ((100vw - 320px) / 480))',
    fontWeight: 900,
    color: '#252628'
  },
  subtitle: {
    fontSize: 'calc(20px + 6 * ((100vw - 320px) / 480))',
    fontWeight: 400,
    color: '#56575b'
  },
  linkImage: {
    height: '30vh',
    width: '30vh',
    transform: 'rotate(135deg)',
    color: '#1b3987',
    [theme.breakpoints.up('sm')]: {
      height: '40vh',
      width: '40vh'
    }
  },
  gridItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
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

export default function Hero() {
  const classes = useStyles({});

  return (
    <Container>
      <Grid container className={classes.gridContainer}>
        <Grid item md={8} xs={12} className={classes.gridTitle + ' ' + classes.item1 + ' ' + classes.gridItem}>
          <div className={classes.flex}>
            <Typography variant="h3" className={classes.inlineText + ' ' + classes.title}>
              Lightning Fast Short URLs
            </Typography>
            <Typography variant="h4" className={classes.inlineText + ' ' + classes.subtitle}>
              Create, share and view analytics on Short URLs
            </Typography>
          </div>
        </Grid>
        <Grid item md={4} xs={12} className={classes.item2 + ' ' + classes.gridItem}>
          <InsertLink className={classes.linkImage}></InsertLink>
        </Grid>
      </Grid>
    </Container>
  );
}
