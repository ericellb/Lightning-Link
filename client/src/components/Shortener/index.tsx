import React, { useState } from 'react';
import { makeStyles, Container, TextField, Grid, Button, List, ListItem, Fade } from '@material-ui/core';
import axios from '../AxiosClient';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/#' : 'http://ltng.link/#';

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0b1736',
    paddingTop: '2em',
    paddingBottom: '2em',
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
    paddingBottom: '0px !important',
    [theme.breakpoints.up('md')]: {
      order: 1,
      paddingBottom: '12px !important'
    }
  },
  item2: {
    order: 2,
    marginBottom: '12px',
    paddingBottom: '0px !important',
    [theme.breakpoints.up('md')]: {
      order: 2,
      marginBottom: '0em',
      paddingBottom: '12px !important'
    }
  },
  urlList: {
    order: 3,
    width: 'calc(100% - 24px)',
    maxWidth: '1240px',
    backgroundColor: '#FEFEFE',
    color: 'black',
    fontSize: '17px',
    margin: '12px',
    marginTop: '0px',
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
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap'
    }
  },
  urlListDestination: {
    color: 'black',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '8px'
    }
  },
  urlListSlug: {
    color: '#2a5bd7',
    '& a': {
      textDecoration: 'none',
      color: '#0236b9',
      fontWeight: 400
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
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
    maxWidth: '71px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'none',
      width: '100%',
      margin: '0px',
      marginTop: '8px'
    }
  },
  copySuccess: {
    content: 'Copied !important',
    backgroundColor: '#649949 !important',
    color: '#fefefe'
  },
  errorGrid: {
    order: 3,
    paddingTop: '0px !important'
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
    fontFamily: 'Roboto',
    textAlign: 'center'
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

  // Catches enter key in TextField to submit
  const catchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitURL(destURL);
      e.preventDefault();
    }
  };

  // Handles onclick button
  const handleButtonClick = (buttonIndex: number, text: string) => {
    handleClipboardCopy(text);
    setCopySuccess(true);
    setButtonIndex(buttonIndex);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  // Handles copying to clipboard
  const handleClipboardCopy = (text: string) => {
    var dummyText = document.createElement('textarea');
    dummyText.style.position = 'absolute';
    dummyText.style.top = document.documentElement.scrollTop.toString() + 'px';
    dummyText.value = text;
    document.body.appendChild(dummyText);
    dummyText.focus();
    dummyText.select();
    document.execCommand('copy');
    document.body.removeChild(dummyText);
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

  // Checks if already shortened link (In list of shortened links below...)
  const alreadyShortened = (destURL: string) => {
    let foundUrl = false;
    // return a value at end of arrow function bogus
    // eslint-disable-next-line
    createdURLS.find(url => {
      if (url.destination === destURL) {
        foundUrl = true;
      }
    });
    return foundUrl;
  };

  // Handles submission of URL to Shorten
  const submitURL = async (destURL: string) => {
    if (!alreadyShortened(destURL)) {
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
    } else {
      showErrorMessage(`Already shortened this link, look below ;)`);
      setDestURL('');
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
              title="URL to Shorten"
              autoComplete="off"
              className={classes.textField}
              value={destURL}
              onChange={e => setDestURL(e.target.value)}
              variant="outlined"
              onKeyPress={e => catchEnter(e)}
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
              inputProps={{
                'aria-label': 'URL to Shorten'
              }}
            />
          </Grid>
          <Grid item md={3} xs={12} className={classes.item2}>
            <Button
              title="Shorten URL"
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
                        title="Copy to Clipboard"
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
