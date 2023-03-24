import { NostrUser } from "./types";

export const getNostrUser = async (): Promise<NostrUser> => {
	// TODO: Load nostr identity from extension or other means
	const mockNostrUser: NostrUser = {
		pubkey: "0x1234",
		meta: {},
	};

	return mockNostrUser;
};


// const pubKey = (): string => {
// 	return window.nostr.getPublicKey().toString();
// }