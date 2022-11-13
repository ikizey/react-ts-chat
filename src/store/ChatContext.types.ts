export type ChatCtx = {
  data: ChatState;
  dispatch: React.Dispatch<Action>;
};

export enum ActionKind {
  CHANGE_USER = 'CHANGE_USER',
}

export type UserInfo = {
  uid: string;
  displayName: string;
  photoURL: string;
};

export type Action = {
  type: ActionKind;
  payload: UserInfo;
};

export type ChatState = {
  chatId: string;
  user: UserInfo;
};
