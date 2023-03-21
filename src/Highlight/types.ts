import { EventEmitter } from "events";

export interface IHighlight {
	/** Text content of the highlight */
	text: string;
	/** Author of the highlight,
	 * This could be the pubkey identifier of the author
	 */
	author: string;
	/** Unique hash identifier of the highlight
	 *  Possibly create this by hashing concat of author + text
	 */
	hashId: string;
}

export interface IHighlightCollection extends EventEmitter {
	getHighlightBase(): Promise<string>;
	addHighlight(highlight: IHighlight): Promise<IHighlight>;
	removeHighlight(hashId: string): Promise<boolean>;
	getHighlight(hashId: string): Promise<IHighlight | undefined>;
	getHighlights(): Promise<IHighlight[]>;

	/** highlightCollectionChanged event will fire whenever the highlight collection changes.
	 * Changes originate either locally or remotely
	 */
	on(event: "highlightCollectionChanged", listener: () => void): this;
}

export interface IHighlightCollectionAppModel {
	readonly highlightCollection: IHighlightCollection;
}
