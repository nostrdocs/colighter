import {
	createTinyliciousCreateNewRequest,
	InsecureTinyliciousTokenProvider,
	InsecureTinyliciousUrlResolver,
} from "@fluidframework/tinylicious-driver";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import { StaticCodeLoader, NostrCollabLoader } from "./Nostrcollab";
import {
	renderHighlightCollection,
	IHighlightCollectionAppModel,
	HighlightContainerRuntimeFactory,
} from "./Highlight";

async function start() {
	const tokenProvider = new InsecureTinyliciousTokenProvider();

	// Create a new Fluid loader, load the highlight collection
	const loader = new NostrCollabLoader<IHighlightCollectionAppModel>(
		{
			urlResolver: new InsecureTinyliciousUrlResolver(),
			documentServiceFactory: new RouterliciousDocumentServiceFactory(tokenProvider),
			codeLoader: new StaticCodeLoader(new HighlightContainerRuntimeFactory()),
			generateCreateNewRequest: createTinyliciousCreateNewRequest,
		}
	);

	let id: string;
	let highlightsCollection: IHighlightCollectionAppModel;

	if (window.location.hash.length === 0) {
		const createResponse = await loader.createDetached("0.1.0");
		highlightsCollection = createResponse.collab;
		id = await createResponse.attach();
	} else {
		id = window.location.hash.substring(1);
		highlightsCollection = await loader.loadExisting(id);
	}

	// Update the browser url and window title with the container ID
	window.location.hash = id;
	document.title = id;

	// Render the highlight collection
	const rootDiv = document.getElementById("root");
	rootDiv && renderHighlightCollection(highlightsCollection.highlightCollection, rootDiv);
}

start().catch((error) => console.error(error));
