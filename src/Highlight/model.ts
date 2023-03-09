import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IHighlight, IHighlightCollection } from "./interfaces";

export class Highlight implements IHighlight {
	protected constructor(public author: string, public text: string, public hashId: string) {}

	static async create(author: string, text: string) {
		const encoder = new TextEncoder();
		const hashArray = Array.from(
			new Uint8Array(
				await crypto.subtle.digest("SHA-256", encoder.encode(`${author}-${text}`)),
			),
		);
		const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

		return new Highlight(author, text, hash);
	}
}

export class HighlightCollection extends DataObject implements IHighlightCollection {
	protected async initializeFirstTime() {}

	protected async hasInitialized() {
		this.root.on("valueChanged", () => this.emit("highlightCollectionChanged"));
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
