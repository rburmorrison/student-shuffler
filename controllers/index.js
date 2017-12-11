/* global Vue document */

// Imports
const { Menu, dialog } = require('electron').remote;

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
    },
    mounted() {
        // Create menu
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Open',
                        accelerator: 'CommandOrControl+O',
                        click: () => {
                            dialog.showOpenDialog({
                                
                            });
                        }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'selectall' }
                ]
            },
            {
                label: 'Debug',
                submenu: [
                    { role: 'toggledevtools' },
                    { role: 'reload' }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            template.unshift({
                submenu: [
                    { role: 'about' }
                ]
            });
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
});