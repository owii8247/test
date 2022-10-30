const express = require("express")
const NotesModel = require("../models/Notes.model")
const notesRouter = express.Router()

// GET REQUEST

notesRouter.get("/:userId", async(req,res)=>{
    const userId = req.params.userId
    const notes = await NotesModel.find({userId})
    res.send(notes)
})

// POST REQUEST

notesRouter.post("/:userId/create", async(req, res)=>{
    const userId = req.params.userId
    const {title, note, label} = req.body
    const new_note = new NotesModel({
        title,note,label,userId
    })
    await new_note.save()
    res.send({message:"Note Successfully Created", new_note})
})

// PATCH REQUEST 

notesRouter.patch("/:userId/edit/:notesId", async(req,res)=>{
    const userId = req.params.userId
    const notesId = req.params.notesId
    const note = await NotesModel.findOne({_id:notesId})
    if(note.userId !== userId){
        return res.send("You are not authorised to do it")
    }
    const new_note = await NotesModel.findByIdAndUpdate(notesId, req.body)
    return res.send("Updated")
})

// DELETE REQUEST

notesRouter.delete("/:userId/delete/:notesId", async(req,res)=>{
    const userId = req.params.userId
    const notesId = req.params.notesId
    const note = await NotesModel.findOne({_id:notesId})
    if(note.userId !== userId){
        return res.send("You are not authorised to do it")
    }
    const new_note = await NotesModel.findByIdAndDelete(notesId)
    return res.send("Deleted")
})

module.exports = notesRouter