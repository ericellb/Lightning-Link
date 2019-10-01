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

export default function App() {
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
    }, []);
    return <React.Fragment></React.Fragment>;
  };

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Route path="/" exact>
          <Header />
          <Hero />
          <Shortener />
          <Info />
          <Footer />
        </Route>
        <Route path="/:slug" component={Redirect} />
      </HashRouter>
    </ThemeProvider>
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
