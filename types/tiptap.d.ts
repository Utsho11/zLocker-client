import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    heading: {
      toggleHeading: (attributes: { level: number }) => ReturnType;
    };
  }
}
