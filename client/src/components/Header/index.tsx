import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles, Container } from '@material-ui/core';
import { OfflineBolt } from '@material-ui/icons';
import AuthModal, { AuthType } from '../AuthModal';
import { StoreState } from '../../reducers';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.3em'
  },
  responsiveText: {
    fontSize: '14px'
  }
}));

export default function Header() {
  const classes = useStyles({});
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<AuthType>('Sign In');
  const dispatch = useDispatch();
  const user = useSelector((state: StoreState) => state.user);

  // Handles openning auth modal
  const handleModalOpen = (authType: AuthType) => {
    setShowAuth(true);
    setAuthType(authType);
  };

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Typography variant="h6" className={classes.title + ' ' + classes.flex + ' ' + classes.responsiveText}>
            <OfflineBolt className={classes.icon} /> LTNG
          </Typography>
          {/* Show if Signed In */}
          {user.isSignedIn && (
            <React.Fragment>
              <Button
                color="inherit"
                title="Analytics"
                className={classes.responsiveText}
                onClick={() => setShowAuth(true)}
              >
                Analytics
              </Button>
              <Button
                color="inherit"
                title="Logout"
                className={classes.responsiveText}
                onClick={() => dispatch(signOut())}
              >
                Logout
              </Button>
            </React.Fragment>
          )}
          {/* Show if Not Signed In */}
          {!user.isSignedIn && (
            <React.Fragment>
              <Button
                color="inherit"
                title="Login"
                className={classes.responsiveText}
                onClick={() => handleModalOpen('Sign In')}
              >
                Login
              </Button>
              <Button
                color="inherit"
                title="Sign Up"
                className={classes.responsiveText}
                onClick={() => handleModalOpen('Create Account')}
              >
                Sign Up
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </Container>
      {showAuth && <AuthModal onModalClose={setShowAuth} open={showAuth} authType={authType} />}
    </AppBar>
  );
}
