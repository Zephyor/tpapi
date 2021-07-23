const sql = require("./db.js");

const Note = function (note) {
    this.note_id = note.note_id;
    this.student_id = note.student_id;
    this.mark = note.mark;
};

Note.create = (studentId, marksArray, result) => {
    const notesInDbArray = marksArray.map((mark) => {
        return [
            studentId,
            mark
        ]
    })

    sql.query("INSERT INTO notes (student_id, mark) VALUES ?", [notesInDbArray], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created notes: ", { affectedRows: res.affectedRows });
    });

    sql.query(`SELECT * FROM notes WHERE student_id = ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        const marksArray = res.map((result) => result.mark)
        const avg = marksArray.reduce((a, b) => a + b) / marksArray.length;

            sql.query(
                "UPDATE students SET exam_passed = ? WHERE id = ?",
                [avg > 12, studentId],
                (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    }
                }
            );

            result(null, { averageMark: avg, message: "Student edit"});
    });
};

Note.findById = (studentId, noteId, result) => {
    sql.query(`SELECT * FROM notes WHERE note_id = ${noteId} AND student_id ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found note: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Note.getAll = (studentId, result) => {
    sql.query(`SELECT * FROM notes WHERE student_id = ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("notes: ", res);
        result(null, res);
    });
};

Note.updateById = (studentId, noteId, note, result) => {
    sql.query(
        "UPDATE notes SET note_id = ?, student_id = ?, mark = ? WHERE note_id = ? AND student_id = ?",
        [note.note_id, studentId, note.mark, note.note_id, studentId],
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

            console.log("updated note: ", { note_id: note_id, student_id: studentId, ...note });
            result(null, { note_id: note_id, student_id: studentId, ...note });
        }
    );
};

Note.remove = (studentId, noteId, result) => {
    sql.query("DELETE FROM notes WHERE note_id = ? AND student_id = ?", [noteId, studentId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted note with id: ", id);
        result(null, res);
    });
};

Note.removeAll = (studentId, result) => {
    sql.query(`DELETE FROM notes WHERE student_id = ${studentId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} notes`);
        result(null, res);
    });
};

module.exports = Note;