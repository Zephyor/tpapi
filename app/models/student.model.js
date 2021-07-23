const sql = require("./db.js");

const Student = function (student) {
    this.email = student.email;
    this.name = student.name;
    this.exam_passed = false;
};

Student.create = (newStudent, result) => {
    sql.query("INSERT INTO students SET ?", newStudent, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created student: ", { id: res.insertId, ...newStudent });
        result(null, { id: res.insertId, ...newStudent });
    });
};

Student.findById = (studentId, result) => {
    sql.query(`SELECT * FROM students WHERE id = ${studentId}`, (err, resParent) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (resParent.length) {
            console.log("found student: ", resParent[0]);

            sql.query(`SELECT * FROM notes WHERE student_id = ${studentId}`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }

                const marksArray = res.map((result) => result.mark)
                const avg = marksArray.reduce((a, b) => a + b) / marksArray.length;
                result(null, { ...resParent[0], averageMark: avg });

            });

            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Student.getAll = result => {
    sql.query("SELECT * FROM students", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("students: ", res);
        result(null, res);
    });
};

Student.updateById = (id, student, result) => {
    sql.query(
        "UPDATE students SET email = ?, name = ?, exam_passed = ? WHERE id = ?",
        [student.email, student.name, student.exam_passed, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated student: ", { id: id, ...student });
            result(null, { id: id, ...student });
        }
    );
};

Student.remove = (id, result) => {
    sql.query("DELETE FROM students WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted student with id: ", id);
        result(null, res);
    });
};

Student.removeAll = result => {
    sql.query("DELETE FROM students", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} students`);
        result(null, res);
    });
};

module.exports = Student;