import React, { useState } from 'react';
import { Modal, makeStyles, TextField, Typography, Button, Fade } from '@material-ui/core';
import axios from '../AxiosClient';
import { useDispatch } from 'react-redux';
import { signIn } from '../../actions';

const useStyles = makeStyles(theme => ({
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
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
  },
  title: {
    color: '#1b3987'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    flexBasis: '100%',
    color: 'black'
  },
  textFieldInput: {
    color: 'black'
  },
  textFieldLabel: {
    color: '#1b3987'
  },
  notchedOutline: {
    borderRadius: '6px',
    borderColor: '#1b3987'
  },
  textFieldFocus: {
    borderRadius: '6px',
    boxShadow: '0px 0px 4px #fff'
  },
  authButton: {
    backgroundColor: '#1b3987',
    color: 'white',
    marginTop: '16px',
    width: 'calc(100% - 16px)',
    height: '56px'
  },
  changeAuthType: {
    marginTop: '16px',
    fontSize: '10px',
    cursor: 'pointer'
  },
  messageContainer: {
    background: 'red',
    borderRadius: '8px',
    padding: '1em',
    boxSizing: 'border-box',
    height: '56px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: '14px',
    width: 'calc(100% - 16px)'
  },
  error: {
    color: '#731b14',
    backgroundColor: '#fa9b93'
  },
  success: {
    backgroundColor: '#28a745',
    color: '#fefefe'
  }
}));

type AuthModalProps = {
  onModalClose: (state: boolean) => void;
  open: boolean;
};

export default function AuthModal(props: AuthModalProps) {
  const classes = useStyles({});
  const [open, setOpen] = useState(props.open);
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');
  const [authType, setAuthType] = useState('Sign In');
  const [textError, setTextError] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [textFadeShow, setTextFadeShow] = useState(false);
  const dispatch = useDispatch();

  // Switches between Sign in / Create Account
  const changeAuthType = (authType: string) => {
    if (authType === 'Sign In') {
      setAuthType('Create Account');
    } else {
      setAuthType('Sign In');
    }
  };

  // Signs in or Creates account depening on authType
  const submitAuth = async (userName: string, userPass: string) => {
    let res = null;
    let encodedURI = 'userName=' + encodeURIComponent(userName) + '&userPass=' + encodeURIComponent(userPass);
    let endpointURL = `/user/login?${encodedURI}`;
    let axiosMethod = axios.get;

    // If creating account, change endpoint and method
    if (authType === 'Create Account') {
      endpointURL = `/user/create?${encodedURI}`;
      axiosMethod = axios.post;
    }

    // Create or login depending on authType
    try {
      res = await axiosMethod(endpointURL);
      if (res.status === 200) {
        dispatch(signIn(res.data));
        setTextError(false);
        showMessage('Success : Logging in...');
        setTimeout(() => handleModalClose(false), 1300);
      }
    } catch (err) {
      setTextError(true);
      showMessage(err.response.data);
    }
  };

  // Handles error messages
  const showMessage = (message: string) => {
    setTextMessage(message);
    setTextFadeShow(true);
    setTimeout(() => setTextFadeShow(false), 2775);
    setTimeout(() => setTextMessage(''), 3000);
  };

  // Handles closing modal
  const handleModalClose = (state: boolean) => {
    console.log('trying to close..');
    props.onModalClose(state);
    setOpen(state);
  };

  return (
    <Modal
      aria-labelledby="authentication-modal"
      aria-describedby="login or create account window"
      open={open}
      onClose={() => handleModalClose(false)}
      className={classes.modalContainer}
    >
      <div className={classes.authContainer}>
        <Typography variant="h5" className={classes.title}>
          {authType}
        </Typography>
        <TextField
          variant="outlined"
          id="user-name"
          label="Username"
          title="Username"
          placeholder="Username"
          className={classes.textField}
          value={userName}
          onChange={e => setUserName(e.target.value)}
          margin="normal"
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
        <TextField
          variant="outlined"
          id="user-pass"
          label="Password"
          type="password"
          title="Password"
          placeholder="Password"
          className={classes.textField}
          value={userPass}
          onChange={e => setUserPass(e.target.value)}
          margin="normal"
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
        {textMessage !== '' && (
          <Fade in={textFadeShow}>
            <div className={classes.messageContainer + ' ' + (textError ? classes.error : classes.success)}>
              {textMessage}
            </div>
          </Fade>
        )}
        <Button
          className={classes.authButton}
          title={authType}
          variant="contained"
          color="primary"
          onClick={() => submitAuth(userName, userPass)}
        >
          {authType}
        </Button>
        <div className={classes.changeAuthType} onClick={() => changeAuthType(authType)}>
          Click to {authType === 'Sign In' ? 'Create Account' : 'Sign In'}
        </div>
      </div>
    </Modal>
  );
}
