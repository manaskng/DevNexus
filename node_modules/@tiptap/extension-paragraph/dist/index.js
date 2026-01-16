// src/paragraph.ts
import { mergeAttributes, Node } from "@tiptap/core";
var Paragraph = Node.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  parseMarkdown: (token, helpers) => {
    const tokens = token.tokens || [];
    if (tokens.length === 1 && tokens[0].type === "image") {
      return helpers.parseChildren([tokens[0]]);
    }
    return helpers.createNode(
      "paragraph",
      void 0,
      // no attributes for paragraph
      helpers.parseInline(tokens)
    );
  },
  renderMarkdown: (node, h) => {
    if (!node || !Array.isArray(node.content)) {
      return "";
    }
    return h.renderChildren(node.content);
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.setNode(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});

// src/index.ts
var index_default = Paragraph;
export {
  Paragraph,
  index_default as default
};
//# sourceMappingURL=index.js.map