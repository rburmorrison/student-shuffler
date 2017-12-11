/* global Vue document */

// Imports
const { Menu, dialog } = require('electron').remote;
const fs = require('fs');

// Disable file drop
require('electron-disable-file-drop');

new Vue({
    el: '#root',
    data: {
        showingAddStudent: false, // Show student input
        students: [],             // List of students
        currentName: '',          // Name input
        currentEmail: ''          // Email input
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
            if (this.students.length > 0) {
                dialog.showSaveDialog({
                    filters: [{ name: 'Text', extensions: ['txt'] }]
                }, (filename) => {
                    if (!filename) return;

                    const tempArray = this.students.splice();
                    const pairedArray = [];
                    let fileOutput = '';
                    let allPaired = false;

                    while (!allPaired) {
                        // Person 1: Get Random Index, Get Person, Delete Person
                        const person1Index = Math.floor(Math.random() * tempArray.length);
                        const person1 = tempArray[person1Index];
                        tempArray.splice(person1Index, 1);

                        // Person 2: Get Random Index, Get Person, Delete Person
                        if (tempArray.length > 0) {
                            const person2Index = Math.floor(Math.random() * tempArray.length);
                            const person2 = tempArray[person2Index];
                            tempArray.splice(person2Index, 1);

                            // Push both people
                            pairedArray.push([
                                person1, person2
                            ]);
                        } else {
                            // Add just the last person
                            pairedArray.push([
                                person1
                            ]);
                        }

                        // Check if there are any people left
                        if (tempArray.length === 0) {
                            allPaired = true;
                        }
                    }

                    // Create file contents
                    pairedArray.forEach((item) => {
                        if (item.length > 1) {
                            fileOutput += item[0].name + ' with ' + item[1].name + '\r\n';
                            fileOutput += '    ' + item[0].email + ' ; ' + item[1].email + '\r\n';
                            fileOutput += '\r\n';
                        } else {
                            fileOutput += 'Solo: ' + item[0].name + ' <' + item[0].email + '>\r\n';
                            fileOutput += '\r\n';
                        }
                    });

                    fs.writeFile(filename, fileOutput);
                });
            }
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
                                if (locs.length === 0) return; // Quit if canceled

                                // Grab first path
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
                                    if (!filename) return; // Quit if canceled

                                    let fileOutput = '';

                                    this.students.forEach((student) => {
                                        fileOutput += student.name + ';' + student.email + '\r\n';
                                    });

                                    fs.writeFile(filename, fileOutput);
                                });
                            }
                        }
                    }, // END EXPORT
                    { type: 'separator' },
                    {
                        label: 'Shuffle',
                        accelerator: 'CommandOrControl+S',
                        click: () => {
                            this.shuffleStudents();
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
                    { role: 'about' },
                    { role: 'quit' }
                ]
            });
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
});