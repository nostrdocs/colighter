import React from "react";
import styled from "styled-components";
import { IUser } from "../../types";

import Colighter from "../Assets/Svg/colighter.svg";
import Gear from "../Assets/Svg/gear.svg";
import { AvatarList } from "./AvatarList";
import { HighlightPicker } from "./HighlightPicker";
import { HomeHighlights } from "./HomeHighlights";

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
	userName: "user" + i,
	imageUrl: "https://source.unsplash.com/100x100/?profile-image",
})) satisfies IUser[];

const highLights = [
	"Bitcoin ipsum dolor sit amet. Peer-to-peer whitepaper UTXO \n cryptocurrency address miner satoshis, difficulty. Private key timestamp\nserver full node stacking sats UTXO decentralized Bitcoin Improvement\nProposal peer-to-peer!",
	"Merkle Tree address, mempool, consensus proof-of-work double-spend\nproblem bitcoin hard fork! Outputs genesis block, cryptocurrency\nhalvening Bitcoin Improvement Proposal.",
	"UTXO stacking sats Bitcoin Improvement Proposal nonce private key UTXO\ndecentralized, outputs.",
];

export function HomePopUp() {
	return (
		<Container>
			<Row>
				<img src={`${Colighter}`} alt="colighter-logo" />
				<img src={`${Gear}`} alt="gear-icon" />
			</Row>
			<div>
				<Heading>Your Highlights</Heading>
				<HomeHighlights highLights={highLights} />
			</div>
			<div>
				<UserHeading>132 people have highlighted this page</UserHeading>
				<AvatarList avatarSize={48} maxUsers={8} users={users} />
			</div>
			<HighlightPicker />
		</Container>
	);
}
