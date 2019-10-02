import React from 'react';
import { Grid, makeStyles, Container, Typography } from '@material-ui/core';
import { ReactComponent as LinkIcon } from './link.svg';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    marginTop: '0em',
    padding: '2em'
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
    fontSize: 'calc(28px + 6 * ((100vw - 320px) / 480))',
    fontWeight: 900,
    color: '#252628',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: 'calc(18px + 6 * ((100vw - 320px) / 680))',
    fontWeight: 400,
    color: '#56575b'
  },
  linkImage: {
    height: 'calc(27vh + 4 * ((100vw - 520px) / 200))',
    width: 'calc(27vh + 4 * ((100vw - 520px) / 200))',
    fill: '#0b1736'
  },
  gridItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  item1: {
    order: 2,
    marginTop: '2em',
    [theme.breakpoints.up('md')]: {
      marginTop: '0em',
      order: 1
    }
  },
  item2: {
    overflow: 'hidden',
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
              Lightning Fast Short Links
            </Typography>
            <Typography variant="h4" className={classes.inlineText + ' ' + classes.subtitle}>
              Create, share, and view analytics of your Lightning Link. Get one for Free today.
            </Typography>
          </div>
        </Grid>
        <Grid item md={4} xs={12} className={classes.item2 + ' ' + classes.gridItem}>
          <LinkIcon className={classes.linkImage} />
        </Grid>
      </Grid>
    </Container>
  );
}
