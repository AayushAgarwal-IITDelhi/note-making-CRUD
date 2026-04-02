const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const admin = process.env.ADMIN;

// SIGNUP
const signup = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser) return res.status(400).json({error: "User already exists."});

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        password: hashed
    });

    await user.save();

    res.json({ message: "User created" });
};

// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
        { userId: user._id },
        SECRET
    );

    res.json({token});
};

// DELETE
const deleteUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(404).json({ error: "Wrong password" });
    }

    const blah = await User.findByIdAndDelete(user._id);

    if(!blah) {return res.json({message:"unsuccessful"});};

    res.json({message:"Deleted"});
};

// listUsers
const listUser = async (req, res) => {
    const token = req.headers.authorization;
    if(token!=admin) return res.status(400).json({error:"Contact admin"});
    const users = await User.find();
    res.json(users);
};

module.exports = {signup, login, deleteUser, listUser };