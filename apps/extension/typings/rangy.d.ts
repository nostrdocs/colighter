interface Highlighter {
  addClassApplier(applier: unknown);
  highlightSelection(
    className: string,
    options?: { selection: RangySelection }
  );
  unhighlightSelection(selection?: RangySelection);
  serialize(options?: {}): string;
  deserialize(serialized: string): void;
  removeAllHighlights();
  serialize(selection: RangySelection);
}

interface RangyStatic {
  createHighlighter(document?: Document, type?: string): Highlighter;
  createClassApplier(className: string);
}
