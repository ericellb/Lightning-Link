import React, { useState } from 'react';
import { makeStyles, List, ListItem, IconButton } from '@material-ui/core';
import { ListData } from './types';
import axios from '../AxiosClient';
import { useSelector } from 'react-redux';
import { StoreState } from '../../reducers';
import { ArrowBack } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  analyticListContainer: {
    width: '25%',
    paddingLeft: '8px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      width: '100%',
      paddingTop: '16px'
    }
  },
  listTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  listTitleIcon: {
    padding: '0px',
    paddingRight: '6px',
    color: 'black'
  },
  listContainer: {
    width: '100%',
    paddingLeft: '16px',
    boxSizing: 'border-box'
  },
  listItemLocation: {},
  listItemVisits: {}
}));

interface AnalyticListProps {
  listData: ListData[];
  slug: string;
}

// Dispalys a list of Continents / Countries / States / Cities and their respective views
export default function AnalyticList(props: AnalyticListProps) {
  const user = useSelector((state: StoreState) => state.user);
  const [listData, setListData] = useState(props.listData);
  const [curLocation, setCurLocation] = useState({ type: 'Continent', location: 'NA' });
  const [rootLocation, setRootLocation] = useState({
    type: 'continent',
    location: 'none'
  });
  const classes = useStyles({});

  // Gets Location data for a specific location
  const getAnalyticLocationData = async (location: string, type: string) => {
    if (type !== 'city') {
      try {
        let endpointURL = `/analytic/${props.slug}/${location}?userId=${user.userId}&type=${type}`;
        let res = await axios.get(endpointURL, { withCredentials: true });
        if (res.status === 200) {
          setListData(res.data);
          let temp = res.data[0].type.charAt(0).toUpperCase() + res.data[0].type.slice(1);
          setCurLocation({ type: temp, location: res.data[0].location });
        }
      } catch (err) {}
    }
  };

  return (
    <div className={classes.analyticListContainer}>
      <div className={classes.listTitle}>
        <IconButton
          aria-label="back"
          className={classes.listTitleIcon}
          onClick={() => getAnalyticLocationData(rootLocation.location, rootLocation.type)}
        >
          <ArrowBack />
        </IconButton>
        Views by {curLocation.type}
      </div>
      <List className={classes.listContainer}>
        {listData.map(entry => {
          return (
            <ListItem button onClick={() => getAnalyticLocationData(entry.location, entry.type)}>
              <div>
                {entry.location} : {entry.visits}
              </div>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
