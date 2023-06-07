import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { IUser } from '../types';
import { AvatarList } from './AvatarList';
import { HomeHighlights } from './HomeHighlights';
import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { PartialKeyPair, browserSourceNostrId} from 'nostrfn';

const Container = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  border: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
  border-radius: 12px;
  width: 400px;
  gap: 30px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Heading = styled.h5`
  font-weight: 500;
  margin: 0;
  margin-bottom: 12px;
`;
const UserHeading = styled(Heading)`
  font-size: 2rem;
`;

const users = Array.from({ length: 10 }).map((_, i) => ({
  userName: 'user' + i,
  imageUrl: 'https://source.unsplash.com/100x100/?profile-image',
})) satisfies IUser[];

export function HomePopUp() {
  const [nostrId, setNostrId] = useState< PartialKeyPair | null>(null);

  const handleCreateNostrId = useCallback(async () => {
    const nostrId = await browserSourceNostrId();
    setNostrId(nostrId);
    console.log(nostrId);
  }, []);


  return (
    <Container>
      <Row>
        <img src={`${Colighter}`} alt='colighter-logo' />
        <img src={`${Gear}`} alt='settings'/>
        {/* create a login button that will call the nostr extension and then create a nostrId */}
        <button onClick={handleCreateNostrId}>Create NostrId</button>
        
      </Row>
      <div>
        <Heading>Your Highlights</Heading>
        <div>Your npub is: {nostrId ? nostrId.pubkey.toString() : 'N/A'}</div>
        <HomeHighlights />
      </div>
      <div>
        <UserHeading>2 people have highlighted this page</UserHeading>
        <AvatarList avatarSize={48} maxUsers={2} users={users} />
      </div>
    </Container>
  );
}
