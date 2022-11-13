import React, { useContext } from 'react';
import camIcon from '../img/cam.png';
import addIcon from '../img/add.png';
import moreIcon from '../img/more.png';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../store/ChatContext';

const Chat = () => {
  const ChatCtx = useContext(ChatContext);
  const displayName = ChatCtx?.data.user.displayName ?? '';

  return (
    <div className='flex-2 flex flex-col'>
      <div className='h-12 p-2 text-gray-100 bg-indigo-600 flex items-center justify-between'>
        <span>{displayName}</span>
        <div className='flex gap-2'>
          <img className='h-6 cursor-pointer' src={camIcon} alt='' />
          <img className='h-6 cursor-pointer' src={addIcon} alt='' />
          <img className='h-6 cursor-pointer' src={moreIcon} alt='' />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
