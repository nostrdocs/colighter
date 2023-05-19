import React, { useCallback } from 'react';
import { browserSourceNostrId, createEphemeralNostrId } from 'nostrfn';

export const WaitlistButton: React.FC = () => {
  const [joined, setJoined] = React.useState(false);

  const joinWaitlist = useCallback(async () => {
    if (joined) return;

    try {
      const WAITLIST_FN = process.env.REACT_APP_WAITLIST_FUNCTION;
      if (!WAITLIST_FN) return;

      let keypair = await browserSourceNostrId();

      if (!keypair) {
        // TODO: Request for pubkey or alert about ephemeral key created
        keypair = createEphemeralNostrId();
      }

      const res = await fetch(WAITLIST_FN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          npub: keypair.pubkey,
        }),
      });

      if (res.ok) {
        setJoined(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [joined]);

  return (
    <button
      onClick={() => joinWaitlist()}
      className='mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out'
    >
      JOIN WAITLIST
    </button>
  );
};
