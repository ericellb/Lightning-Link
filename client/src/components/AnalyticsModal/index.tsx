import React, { useState } from 'react';
import { Modal, makeStyles } from '@material-ui/core';
import axios from '../AxiosClient';

const useStyles = makeStyles(theme => ({
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  analyticsContainer: {
    width: '340px',
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
  }
}));

type AnalyticsModalProps = {
  onModalClose: (state: boolean) => void;
  open: boolean;
};

export default function AnalyticsModal(props: AnalyticsModalProps) {
  const [open, setOpen] = useState(props.open);
  const classes = useStyles({});

  // Handles closing modal
  const handleModalClose = (state: boolean) => {
    props.onModalClose(state);
    setOpen(state);
  };

  // Gets all of the URL this user is the Creator of
  useEffect(() => {
    try {
      axios.get('/analytic');
    } catch (err) {}
  }, []);

  return (
    <Modal
      aria-labelledby="authentication-modal"
      aria-describedby="login or create account window"
      open={open}
      onClose={() => handleModalClose(false)}
      className={classes.modalContainer}
    >
      <div className={classes.analyticsContainer}>Some Analytics</div>
    </Modal>
  );
}
