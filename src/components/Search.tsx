import React, { useContext, useState } from 'react';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../store/AuthContext';
import { User } from 'firebase/auth';

const Search = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState<DocumentData | null>(null);
  const [isError, setIsError] = useState(false);

  const currentUser = useContext(AuthContext) as User;

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const searchHandler = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', userName)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          setUser(data);
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setIsError(true);
    }
  };

  const handleEnter = (event: React.KeyboardEvent) => {
    event.code === 'Enter' && searchHandler();
  };

  const handleSelect = async () => {
    const selectedUser = user as User;
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', selectedUser.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        setUser(null);
        setUserName('');
      }
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <div className='border-b border-b-gray-600'>
      <div className='p-2'>
        <input
          className='bg-transparent text-white border-b border-b-gray-900 outline-none placeholder:text-xs placeholder:text-gray-400'
          type='text'
          placeholder='find a user...'
          value={userName}
          onChange={changeHandler}
          onKeyDown={handleEnter}
        />
      </div>
      {isError && <span>No such user.</span>}
      {user && (
        <div
          className='p-2 flex items-center gap-2 text-white cursor-pointer hover:bg-indigo-700 hover:rounded-lg hover:overflow-hidden'
          onClick={handleSelect}
        >
          <img
            className='w-10 h-10 rounded-full object-cover'
            src={user.photoURL}
            alt=''
          />
          <div>
            <span className='text-lg font-medium text-gray-100'>
              {user.displayName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
