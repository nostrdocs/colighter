"use strict";
exports.__esModule = true;
exports.StorageKey = exports.MessageAction = exports.HighlightCollectionUpdate = void 0;
exports.HighlightCollectionUpdate = 'HighlightCollectionUpdate';
var MessageAction;
(function (MessageAction) {
    MessageAction["TOGGLE_HIGHLIGHTS"] = "TOGGLE_HIGHLIGHTS";
    MessageAction["REMOVE_HIGHLIGHTS"] = "REMOVE_HIGHLIGHTS";
    MessageAction["RENDER_HIGHLIGHTS"] = "RENDER_HIGHLIGHTS";
    MessageAction["SELECT_COLOR"] = "SELECT_COLOR";
    MessageAction["LOAD_COLLAB"] = "LOAD_COLLAB";
    MessageAction["GET_COLLAB_HIGHLIGHTS"] = "GET_COLLAB_HIGHLIGHTS";
    MessageAction["POST_COLLAB_HIGHLIGHTS"] = "POST_COLLAB_HIGHLIGHTS";
})(MessageAction = exports.MessageAction || (exports.MessageAction = {}));
var StorageKey;
(function (StorageKey) {
    StorageKey["SHOW_HIGHLIGHTS"] = "SHOW_HIGHLIGHTS";
    StorageKey["HIGHLIGHTING_COLOR"] = "HIGHLIGHTING_COLOR";
    StorageKey["COLOR_SELECTION"] = "COLOR_SELECTION";
    StorageKey["COLLAB_ID"] = "COLLAB_ID";
    StorageKey["COLLAB_HIGHLIGHTS"] = "COLLAB_HIGHLIGHTS";
})(StorageKey = exports.StorageKey || (exports.StorageKey = {}));
