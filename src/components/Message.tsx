import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { ChatContext } from '../store/ChatContext';
import { UserInfo } from '../store/ChatContext.types';
import { MessageType } from './Message.types';
import TimeAgo from 'react-timeago';

type MessageProps = {
  message: MessageType;
};

const Message = (props: MessageProps) => {
  const currentUser = useContext(AuthContext) as User;
  const chatCtx = useContext(ChatContext);

  const photoURL = currentUser.photoURL ?? '';
  const user = chatCtx?.data.user as UserInfo;
  const isOwner = props.message.senderId === currentUser.uid;

  return (
    <div className={'flex gap-5 ' + (isOwner ? 'flex-row-reverse' : '')}>
      <div className='flex flex-col text-gray-700 mb-5 font-light  gap-1'>
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={isOwner ? photoURL : user.photoURL}
          alt=''
        />
      </div>
      <div className='flex flex-col gap-2'>
        <div
          className={
            'flex flex-col rounded-b-md ' +
            (isOwner
              ? 'bg-indigo-300 rounded-tl-md text-right'
              : 'bg-white rounded-tr-md')
          }
        >
          <p className={'py-2 px-3 text-sm'}>
            {props.message.text}
            <p>
              <TimeAgo
                className='text-xs font-light'
                date={props.message.date.toDate()}
              />
            </p>
          </p>
        </div>
        {props.message.imageURL && (
          <img
            className='w-1/2 object-cover'
            src={props.message.imageURL}
            alt=''
          />
        )}
      </div>
    </div>
  );
};

export default Message;
