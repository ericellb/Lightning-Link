export enum ACTION {
  SIGN_IN,
  SIGN_OUT
}

export type UserActionTypes = SignInAction | SignOutAction;

/* Action Types */
export type SignInAction = {
  type: ACTION.SIGN_IN;
  payload: SignInData;
};

export type SignOutAction = {
  type: ACTION.SIGN_OUT;
  payload: null;
};

/* Interfaces for Data coming into Action Creators */

export interface SignInData {
  userId: string;
  userName: string;
}
