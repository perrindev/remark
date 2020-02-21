/*
Copyright 2018, 2019 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const { ipcRenderer } = require('electron');
const { SpellCheckHandler, ContextMenuBuilder } = require('electron-spellchecker');

// expose ipcRenderer to the renderer process
window.ipcRenderer = ipcRenderer;

class RemarkContextMenuBuilder extends ContextMenuBuilder {
    addInspectElement (menu) {
        return menu;
    }
};

try {
    window.spellCheckHandler = new SpellCheckHandler();

    // this seems to be required
    window.spellCheckHandler.provideHintText(
        'This is probably the language that you want to check in'
    );
    window.spellCheckHandler.autoUnloadDictionariesOnBlur();

    window.contextMenuBuilder = new RemarkContextMenuBuilder(
        window.spellCheckHandler,
        null,
        true
    );
} catch (e) {
    console.error(e);
}

// good
ipcRenderer.on('dom-loaded', (ev, params) => {
    if (window.spellCheckHandler) {
        window.spellCheckHandler.attachToInput();
    }
});

// good
ipcRenderer.on('context-menu-open', (ev, params) => {
    if (window.contextMenuBuilder) {
        window.contextMenuBuilder.showPopupMenu(params);
    }
});