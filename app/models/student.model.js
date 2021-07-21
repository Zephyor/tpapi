const sql = require("./db.js");

const Student = function (student) {
    this.email = student.email;
    this.name = student.name;
    this.note = student.note;
    this.is_smart = student.is_smart;
};

Student.create = (newStudent, result) => {
    if (newStudent.note > 20 || newStudent.note < 0) {
        result(null, { message: "Note non comprise dans l'intervalle 0-20" });
        return;
    }

    const markedStudent = {
        ...newStudent,
        is_smart: newStudent.note >= 15
    }

    sql.query("INSERT INTO students SET ?", markedStudent, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created student: ", { id: res.insertId, ...markedStudent });
        result(null, { id: res.insertId, ...markedStudent });
    });
};

Student.findById = (studentId, result) => {
    sql.query(`SELECT * FROM students WHERE id = ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found student: ", res[0]);
            result(null, res[0]);
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
    if (student.note > 20 || student.note < 0)  {
        result(null, { message: "Note non comprise dans l'intervalle 0-20" });
        return;
    }

    const markedStudent = {
        ...student,
        is_smart: student.note >= 15
    }

    sql.query(
        "UPDATE students SET email = ?, name = ?, note = ?, is_smart = ? WHERE id = ?",
        [markedStudent.email, markedStudent.name, markedStudent.note, markedStudent.is_smart, id],
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

            console.log("updated student: ", { id: id, ...markedStudent });
            result(null, { id: id, ...markedStudent });
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