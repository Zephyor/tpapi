const Note = require("../models/note.model.js");

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save Note in the database
  Note.create(req.params.studentId, req.body.marksArray, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Note."
      });
    else res.send(data);
  });
};

// Retrieve all Notes from the database.
exports.findAll = (req, res) => {
  Note.getAll(req.params.studentId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notes."
      });
    else res.send(data);
  });
};

// Find a single Note with a node_Id
exports.findOne = (req, res) => {
  Note.findById(req.params.studentId, req.params.noteId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Note with id ${req.params.noteId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Note with id " + req.params.noteId
        });
      }
    } else res.send(data);
  });
};

// Update a Note identified by the note_id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Note.updateById(
    req.params.studentId,
    req.params.noteId,
    new Note(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Note with id ${req.params.noteId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Note with id " + req.params.noteId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Note with the specified note_id in the request
exports.delete = (req, res) => {
  Note.remove(req.params.studentId, req.params.noteId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Note with id ${req.params.noteId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Note with id " + req.params.noteId
        });
      }
    } else res.send({ message: `Note was deleted successfully!` });
  });
};

// Delete all Notes from the database.
exports.deleteAll = (req, res) => {
  Note.removeAll(req.params.studentId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all students."
      });
    else res.send({ message: `All Notes were deleted successfully!` });
  });
};

