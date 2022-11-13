import React from 'react';
import Chats from './Chats';
import Navbar from './Navbar';
import Search from './Search';

const Sidebar = () => {
  return (
    <div className='flex-1 bg-indigo-800'>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
