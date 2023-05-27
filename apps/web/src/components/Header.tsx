import React from 'react';

export const Header: React.FC = () => {
  return (
    <nav id='header' className='fixed top-0 z-30 w-full text-white'>
      <div className='container flex flex-wrap items-center justify-between w-full py-2 mx-auto mt-0'>
        <div className='flex items-center pl-4'>
          <a
            className='text-2xl font-bold text-white no-underline toggleColour hover:no-underline lg:text-4xl'
            href='#'
            rel='no'
          >
            COLIGHTER
          </a>
        </div>
      </div>
      <hr className='py-0 my-0 border-b border-gray-100 opacity-25' />
    </nav>
  );
};
