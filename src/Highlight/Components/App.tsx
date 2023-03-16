import React, { useEffect } from "react";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import {
  StaticCodeLoader,
  NostrCollabLoader,
  createNostrCreateNewRequest,
  NostrRelayUrlResolver,
  NostrRelayTokenProvider,
} from "../../Nostrcollab";
import {
  renderHighlightCollection,
  IHighlightCollectionAppModel,
  HighlightContainerRuntimeFactory,
} from "../index";

interface Props {
  author: string;
}

function App({ author }: Props) {
  useEffect(() => {
    const loadCollabHighlighter = async (pane: HTMLElement) => {
      const tokenProvider = new NostrRelayTokenProvider();

      // Create a new Fluid loader, load the highlight collection
      const loader = new NostrCollabLoader<IHighlightCollectionAppModel>({
        urlResolver: new NostrRelayUrlResolver(),
        documentServiceFactory: new RouterliciousDocumentServiceFactory(tokenProvider),
        codeLoader: new StaticCodeLoader(new HighlightContainerRuntimeFactory()),
        generateCreateNewRequest: createNostrCreateNewRequest,
      });

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

      renderHighlightCollection(highlightsCollection.highlightCollection, pane, author);
    };

    // Load Collab highlighter on the LEFT pane
    const left = document.getElementById("left-hltr");
    left && loadCollabHighlighter(left);

    // Load Collab highlighter on the RIGHT pane
    const right = document.getElementById("right-hltr");
    right && loadCollabHighlighter(right);
  }, [author]);

  return (
    <div>
      <div id="left-hltr"></div>
      <div id="right-hltr"></div>
    </div>
  );
}

export default App;
