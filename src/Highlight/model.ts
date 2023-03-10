import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IHighlight, IHighlightCollection } from "./interfaces";

const HIGHLIGHT_BASE_ASSET_KEY = "HIGHLIGHT_BASE_ASSET_KEY";
const HIGHLIGHT_BASE_ASSET_DEFAULT_VALUE = "HIGHLIGHT_BASE_ASSET_DEFAULT_VALUE";

export class Highlight implements IHighlight {
	protected constructor(public author: string, public text: string, public hashId: string) {}

	static async create(author: string, text: string) {
		const hash = await sha256Hash(`${author}-${text}`);
		return new Highlight(author, text, hash);
	}
}

export class HighlightCollection extends DataObject implements IHighlightCollection {
	protected async initializeFirstTime() {
		// Store  a reference to the web resource we are highlightning, as a sha256 hash of the web url
		// In case we cannot determine the web url at the time of initialization,
		// we use a hash of HIGHLIGHT_BASE_ASSET_DEFAULT_VALUE as the base asset reference
		const base = await sha256Hash(document.location.href || HIGHLIGHT_BASE_ASSET_DEFAULT_VALUE);
		this.root.set(HIGHLIGHT_BASE_ASSET_KEY, base);
	}

	protected async hasInitialized() {
		this.root.on("valueChanged", () => this.emit("highlightCollectionChanged"));
	}

	async getHighlightBase(): Promise<string> {
		let base =
			this.root.get(HIGHLIGHT_BASE_ASSET_KEY) ||
			sha256Hash(HIGHLIGHT_BASE_ASSET_DEFAULT_VALUE);

		return Promise.resolve(base);
	}

	async addHighlight(highlight: Highlight): Promise<Highlight> {
		this.root.set(highlight.hashId, highlight);
		return Promise.resolve(highlight);
	}

	async removeHighlight(hashId: string): Promise<boolean> {
		if (this.root.has(hashId)) {
			return Promise.resolve(this.root.delete(hashId));
		}

		return Promise.reject("Highlight does not exist");
	}

	async getHighlight(hashId: string): Promise<Highlight | undefined> {
		if (this.root.has(hashId)) {
			return Promise.resolve(this.root.get(hashId));
		}

		return Promise.resolve(undefined);
	}

	async getHighlights(): Promise<Highlight[]> {
		const highlights: Highlight[] = [];
		this.root.forEach((value) => highlights.push(value));
		return Promise.resolve(highlights);
	}
}

export const HighlightCollectionInstantiationFactory = new DataObjectFactory(
	"highlight-collection",
	HighlightCollection,
	[],
	{},
);

const sha256Hash = async (message: string): Promise<string> => {
	const encoder = new TextEncoder();
	const hashArray = Array.from(
		new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(message))),
	);
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
