import React, { useContext, useState } from 'react';
import addImage from '../img/img.png';
import { AuthContext } from '../store/AuthContext';
import { User } from 'firebase/auth';
import { ChatContext } from '../store/ChatContext';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { MessageType } from './Message.types';

const Input = () => {
  const currentUser = useContext(AuthContext) as User;
  const chatCtx = useContext(ChatContext);
  const chatId = chatCtx?.data.chatId;

  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const changeTextHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const changeImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files;
    if (imageFile) {
      setImage(imageFile[0]);
    }
  };

  const sendHandler = async () => {
    const emptyMessage = !(text || image);
    if (!chatId || emptyMessage) {
      setText('');
      setImage(null);
      return;
    }
    let message: MessageType = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };
    let imageURL: string;
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        'state_changed',
        _ => {},
        _ => {},
        async () => {
          try {
            imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            message = { ...message, imageURL };
          } catch (error) {}
        }
      );
    }
    await updateDoc(doc(db, 'chats', chatId), {
      messages: arrayUnion(message),
    });

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [chatCtx.data.chatId + '.lastMessage']: text,
      [chatCtx.data.chatId + '.timeStamp']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', chatCtx.data.user.uid), {
      [chatCtx.data.chatId + '.lastMessage']: text,
      [chatCtx.data.chatId + '.timeStamp']: serverTimestamp(),
    });

    setText('');
    setImage(null);
  };

  const handleEnter = (event: React.KeyboardEvent) => {
    event.code === 'Enter' && sendHandler();
  };

  return (
    <div className='bg-white h-12 p-2 flex items-center justify-between'>
      <input
        className='w-full border-none outline-none text-indigo-400 text-lg placeholder:text-gray-400'
        type='text'
        placeholder='type something...'
        onChange={changeTextHandler}
        onKeyDown={handleEnter}
        value={text}
      />
      <div className='flex items-center gap-2'>
        <input
          className='hidden'
          type='file'
          id='image'
          onChange={changeImageHandler}
        />
        <label htmlFor='image'>
          <img className='w-9 cursor-pointer' src={addImage} alt='' />
        </label>
        <button
          className='bg-indigo-500 text-white text-sm px-2 rounded-md cursor-pointer  h-6'
          onClick={sendHandler}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
