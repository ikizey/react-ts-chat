import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const email = formElements.email.value;
    const password = formElements.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      // console.error(error);
      setIsError(true);
    }
  };
  return (
    <div className='bg-indigo-300 min-h-screen flex items-center justify-center'>
      <div className='bg-white py-5 px-14 rounded-xl flex flex-col items-center gap-2.5'>
        <span className='text-indigo-500 font-bold text-xl'>Chat</span>
        <span className='text-indigo-500 text-xs'>Login</span>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            className='p-4 outline-none w-64 border-b  border-b-indigo-200 placeholder:text-gray-400'
            type='email'
            placeholder='email...'
            id='email'
          />
          <input
            className='p-4 outline-none w-64 border-b  border-b-indigo-200 placeholder:text-gray-400'
            type='password'
            placeholder='password...'
            id='password'
          />

          <button className='bg-indigo-400 text-white p-4 font-bold border-none cursor-pointer'>
            Sign In
          </button>
          {isError && <span>Something went wrong.</span>}
        </form>
        <p className='text-indigo-400 text-xs mt-2'>
          You don't have an account? <Link to='/register'>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
