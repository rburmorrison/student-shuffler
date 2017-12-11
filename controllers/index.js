/* global Vue document */

// Disable file drop
require('electron-disable-file-drop');

new Vue({
    el: '#root',
    data: {
        showingAddStudent: true,
        students: [],
        currentName: '',
        currentEmail: ''
    },
    methods: {
        addStudent() {
            // Quit if inputs are not filled in
            if (!this.currentName || !this.currentEmail) return;

            // Add student
            this.students.push({
                name: this.currentName,
                email: this.currentEmail
            });

            // Clear inputs
            this.currentName = '';
            this.currentEmail = '';

            // Foucus on name input
            document.getElementById('nameInput').focus();
        },
        deleteStudent(index) {
            this.students.splice(index, 1);
        }
    }
});