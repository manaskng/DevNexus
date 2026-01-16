// src/floating-menu.ts
import { Extension } from "@tiptap/core";

// src/floating-menu-plugin.ts
import {
  arrow,
  autoPlacement,
  computePosition,
  flip,
  hide,
  inline,
  offset,
  shift,
  size
} from "@floating-ui/dom";
import { getText, getTextSerializersFromSchema, posToDOMRect } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
var FloatingMenuView = class {
  constructor({ editor, element, view, options, appendTo, shouldShow }) {
    this.preventHide = false;
    this.isVisible = false;
    this.shouldShow = ({ view, state }) => {
      const { selection } = state;
      const { $anchor, empty } = selection;
      const isRootDepth = $anchor.depth === 1;
      const isEmptyTextBlock = $anchor.parent.isTextblock && !$anchor.parent.type.spec.code && !$anchor.parent.textContent && $anchor.parent.childCount === 0 && !this.getTextContent($anchor.parent);
      if (!view.hasFocus() || !empty || !isRootDepth || !isEmptyTextBlock || !this.editor.isEditable) {
        return false;
      }
      return true;
    };
    this.floatingUIOptions = {
      strategy: "absolute",
      placement: "right",
      offset: 8,
      flip: {},
      shift: {},
      arrow: false,
      size: false,
      autoPlacement: false,
      hide: false,
      inline: false
    };
    this.updateHandler = (view, selectionChanged, docChanged, oldState) => {
      const { composing } = view;
      const isSame = !selectionChanged && !docChanged;
      if (composing || isSame) {
        return;
      }
      const shouldShow = this.getShouldShow(oldState);
      if (!shouldShow) {
        this.hide();
        return;
      }
      this.updatePosition();
      this.show();
    };
    this.mousedownHandler = () => {
      this.preventHide = true;
    };
    this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    };
    this.blurHandler = ({ event }) => {
      var _a;
      if (this.preventHide) {
        this.preventHide = false;
        return;
      }
      if ((event == null ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) == null ? void 0 : _a.contains(event.relatedTarget))) {
        return;
      }
      if ((event == null ? void 0 : event.relatedTarget) === this.editor.view.dom) {
        return;
      }
      this.hide();
    };
    this.editor = editor;
    this.element = element;
    this.view = view;
    this.appendTo = appendTo;
    this.floatingUIOptions = {
      ...this.floatingUIOptions,
      ...options
    };
    this.element.tabIndex = 0;
    if (shouldShow) {
      this.shouldShow = shouldShow;
    }
    this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.update(view, view.state);
    if (this.getShouldShow()) {
      this.show();
      this.updatePosition();
    }
  }
  getTextContent(node) {
    return getText(node, { textSerializers: getTextSerializersFromSchema(this.editor.schema) });
  }
  get middlewares() {
    const middlewares = [];
    if (this.floatingUIOptions.flip) {
      middlewares.push(flip(typeof this.floatingUIOptions.flip !== "boolean" ? this.floatingUIOptions.flip : void 0));
    }
    if (this.floatingUIOptions.shift) {
      middlewares.push(
        shift(typeof this.floatingUIOptions.shift !== "boolean" ? this.floatingUIOptions.shift : void 0)
      );
    }
    if (this.floatingUIOptions.offset) {
      middlewares.push(
        offset(typeof this.floatingUIOptions.offset !== "boolean" ? this.floatingUIOptions.offset : void 0)
      );
    }
    if (this.floatingUIOptions.arrow) {
      middlewares.push(arrow(this.floatingUIOptions.arrow));
    }
    if (this.floatingUIOptions.size) {
      middlewares.push(size(typeof this.floatingUIOptions.size !== "boolean" ? this.floatingUIOptions.size : void 0));
    }
    if (this.floatingUIOptions.autoPlacement) {
      middlewares.push(
        autoPlacement(
          typeof this.floatingUIOptions.autoPlacement !== "boolean" ? this.floatingUIOptions.autoPlacement : void 0
        )
      );
    }
    if (this.floatingUIOptions.hide) {
      middlewares.push(hide(typeof this.floatingUIOptions.hide !== "boolean" ? this.floatingUIOptions.hide : void 0));
    }
    if (this.floatingUIOptions.inline) {
      middlewares.push(
        inline(typeof this.floatingUIOptions.inline !== "boolean" ? this.floatingUIOptions.inline : void 0)
      );
    }
    return middlewares;
  }
  getShouldShow(oldState) {
    var _a;
    const { state } = this.view;
    const { selection } = state;
    const { ranges } = selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));
    const shouldShow = (_a = this.shouldShow) == null ? void 0 : _a.call(this, {
      editor: this.editor,
      view: this.view,
      state,
      oldState,
      from,
      to
    });
    return shouldShow;
  }
  updatePosition() {
    const { selection } = this.editor.state;
    const domRect = posToDOMRect(this.view, selection.from, selection.to);
    const virtualElement = {
      getBoundingClientRect: () => domRect,
      getClientRects: () => [domRect]
    };
    computePosition(virtualElement, this.element, {
      placement: this.floatingUIOptions.placement,
      strategy: this.floatingUIOptions.strategy,
      middleware: this.middlewares
    }).then(({ x, y, strategy }) => {
      this.element.style.width = "max-content";
      this.element.style.position = strategy;
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
      if (this.isVisible && this.floatingUIOptions.onUpdate) {
        this.floatingUIOptions.onUpdate();
      }
    });
  }
  update(view, oldState) {
    const selectionChanged = !(oldState == null ? void 0 : oldState.selection.eq(view.state.selection));
    const docChanged = !(oldState == null ? void 0 : oldState.doc.eq(view.state.doc));
    this.updateHandler(view, selectionChanged, docChanged, oldState);
  }
  show() {
    var _a;
    if (this.isVisible) {
      return;
    }
    this.element.style.visibility = "visible";
    this.element.style.opacity = "1";
    const appendToElement = typeof this.appendTo === "function" ? this.appendTo() : this.appendTo;
    (_a = appendToElement != null ? appendToElement : this.view.dom.parentElement) == null ? void 0 : _a.appendChild(this.element);
    if (this.floatingUIOptions.onShow) {
      this.floatingUIOptions.onShow();
    }
    this.isVisible = true;
  }
  hide() {
    if (!this.isVisible) {
      return;
    }
    this.element.style.visibility = "hidden";
    this.element.style.opacity = "0";
    this.element.remove();
    if (this.floatingUIOptions.onHide) {
      this.floatingUIOptions.onHide();
    }
    this.isVisible = false;
  }
  destroy() {
    this.hide();
    this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
    if (this.floatingUIOptions.onDestroy) {
      this.floatingUIOptions.onDestroy();
    }
  }
};
var FloatingMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new FloatingMenuView({ view, ...options })
  });
};

// src/floating-menu.ts
var FloatingMenu = Extension.create({
  name: "floatingMenu",
  addOptions() {
    return {
      element: null,
      options: {},
      pluginKey: "floatingMenu",
      appendTo: void 0,
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }
    return [
      FloatingMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        options: this.options.options,
        appendTo: this.options.appendTo,
        shouldShow: this.options.shouldShow
      })
    ];
  }
});

// src/index.ts
var index_default = FloatingMenu;
export {
  FloatingMenu,
  FloatingMenuPlugin,
  FloatingMenuView,
  index_default as default
};
//# sourceMappingURL=index.js.map