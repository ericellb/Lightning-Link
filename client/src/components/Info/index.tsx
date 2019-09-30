import React from 'react';
import { makeStyles, Container, Grid, Typography } from '@material-ui/core';
import { Language, TrackChanges, OfflineBoltOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
    justifyContent: 'center'
  },
  centerText: {
    textAlign: 'center',
    minHeight: '350px'
  },
  gridCard: {
    paddingTop: '2em',
    paddingBottom: '2em',
    padding: '1em',
    maxWidth: '80%'
  },
  icon: {
    height: '80px',
    width: '80px',
    color: '#1b3987'
  },
  title: {
    fontWeight: 900,
    color: '#252628'
  },
  subtitle: {
    marginTop: '1em',
    fontWeight: 500,
    color: '#56575b'
  },
  linkIcon: {
    transform: 'rotate(135deg)'
  },
  iconBolt: {
    transform: 'rotate(0deg)'
  }
}));

export default function Info() {
  const classes = useStyles({});
  return (
    <Container className={classes.centerText}>
      <Grid container className={classes.flex}>
        <Grid item md={4} xs={12} className={classes.gridCard}>
          <OfflineBoltOutlined className={classes.icon + ' ' + classes.iconBolt}></OfflineBoltOutlined>
          <Typography variant="h4" className={classes.title}>
            Lightning Fast
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Lightning URL was build from the ground to provide super fast, collision free URL generation. We leverage
            technology to provide Lighting fast redirection.
          </Typography>
        </Grid>
        <Grid item md={4} xs={12} className={classes.gridCard}>
          <Language className={classes.icon}></Language>
          <Typography variant="h4" className={classes.title}>
            Build relations
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Create, and share persistent links with your audience. Lightning URLs are fast and most importantly short.
            They allow you to better engage with your audience.
          </Typography>
        </Grid>
        <Grid item md={4} xs={12} className={classes.gridCard}>
          <TrackChanges className={classes.icon}></TrackChanges>
          <Typography variant="h4" className={classes.title}>
            View Analytics
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            Monitor and view traffic analytics you are driving to your Lightning URLs. Easily be able to view
            Geographical data on your users and number of visits.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
