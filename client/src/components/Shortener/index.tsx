import React, { useState } from 'react';
import { makeStyles, Container, TextField, Grid, Button, List, ListItem, Fade } from '@material-ui/core';
import axios from '../AxiosClient';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/#' : 'http://ltng.link/#';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: '#0b1736',
    padding: '3em',
    boxSizing: 'border-box'
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    height: '100%'
  },
  textField: {
    width: '100%',
    background: '#fefefe',
    borderRadius: '8px'
  },
  textFieldInput: {
    color: 'black'
  },
  textFieldLabel: {
    color: 'black'
  },
  notchedOutline: {
    borderRadius: '6px',
    borderColor: '#1b3987'
  },
  textFieldFocus: {
    borderRadius: '6px',
    boxShadow: '0px 0px 4px #fff'
  },
  shortenButton: {
    backgroundColor: '#1b3987',
    color: 'white',
    width: '100%',
    height: '56px'
  },
  item1: {
    order: 1,
    [theme.breakpoints.up('md')]: {
      order: 1
    }
  },
  item2: {
    order: 2,
    marginBottom: '1em',
    [theme.breakpoints.up('md')]: {
      order: 2,
      marginBottom: '0em'
    }
  },
  urlList: {
    order: 3,
    width: '100%',
    maxWidth: '1240px',
    backgroundColor: '#FEFEFE',
    color: 'black',
    fontSize: '16px',
    margin: '12px',
    padding: '0px',
    fontWeight: 300,
    '& li:not(:last-child):after': {
      width: 'calc(100% - 24px)',
      content: '""',
      border: '0.5px solid #b6b6b6',
      position: 'absolute',
      bottom: '0px',
      left: '12px'
    },
    '&:first-of-type': {
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px'
    },
    '&:last-child': {
      borderBottomLeftRadius: '6px',
      borderBottomRightRadius: '6px',
      content: 'none'
    }
  },
  listItem: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  urlListSlug: {
    color: '#2a5bd7',
    '& a': {
      textDecoration: 'none',
      color: '#0236b9',
      fontWeight: 400
    }
  },
  urlListDestination: {
    color: 'black'
  },
  copyButton: {
    marginLeft: '1em',
    backgroundColor: '#edf2fe',
    color: '#2a5bd7',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#cacfd9'
    },
    maxHeight: '83px',
    height: '36px',
    maxWidth: '71px'
  },
  copySuccess: {
    content: 'Copied !important',
    backgroundColor: '#649949 !important',
    color: '#fefefe'
  },
  errorGrid: {
    order: 3
  },
  errorContainer: {
    background: 'red',
    borderRadius: '8px',
    padding: '1em',
    boxSizing: 'border-box',
    height: '56px',
    backgroundColor: '#fa9b93',
    color: '#731b14',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto'
  }
}));

interface UrlList {
  slug: string;
  destination: string;
}

export default function Shortener() {
  const classes = useStyles({});
  const [destURL, setDestURL] = useState('');
  const [textErrorMsg, setTextErrorMsg] = useState('');
  const [fadeError, setFadeError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [createdURLS, setCreatedURLS] = useState<UrlList[]>([]);
  const [buttonIndex, setButtonIndex] = useState(0);

  // Handles onclick button
  const handleButtonClick = (buttonIndex: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setButtonIndex(buttonIndex);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  // Handles error messages
  const showErrorMessage = (errorMessage: string) => {
    setTextErrorMsg(errorMessage);
    setFadeError(true);
    setTimeout(() => setFadeError(false), 2775);
    setTimeout(() => setTextErrorMsg(''), 3000);
  };

  // Submits URL to API
  const postURL = async (destURL: string) => {
    destURL = encodeURIComponent(destURL);
    let res = await axios.post(`/shorten?destination=${destURL}`);
    return res;
  };

  // Returns true or false if valid URL
  const validInput = (destURL: string) => {
    // eslint-disable-next-line
    let urlValidator = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
    if (urlValidator.test(destURL)) {
      return true;
    } else return false;
  };

  // Handles submission of URL to Shorten
  const submitURL = async (destURL: string) => {
    if (validInput(destURL)) {
      let res = await postURL(destURL);
      if (res.status === 200) {
        // Show new URL under TextField, and empty it
        setCreatedURLS([...createdURLS, { slug: res.data, destination: destURL }]);
        setDestURL('');
      } else {
        showErrorMessage(`Server Error : ${res.status}. Hang in tight, were working on it!`);
      }
    } else {
      showErrorMessage(`Unable to create Lightning Link, not a valid URL`);
    }
  };

  return (
    <div className={classes.container}>
      <Container className={classes.flex}>
        <Grid container className={classes.flex} spacing={3}>
          <Grid item md={9} xs={12} className={classes.item1}>
            <TextField
              id="filled-name"
              placeholder="Shorten your link"
              autoComplete="off"
              className={classes.textField}
              value={destURL}
              onChange={e => setDestURL(e.target.value)}
              variant="outlined"
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
          </Grid>
          <Grid item md={3} xs={12} className={classes.item2}>
            <Button
              variant="contained"
              color="primary"
              className={classes.shortenButton}
              onClick={() => submitURL(destURL)}
            >
              Shorten
            </Button>
          </Grid>

          {textErrorMsg !== '' && (
            <Grid item xs={12} className={classes.errorGrid}>
              <Fade in={fadeError}>
                <div className={classes.errorContainer}>{textErrorMsg}</div>
              </Fade>
            </Grid>
          )}

          {createdURLS.length !== 0 && (
            <List className={classes.urlList}>
              {createdURLS.map((url, i) => {
                return (
                  <ListItem className={classes.listItem}>
                    <div className={classes.urlListDestination}>{url.destination}</div>
                    <div className={classes.urlListSlug}>
                      <a href={baseUrl + '/' + url.slug}>{baseUrl + '/' + url.slug}</a>
                      <Button
                        variant="contained"
                        color="primary"
                        className={
                          classes.copyButton + ' ' + (buttonIndex === i && copySuccess ? classes.copySuccess : '')
                        }
                        onClick={() => handleButtonClick(i, baseUrl + '/' + url.slug)}
                      >
                        {buttonIndex === i && copySuccess ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Grid>
      </Container>
    </div>
  );
}
