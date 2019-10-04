import React, { useState, useEffect } from 'react';
import { Modal, List, ListItem, makeStyles, Divider, Typography } from '@material-ui/core';
import axios from '../AxiosClient';
import { StoreState } from '../../reducers';
import { useSelector } from 'react-redux';
import { Timeline } from '@material-ui/icons';
import { AnalyticData } from './types';
import AnalyticChart from './AnalyticChart';

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
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  },
  listContainer: {
    width: '100%'
  },
  listItem: {
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '12px'
  },
  itemListSlugContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemListSlug: {
    marginRight: '8px'
  },
  itemListSlugIcon: {
    height: '32px',
    width: '32px',
    cursor: 'pointer'
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
  const getAnalyticData = async (slug: string) => {
    try {
      let endpointURL = `/analytic/${slug}?userId=${user.userId}`;
      let res = await axios.get(endpointURL, { withCredentials: true });
      if (res.status === 200) {
        let analyticDataRes: AnalyticData = res.data;
        setShowChart(true);
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
        <Typography variant="h5">View Analytics</Typography>
        {showChart && analyticData ? (
          <AnalyticChart analyticData={analyticData} />
        ) : (
          <List className={classes.listContainer}>
            {urls.map((url, i) => {
              return (
                <React.Fragment key={i}>
                  <ListItem className={classes.listItem} button onClick={() => getAnalyticData(url.slug)}>
                    <div>{url.destination}</div>
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
        )}
      </div>
    </Modal>
  );
}
