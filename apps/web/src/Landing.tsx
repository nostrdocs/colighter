import React, { useEffect, useState } from 'react';
import Hero from './assets/colighter.avif';
import { ReactComponent as BookingSvg } from './assets/booking.svg';
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
    const navAction = document.getElementById('navAction');
    const toToggle = document.querySelectorAll('.toggleColour');

    if (scrollPos > 10) {
      header?.classList.add('bg-white', 'shadow');
      navAction?.classList.remove('bg-white', 'text-gray-800');
      navAction?.classList.add('gradient', 'text-white');

      for (let i = 0; i < toToggle.length; i++) {
        toToggle[i].classList.add('text-gray-800');
        toToggle[i].classList.remove('text-white');
      }
    } else {
      header?.classList.remove('bg-white', 'shadow');
      navAction?.classList.remove('gradient', 'text-white');
      navAction?.classList.add('bg-white', 'text-gray-800');

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
        <div className='container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center'>
          <div className='flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left'>
            <p className='uppercase tracking-loose w-full'>Coming soon!</p>
            <h1 className='my-4 text-4xl font-bold leading-tight'>
              Highlight, Capture, and Organize Your Digital World
            </h1>
            <p className='leading-normal text-2xl mb-8'>
              Enhance productivity with effortless highlighting. No more manual
              struggles or messy annotations. Simplify emphasizing and
              remembering crucial content.
            </p>
            <button className='mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out'>
              GET THE EXTENSION
            </button>
          </div>

          <div className='w-full md:w-3/5 py-6 text-center'>
            <img className='w-full md:w-4/5 z-50' src={Hero} />
          </div>
        </div>
      </div>

      <div className='relative -mt-12 lg:-mt-24'>
        <WaveOneSvg />
      </div>

      <section className='bg-white py-8'>
        <div className='container max-w-5xl mx-auto m-8'>
          <h2 className='w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800'>
            Features
          </h2>
          <div className='w-full mb-4'>
            <div className='h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t'></div>
          </div>
          <div className='flex flex-wrap'>
            <div className='w-5/6 sm:w-1/2 p-6'>
              <h3 className='text-3xl text-gray-800 font-bold leading-none mb-3'>
                Effortless Highlighting
              </h3>
              <p className='text-gray-600 mb-8'>
                Instantly mark text in vibrant colors with a single click,
                creating a visual roadmap of your digital discoveries.
              </p>
            </div>
            <div className='w-full sm:w-1/2 p-6'>
              <BookingSvg />
            </div>
          </div>
          <div className='flex flex-wrap flex-col-reverse sm:flex-row'>
            <div className='w-full sm:w-1/2 p-6 mt-6'>
              <WorldSvg />
            </div>
            <div className='w-full sm:w-1/2 p-6 mt-6'>
              <div className='align-middle'>
                <h3 className='text-3xl text-gray-800 font-bold leading-none mb-3'>
                  Share Highlights With The World
                </h3>
                <p className='text-gray-600 mb-8'>
                  Share your highlights effortlessly with the world, amplifying
                  your impact and sparking engaging discussions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Change the colour #f8fafc to match the previous section colour --> */}
      <WaveTwoSvg />

      <section className='container mx-auto text-center py-6 mb-12'>
        <h2 className='w-full my-2 text-5xl font-bold leading-tight text-center text-white'>
          Experience Colighter
        </h2>
        <div className='w-full mb-4'>
          <div className='h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t'></div>
        </div>
        <p className='my-4 text-3xl leading-tight'>
          Elevate your reading with our text highlighter extension. Highlight,
          capture, and share seamlessly. Experience the power of effortless
          knowledge management. Get started now!
        </p>
        <button className='mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out'>
          GET THE EXTENSION
        </button>
      </section>

      {/* <!--Footer--> */}
      <footer className='bg-white'>
        <div className='container mx-auto px-8'>
          <div className='w-full flex flex-col md:flex-row py-6'>
            <div className='flex-1 mb-6 text-black'>
              <a
                className='text-pink-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl'
                href='#'
              >
                COLIGHTER
              </a>
            </div>
            <div className='flex-1'>
              <p className='uppercase text-gray-500 md:mb-6'>Links</p>
              <ul className='list-reset mb-6'>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    FAQ
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Help
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div className='flex-1'>
              <p className='uppercase text-gray-500 md:mb-6'>Legal</p>
              <ul className='list-reset mb-6'>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Terms
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div className='flex-1'>
              <p className='uppercase text-gray-500 md:mb-6'>Social</p>
              <ul className='list-reset mb-6'>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Facebook
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Linkedin
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div className='flex-1'>
              <p className='uppercase text-gray-500 md:mb-6'>Company</p>
              <ul className='list-reset mb-6'>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Official Blog
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    About Us
                  </a>
                </li>
                <li className='mt-2 inline-block mr-2 md:block md:mr-0'>
                  <a
                    href='#'
                    className='no-underline hover:underline text-gray-800 hover:text-pink-500'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
