import { ACTION, UserActionTypes } from '../actions/types';

export interface UserStore {
  isSignedIn: boolean;
  userId: string;
  userName: string;
  userToken: string;
}

const initialState = {
  isSignedIn: false,
  userId: '',
  userName: '',
  userToken: ''
};

export const userReducer = (state: UserStore = initialState, action: UserActionTypes): UserStore => {
  switch (action.type) {
    case ACTION.SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.userId,
        userName: action.payload.userName,
        userToken: action.payload.userToken
      };
    case ACTION.SIGN_OUT:
      console.log('out');
      return { ...state, isSignedIn: false, userId: '', userName: '', userToken: '' };
    default:
      return state;
  }
};
