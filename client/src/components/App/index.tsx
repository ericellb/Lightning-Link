import React, { useEffect } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Header from '../Header';
import Hero from '../Hero';
import Shortener from '../Shortener';
import Footer from '../Footer';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './style.css';
import Info from '../Info';
import axios from '../AxiosClient';
import createHashHistory from '../../history';
import { useDispatch } from 'react-redux';
import { signIn } from '../../actions';

export default function App() {
  const dispatch = useDispatch();

  // Function to redirect user to their Short URL
  const Redirect = ({ match }: any) => {
    useEffect(() => {
      const getRedirectUrl = async (slug: any) => {
        let res = null;
        try {
          res = await axios.get('/' + slug);
          if (res.status === 200) {
            window.location.replace(res.data);
          }
        } catch (err) {
          if (err.response.status === 404) {
            createHashHistory.push('/');
          }
        }
      };

      getRedirectUrl(match.params.slug);
    }, [match.params.slug]);
    return <React.Fragment></React.Fragment>;
  };

  // Component on mount do once
  // Will check if remember me set, and auths user
  useEffect(() => {
    // Attempts to login using user_id + cookie access token
    // If remember me set in local storage
    const LoginIfRememberMe = async () => {
      let rememberMe = localStorage.getItem('rememberMe');
      let userId = localStorage.getItem('userId');
      let userName = localStorage.getItem('userName');
      if (rememberMe === 'true' && userId && userName) {
        let res = null;
        // Attempt to login with cookies
        try {
          res = await axios.get(`/user/authed?userId=${userId}`, { withCredentials: true });
          console.log(res);
          if (res.status === 200 && res.data === true) {
            dispatch(signIn({ userName: userName, userId: userId }));
          }
        } catch (err) {
          console.log('err');
        }
      }
    };

    LoginIfRememberMe();
  }, [dispatch]);

  return (
    <HashRouter>
      <Route path="/" exact>
        <ThemeProvider theme={theme}>
          <Header />
          <Hero />
          <Shortener />
          <Info />
          <Footer />
        </ThemeProvider>
      </Route>
      <Route path="/:slug" component={Redirect} />
    </HashRouter>
  );
}

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        backgroundColor: 'black'
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: '#2a5bd7',
        color: 'white',
        fontFamily: 'Roboto'
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#2b2e4a'
      }
    }
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#7289da'
    },
    secondary: {
      main: '#3ca374'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600
  }
});
