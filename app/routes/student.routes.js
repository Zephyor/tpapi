module.exports = app => {
    const students = require("../controllers/student.controller.js");

    // Create a new Student
    app.post("/students", students.create);

    // Retrieve all students
    app.get("/students", students.findAll);

    // Retrieve a single Student with studentId
    app.get("/students/:studentId", students.findOne);

    // Update a Student with studentId
    app.put("/students/:studentId", students.update);

    // Delete a Student with studentId
    app.delete("/students/:studentId", students.delete);

    // Create a new Student
    app.delete("/students", students.deleteAll);
};