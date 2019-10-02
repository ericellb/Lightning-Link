import { userReducer, UserStore } from './userReducer';
import { combineReducers } from 'redux';

export interface StoreState {
  user: UserStore;
}

export default combineReducers<StoreState>({
  user: userReducer
});
