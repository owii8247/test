const mongoose = require("mongoose")
const notesSchema = new mongoose.Schema({
    title: String,
    note: String,
    lable:String,
    userId:{type: String, required : true}
})

const NotesModel = mongoose.model("note", notesSchema)
module.exports = NotesModel