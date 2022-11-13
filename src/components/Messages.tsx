import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { ChatContext } from '../store/ChatContext';
import { MessageType } from './Message.types';
import Message from './Message';

const Messages = () => {
  const [messages, setMessages] = useState<MessageType[] | null>(null);
  const ChatCtx = useContext(ChatContext);
  const chatId = ChatCtx?.data.chatId;

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, 'chats', chatId), doc => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => unSub();
    }
  }, [chatId]);

  return (
    <div className='p-2 bg-gray-200 overflow-scroll grow'>
      {messages?.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
