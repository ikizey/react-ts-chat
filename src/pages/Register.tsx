import React, { useState } from 'react';
import AddAvatar from '../img/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      userName: HTMLInputElement;
      email: HTMLInputElement;
      password: HTMLInputElement;
      file: HTMLInputElement;
    };

    const userName = formElements.userName.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const files = formElements.file.files as FileList;
    const file = files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, userName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        _ => {},
        error => {
          console.error(error);
          setIsError(true);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName: userName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'userChats', res.user.uid), {});
            navigate('/');
          } catch (error) {
            // console.error(error);
            setIsError(true);
          }
        }
      );
    } catch (error) {
      // console.error(error);
      setIsError(true);
    }
  };

  return (
    <div className='bg-indigo-300 min-h-screen flex items-center justify-center'>
      <div className='bg-white py-5 px-14 rounded-xl flex flex-col items-center gap-2.5'>
        <span className='text-indigo-500 font-bold text-xl'>Chat</span>
        <span className='text-indigo-500 text-xs'>Register</span>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            className='p-4 outline-none w-64 border-b border-b-indigo-200 placeholder:text-gray-400'
            type='text'
            placeholder='display name...'
            id='userName'
          />
          <input
            className='p-4 outline-none w-64 border-b border-b-indigo-200 placeholder:text-gray-400'
            type='email'
            placeholder='email...'
            id='email'
          />
          <input
            className='p-4 outline-none w-64 border-b border-b-indigo-200 placeholder:text-gray-400'
            type='password'
            placeholder='password...'
            id='password'
          />
          <input className='hidden' type='file' id='file' />
          <label
            className='flex items-center gap-2 text-indigo-400 text-sm cursor-pointer'
            htmlFor='file'
          >
            <img className='w-8' src={AddAvatar} alt='add an avatar.' />
            <span>Add an avatar</span>
          </label>
          <button className='bg-indigo-400 text-white p-4 font-bold border-none cursor-pointer'>
            Sign Up
          </button>
          {isError && <span>Something went wrong.</span>}
        </form>
        <p className='text-indigo-400 text-xs mt-2'>
          You do have an account? <Link to='/login'>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
