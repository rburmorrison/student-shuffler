/* global Vue document */

// Imports
const { Menu, dialog } = require('electron').remote;
const fs = require('fs');

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
            if (!this.currentName.trim() || !this.currentEmail.trim()) return;

            // Create student and check if it already exists
            const student = {
                name: this.currentName.trim(),
                email: this.currentEmail.trim()
            };
            if (this.doesStudentExist(student)) return;

            // Add student
            this.students.push(student);

            // Clear inputs
            this.currentName = '';
            this.currentEmail = '';

            // Foucus on name input
            document.getElementById('nameInput').focus();
        },
        deleteStudent(index) {
            this.students.splice(index, 1);
        },
        shuffleStudents() {

        },
        doesStudentExist(student) {
            let exists = false;

            this.students.forEach((currentStudent) => {
                if (student.email === currentStudent.email)
                    exists = true;
            });

            return exists;
        }
    },
    mounted() {
        // Create menu
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Import',
                        accelerator: 'CommandOrControl+I',
                        click: () => {
                            dialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [{ name: 'Text', extensions: ['txt'] }]
                            }, (locs) => {
                                const loc = locs[0];

                                fs.readFile(loc, 'utf8', (err, data) => {
                                    const lines = data.split('\n');
                                    const cleanLines = [];

                                    // Find only clean lines
                                    for (var i = 0; i < lines.length; i++) {
                                        if (lines[i] !== '' && lines[i].match('.+;.+')) {
                                            // Push and remove any line breaks
                                            cleanLines.push(lines[i].replace(/\r|\n|\r\n/g, ''));
                                        }
                                    }

                                    // Add students
                                    cleanLines.forEach((cleanLine) => {
                                        const cleanArray = cleanLine.split(';');
                                        const name = cleanArray[0];
                                        const email = cleanArray[1];
                                        const student = { name, email };
                                        if (!this.doesStudentExist(student))
                                            this.students.push(student);
                                    });
                                });
                            });
                        }
                    }, // END IMPORT
                    {
                        label: 'Export',
                        accelerator: 'CommandOrControl+E',
                        click: () => {
                            if (this.students.length > 0) {
                                dialog.showSaveDialog({
                                    filters: [{ name: 'Text', extensions: ['txt'] }]
                                }, (filename) => {
                                    let fileOutput = '';

                                    this.students.forEach((student) => {
                                        fileOutput += student.name + ';' + student.email + '\r\n';
                                    });

                                    fs.writeFile(filename, fileOutput);
                                });
                            }
                        }
                    } // END EXPORT
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
                    { role: 'about' },
                    { role: 'quit' }
                ]
            });
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
});