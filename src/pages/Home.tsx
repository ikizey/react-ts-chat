import React from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

const Home = () => {
  return (
    <div className='bg-indigo-300 h-screen flex items-center justify-center'>
      <div className='border rounded-xl border-white w-4/6 h-5/6 flex overflow-hidden'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
