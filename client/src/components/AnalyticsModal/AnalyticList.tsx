import React, { useState } from 'react';
import { makeStyles, List, ListItem, Typography } from '@material-ui/core';
import { ListData } from './types';
import axios from '../AxiosClient';
import { useSelector } from 'react-redux';
import { StoreState } from '../../reducers';

const useStyles = makeStyles(theme => ({
  analyticListContainer: {
    flexBasis: '20%',
    paddingLeft: '8px',
    boxSizing: 'border-box'
  },
  listTitle: {
    textAlign: 'center'
  },
  listContainer: {
    width: '100%'
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
  const [locationType, setLocationType] = useState('Continent');
  const classes = useStyles({});

  // Gets
  const getAnalyticLocationData = async (location: string, type: string) => {
    if (type !== 'city') {
      try {
        let endpointURL = `/analytic/${props.slug}/${location}?userId=${user.userId}&type=${type}`;
        let res = await axios.get(endpointURL, { withCredentials: true });
        if (res.status === 200) {
          setListData(res.data);
          let temp = res.data[0].type.charAt(0).toUpperCase() + res.data[0].type.slice(1);
          setLocationType(temp);
        }
      } catch (err) {}
    }
  };

  return (
    <div className={classes.analyticListContainer}>
      <div className={classes.listTitle}> Views by {locationType}</div>
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
