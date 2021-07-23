module.exports = app => {
    const notes = require("../controllers/note.controller.js");

    // Create a new Student
    app.post("/students/:studentId/notes", notes.create);

    // Retrieve all students
    app.get("/students/:studentId/notes", notes.findAll);

    // Retrieve a single Student with studentId
    app.get("/students/:studentId/notes/:noteId", notes.findOne);

    // Update a Student with studentId
    app.put("/students/:studentId/notes/:noteId", notes.update);

    // Delete a Student with studentId
    app.delete("/students/:studentId/notes/:noteId", notes.delete);

    // Create a new Student
    app.delete("/students/:studentId/notes", notes.deleteAll);
};