// src/menus/BubbleMenu.tsx
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { jsx } from "react/jsx-runtime";
var BubbleMenu = React.forwardRef(
  ({
    pluginKey = "bubbleMenu",
    editor,
    updateDelay,
    resizeDelay,
    appendTo,
    shouldShow = null,
    getReferencedVirtualElement,
    options,
    children,
    ...restProps
  }, ref) => {
    const menuEl = useRef(document.createElement("div"));
    if (typeof ref === "function") {
      ref(menuEl.current);
    } else if (ref) {
      ref.current = menuEl.current;
    }
    const { editor: currentEditor } = useCurrentEditor();
    const pluginEditor = editor || currentEditor;
    const bubbleMenuPluginProps = {
      updateDelay,
      resizeDelay,
      appendTo,
      pluginKey,
      shouldShow,
      getReferencedVirtualElement,
      options
    };
    const bubbleMenuPluginPropsRef = useRef(bubbleMenuPluginProps);
    bubbleMenuPluginPropsRef.current = bubbleMenuPluginProps;
    useEffect(() => {
      if (pluginEditor == null ? void 0 : pluginEditor.isDestroyed) {
        return;
      }
      if (!pluginEditor) {
        console.warn("BubbleMenu component is not rendered inside of an editor component or does not have editor prop.");
        return;
      }
      const bubbleMenuElement = menuEl.current;
      bubbleMenuElement.style.visibility = "hidden";
      bubbleMenuElement.style.position = "absolute";
      const plugin = BubbleMenuPlugin({
        ...bubbleMenuPluginPropsRef.current,
        editor: pluginEditor,
        element: bubbleMenuElement
      });
      pluginEditor.registerPlugin(plugin);
      const createdPluginKey = bubbleMenuPluginPropsRef.current.pluginKey;
      return () => {
        pluginEditor.unregisterPlugin(createdPluginKey);
        window.requestAnimationFrame(() => {
          if (bubbleMenuElement.parentNode) {
            bubbleMenuElement.parentNode.removeChild(bubbleMenuElement);
          }
        });
      };
    }, [pluginEditor]);
    return createPortal(/* @__PURE__ */ jsx("div", { ...restProps, children }), menuEl.current);
  }
);

// src/menus/FloatingMenu.tsx
import { FloatingMenuPlugin } from "@tiptap/extension-floating-menu";
import { useCurrentEditor as useCurrentEditor2 } from "@tiptap/react";
import React2, { useEffect as useEffect2, useRef as useRef2 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { jsx as jsx2 } from "react/jsx-runtime";
var FloatingMenu = React2.forwardRef(
  ({ pluginKey = "floatingMenu", editor, appendTo, shouldShow = null, options, children, ...restProps }, ref) => {
    const menuEl = useRef2(document.createElement("div"));
    if (typeof ref === "function") {
      ref(menuEl.current);
    } else if (ref) {
      ref.current = menuEl.current;
    }
    const { editor: currentEditor } = useCurrentEditor2();
    useEffect2(() => {
      const floatingMenuElement = menuEl.current;
      floatingMenuElement.style.visibility = "hidden";
      floatingMenuElement.style.position = "absolute";
      if ((editor == null ? void 0 : editor.isDestroyed) || (currentEditor == null ? void 0 : currentEditor.isDestroyed)) {
        return;
      }
      const attachToEditor = editor || currentEditor;
      if (!attachToEditor) {
        console.warn(
          "FloatingMenu component is not rendered inside of an editor component or does not have editor prop."
        );
        return;
      }
      const plugin = FloatingMenuPlugin({
        editor: attachToEditor,
        element: floatingMenuElement,
        pluginKey,
        appendTo,
        shouldShow,
        options
      });
      attachToEditor.registerPlugin(plugin);
      return () => {
        attachToEditor.unregisterPlugin(pluginKey);
        window.requestAnimationFrame(() => {
          if (floatingMenuElement.parentNode) {
            floatingMenuElement.parentNode.removeChild(floatingMenuElement);
          }
        });
      };
    }, [editor, currentEditor, appendTo, pluginKey, shouldShow, options]);
    return createPortal2(/* @__PURE__ */ jsx2("div", { ...restProps, children }), menuEl.current);
  }
);
export {
  BubbleMenu,
  FloatingMenu
};
//# sourceMappingURL=index.js.map