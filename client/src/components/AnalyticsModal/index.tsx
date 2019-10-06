import React, { useState, useEffect } from 'react';
import { Modal, List, ListItem, makeStyles, Divider, Typography } from '@material-ui/core';
import axios from '../AxiosClient';
import { StoreState } from '../../reducers';
import { useSelector } from 'react-redux';
import { Timeline } from '@material-ui/icons';
import { AnalyticData } from './types';
import AnalyticChart from './AnalyticChart';
import AnalyticList from './AnalyticList';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/#' : 'https://ltng.link/#';

const useStyles = makeStyles(theme => ({
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  analyticsContainer: {
    backgroundColor: '#fefefe',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '1em',
    boxSizing: 'border-box',
    borderRadius: '8px',
    outline: 'none',
    boxShadow: '0px 0px 8px 1px rgba(0,0,0,0.75)',
    width: '860px',
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  },
  analyticDataContainer: {},
  analyticsTitle: {
    flexBasis: '100%',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '24px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px'
    }
  },
  listContainer: {
    width: '100%'
  },
  listItem: {
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '12px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  itemListSlugContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  itemListSlug: {
    marginRight: '8px',
    paddingBottom: '8px',
    boxSizing: 'border-box'
  },
  itemListSlugIcon: {
    height: '32px',
    width: '32px',
    cursor: 'pointer',
    paddingBottom: '8px'
  },
  itemListDestContainer: {
    paddingBottom: '8px',
    paddingTop: '8px',
    boxSizing: 'border-box'
  },
  listItemDivider: {
    backgroundColor: 'grey'
  }
}));

type AnalyticsModalProps = {
  onModalClose: (state: boolean) => void;
  open: boolean;
};

interface SlugsData {
  slug: string;
  destination: string;
}

export default function AnalyticsModal(props: AnalyticsModalProps) {
  const [open, setOpen] = useState(props.open);
  const [urls, setUrls] = useState<SlugsData[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [analyticData, setAnalyticData] = useState<AnalyticData>();
  const [slug, setSlug] = useState('');
  const [dest, setDest] = useState('');
  const classes = useStyles({});
  const user = useSelector((state: StoreState) => state.user);

  // Handles closing modal
  const handleModalClose = (state: boolean) => {
    props.onModalClose(state);
    setOpen(state);
  };

  // Gets all of the URL this user is the Creator of
  useEffect(() => {
    const getCreatorSlugs = async () => {
      try {
        let endpointURL = `/analytic/all?userId=${user.userId}`;
        let res = await axios.get(endpointURL, { withCredentials: true });
        if (res.status === 200) {
          setUrls(res.data);
        }
      } catch (err) {}
    };

    // If user signed in, get all slugs he owns
    if (user.isSignedIn && user.userId) {
      getCreatorSlugs();
    } else {
      handleModalClose(false);
    }
  }, []);

  // Gets analytic data for a specific slug (short url)
  const getAnalyticData = async (slug: string, destination: string) => {
    try {
      let endpointURL = `/analytic/${slug}?userId=${user.userId}`;
      let res = await axios.get(endpointURL, { withCredentials: true });
      if (res.status === 200) {
        let analyticDataRes: AnalyticData = res.data;
        setShowChart(true);
        setSlug(slug);
        setDest(destination);
        setAnalyticData(analyticDataRes);
      }
    } catch (err) {}
  };

  return (
    <Modal
      aria-labelledby="authentication-modal"
      aria-describedby="login or create account window"
      open={open}
      onClose={() => handleModalClose(false)}
      className={classes.modalContainer}
    >
      <div className={classes.analyticsContainer}>
        {showChart && analyticData ? (
          <React.Fragment>
            <div className={classes.analyticsTitle}>
              <div>{dest + ' '}</div>
              <div>{baseUrl + '/' + slug}</div>
            </div>
            <AnalyticChart chartData={analyticData.dates} />
            <AnalyticList listData={analyticData.location} slug={slug} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="h5">View Analytics</Typography>
            <List className={classes.listContainer}>
              {urls.map((url, i) => {
                return (
                  <React.Fragment key={i}>
                    <ListItem
                      className={classes.listItem}
                      button
                      onClick={() => getAnalyticData(url.slug, url.destination)}
                    >
                      <div className={classes.itemListDestContainer}>{url.destination}</div>
                      <div className={classes.itemListSlugContainer}>
                        <div className={classes.itemListSlug}>{baseUrl + '/' + url.slug}</div>
                        <Timeline className={classes.itemListSlugIcon} />
                      </div>
                    </ListItem>
                    {i < urls.length - 1 && <Divider className={classes.listItemDivider} />}
                  </React.Fragment>
                );
              })}
            </List>
          </React.Fragment>
        )}
      </div>
    </Modal>
  );
}
