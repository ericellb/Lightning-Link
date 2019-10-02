import { ACTION, SignInAction, SignOutAction, SignInData } from './types';

// On sign in
export const signIn = (user: SignInData): SignInAction => ({
  type: ACTION.SIGN_IN,
  payload: user
});

// On sign out
export const signOut = (): SignOutAction => ({
  type: ACTION.SIGN_OUT,
  payload: null
});
