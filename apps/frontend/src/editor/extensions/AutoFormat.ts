import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const AutoFormat = Extension.create({
  name: 'autoFormat',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('autoFormat'),
        props: {
          handleKeyDown(view, event) {
            if (event.key === 'Enter') {
              const { state } = view;
              const {  } = state.selection;
              const node = .nodeBefore;

              if (node && node.type.name === 'sceneHeading') {
                view.dispatch(state.tr.setBlockType(state.selection.from, state.selection.to, view.state.schema.nodes.action));
                return true;
              }
              // Add other rules here
            }
            return false;
          },
        },
      }),
    ];
  },
});
