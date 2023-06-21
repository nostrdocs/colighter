import React, { useEffect, useState } from 'react';
import Hero from './assets/colighter.avif';
import { ReactComponent as BookingSvg } from './assets/booking.svg';
import { ReactComponent as CommunitySvg } from './assets/community.svg';
import { ReactComponent as WorldSvg } from './assets/world.svg';
import { ReactComponent as WaveOneSvg } from './assets/waveone.svg';
import { ReactComponent as WaveTwoSvg } from './assets/wavetwo.svg';
import { Header } from './components/Header';

export const Landing: React.FC = () => {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const header = document.getElementById('header');
    const toToggle = document.querySelectorAll('.toggleColour');

    if (scrollPos > 10) {
      header?.classList.add('bg-white', 'shadow');

      for (let i = 0; i < toToggle.length; i++) {
        toToggle[i].classList.add('text-gray-800');
        toToggle[i].classList.remove('text-white');
      }
    } else {
      header?.classList.remove('bg-white', 'shadow');

      for (let i = 0; i < toToggle.length; i++) {
        toToggle[i].classList.add('text-white');
        toToggle[i].classList.remove('text-gray-800');
      }
    }
  }, [scrollPos]);

  return (
    <div
      className='leading-normal tracking-normal text-white gradient'
      style={{
        fontFamily: 'Source Sans Pro, sans-serif',
      }}
    >
      {/* Nav */}
      <Header />
      {/* Hero */}
      <div className='pt-24'>
        <div className='container flex flex-col flex-wrap items-center px-3 mx-auto md:flex-row'>
          <div className='flex flex-col items-start justify-center w-full text-center md:w-2/5 md:text-left'>
            <h1 className='my-4 text-4xl font-bold leading-tight'>
              Highlight, share, and discuss online text over nostr
            </h1>
            <p className='mb-8 text-2xl leading-normal'>
              Enhance productivity with effortless highlighting. No more manual
              struggles or messy annotations. Simplify emphasizing and
              remembering crucial content.
            </p>
            <ComingSoon />
          </div>
          <div className='flex justify-end w-full text-center md:w-3/5'>
            <img
              alt='Colighter-Hero'
              className='z-50 w-full md:w-4/5'
              src={Hero}
            />
          </div>
        </div>
      </div>

      <div className='-mt-12 lg:-mt-24'>
        <WaveOneSvg />
      </div>

      <section className='py-8 bg-white'>
        <div className='container max-w-5xl m-8 mx-auto'>
          <h2 className='w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800'>
            Features
          </h2>
          <div className='w-full mb-4'>
            <div className='w-64 h-1 py-0 mx-auto my-0 rounded-t opacity-25 gradient'></div>
          </div>
          <div className='flex flex-wrap items-center'>
            <div className='flex flex-col w-5/6 gap-3 p-6 sm:w-1/2'>
              <h3 className='text-3xl font-bold leading-none text-gray-800'>
                Effortless Highlighting
              </h3>
              <p className='text-gray-600'>
                Instantly mark text in vibrant colors with a single click,
                creating a visual roadmap of your digital discoveries.
              </p>
            </div>
            <div className='w-full p-6 sm:w-1/2'>
              <BookingSvg />
            </div>
          </div>
          <div className='flex flex-col-reverse flex-wrap items-center sm:flex-row'>
            <div className='w-full p-6 mt-6 sm:w-1/2'>
              <WorldSvg />
            </div>
            <div className='w-full p-6 mt-6 sm:w-1/2'>
              <div className='flex flex-col gap-3 align-middle'>
                <h3 className='text-3xl font-bold leading-none text-gray-800 '>
                  Share Highlights With The World
                </h3>
                <p className='text-gray-600 '>
                  Share your highlights effortlessly with the world, amplifying
                  your impact and sparking engaging discussions.
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap items-center'>
            <div className='flex flex-col w-5/6 gap-3 p-6 sm:w-1/2'>
              <h3 className='text-3xl font-bold leading-none text-gray-800'>
                Explore and Discuss Highlights with Others
              </h3>
              <p className='text-gray-600'>
                Follow friends and thought leaders as they navigate the web.
                Discuss ideas that you find most important. Deepen your learning
                with others’ insights.
              </p>
            </div>
            <div className='w-full p-6 sm:w-1/2'>
              <CommunitySvg />
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Change the colour #f8fafc to match the previous section colour --> */}
      <WaveTwoSvg />

      <section className='container p-6 pb-12 mx-auto text-center'>
        <h2 className='w-full my-2 text-5xl font-bold leading-tight text-center text-white'>
          Experience Colighter
        </h2>
        <div className='w-full mb-4'>
          <div className='w-1/6 h-1 py-0 mx-auto my-0 bg-white rounded-t opacity-25'></div>
        </div>
        <p className='my-4 text-3xl leading-tight'>
          Elevate your reading with our text highlighter extension. Highlight,
          capture, and share seamlessly. Experience the power of effortless
          knowledge management. Get started now!
        </p>
        <ComingSoon />
      </section>
    </div>
  );
};

export const ComingSoon: React.FC = () => {
  return (
    <p className='px-8 py-4 mx-auto my-6 font-bold text-gray-800 bg-white shadow-lg lg:mx-0 focus:shadow-outline'>
      COMING SOON
    </p>
  );
};
