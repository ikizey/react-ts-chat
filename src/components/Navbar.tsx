import React, { useContext } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../store/AuthContext';

const Navbar = () => {
  const currentUser = useContext(AuthContext);
  const photoURL = currentUser?.photoURL ?? '';
  const userName = currentUser?.displayName ?? '';
  return (
    <div className='flex items-center bg-indigo-900 h-12 p-4 justify-between text-white'>
      <span className='font-bold text-sm'>Chat</span>
      <div className='flex gap-2 items-center'>
        <img
          className='bg-white rounded-full h-6 w-6 object-cover'
          src={photoURL}
          alt=''
        />
        <span className='text-xs'>{userName}</span>
        <button
          className='bg-indigo-600 text-white text-xs px-1 rounded-md cursor-pointer h-4'
          onClick={() => signOut(auth)}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
