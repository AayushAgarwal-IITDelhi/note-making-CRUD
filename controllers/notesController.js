const Note = require("../models/Note");

const getNotes = async (req,res) => {
    const notes = await Note.find({user:req.userId});
    res.json(notes);
};

const createNote = async (req,res) => {
    const{title,content}= req.body;
    if(!title || !content) {return res.status(400).json({error: "Missing data"}); };
    const note = new Note({ title, content, user: req.userId });
    await note.save();
    res.json(note);
};

const deleteNote = async (req,res) => {
    const id = req.params.id;
    const note = await Note.findOneAndDelete({_id:id, user:req.userId});
    if (!note) {return res.status(400).json({error: "Invalid ID"});};
    res.json({message:"Deleted"});
}

const updateNote = async (req,res) => {
    const id = req.params.id;
    const {title,content} = req.body;

    if (!title && !content) return res.status(400).json({error:"Missing content"});

    const updatedNote = await Note.findOneAndUpdate(
        {_id:id, user: req.userId},
        {...(title && {title}), ...(content && {content})},
        {new: true}
    );

    if (!updatedNote) return res.status(404).json({error:'Fuck ho gya'});

    res.json({message: "success", updatedNote})
}

module.exports = {getNotes, createNote, deleteNote, updateNote};