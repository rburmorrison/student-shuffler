/* global Vue */

// Disable file drop
require('electron-disable-file-drop');

new Vue({
    el: '#root',
    data: {
        showingAddStudent: false,
        students: []
    }
});