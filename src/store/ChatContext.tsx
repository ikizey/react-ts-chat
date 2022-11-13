import { User } from 'firebase/auth';
import { createContext, useContext, useReducer } from 'react';
import { AuthContext } from './AuthContext';
import { ContextProps } from './contextProps.types';
import { ChatCtx, ActionKind, Action, ChatState } from './ChatContext.types';

export const ChatContext = createContext<ChatCtx | null>(null);

const INITIAL_STATE: ChatState = {
  chatId: '',
  user: { uid: '', displayName: '', photoURL: '' },
};

export const ChatContextProvider = ({ children }: ContextProps) => {
  const currentUser = useContext(AuthContext) as User;

  const chatReducer = (state: ChatState, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_USER:
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload?.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
