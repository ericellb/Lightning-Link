import { ACTION, UserActionTypes } from '../actions/types';

export interface UserStore {
  isSignedIn: boolean;
  userId: string;
  userName: string;
}

const initialState = {
  isSignedIn: false,
  userId: '',
  userName: ''
};

export const userReducer = (state: UserStore = initialState, action: UserActionTypes): UserStore => {
  switch (action.type) {
    case ACTION.SIGN_IN:
      if (action.payload.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userId', action.payload.userId);
        localStorage.setItem('userName', action.payload.userName);
      }
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.userId,
        userName: action.payload.userName
      };
    case ACTION.SIGN_OUT:
      localStorage.setItem('rememberMe', '');
      localStorage.setItem('userId', '');
      localStorage.setItem('userName', '');
      return { ...state, isSignedIn: false, userId: '', userName: '' };
    default:
      return state;
  }
};
