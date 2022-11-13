import { User } from 'firebase/auth';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { AuthContext } from '../store/AuthContext';
import { ChatContext } from '../store/ChatContext';
import { ChatCtx, ActionKind, UserInfo } from '../store/ChatContext.types';

const Chats = () => {
  const [chats, setChats] = useState<DocumentData | undefined>(undefined);
  const currentUser = useContext(AuthContext) as User;
  const { dispatch } = useContext(ChatContext) as ChatCtx;

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userChats', currentUser.uid), doc => {
      setChats(doc.data());
    });
    return () => unSub();
  }, [currentUser.uid]);

  const handleSelect = (userInfo: UserInfo) => {
    dispatch({ type: ActionKind.CHANGE_USER, payload: userInfo });
  };

  return (
    <div className=''>
      {Object.entries(chats ?? {})
        .sort((c1, c2) => c2[1].timeStamp - c1[1].timeStamp)
        .map(chat => (
          <div
            className='p-2 flex items-center gap-2 text-white cursor-pointer hover:bg-indigo-700 hover:rounded-lg hover:overflow-hidden'
            onClick={() => handleSelect(chat[1].userInfo)}
            key={chat[0]}
          >
            <img
              className='w-10 h-10 rounded-full object-cover'
              src={chat[1].userInfo.photoURL}
              alt=''
            />
            <div>
              <span className='text-sm font-medium text-gray-100'>
                {chat[1].userInfo.displayName}
              </span>
              <p className='text-xs text-gray-300'>{chat[1].lastMessage}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
