const express = require('express')
const Database = require('better-sqlite3')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())

// creates a file called posts.db in your project folder
const db = new Database('posts.db')

// runs once on startup — creates the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT NOT NULL,
    author  TEXT NOT NULL
  )
`)

// GET all posts
app.get('/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts').all()
  res.json(posts)
})

// GET one post
app.get('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  res.json(post)
})

// CREATE a post
app.post('/posts', (req, res) => {
  const { title, author } = req.body

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' })
  }

  const result = db.prepare('INSERT INTO posts (title, author) VALUES (?, ?)').run(title, author)
  const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(newPost)
})

// UPDATE a post
app.put('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const title = req.body.title || post.title
  const author = req.body.author || post.author

  db.prepare('UPDATE posts SET title = ?, author = ? WHERE id = ?').run(title, author, req.params.id)
  const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  res.json(updatedPost)
})

// DELETE a post
app.delete('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)

  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  res.json({ message: 'Post deleted' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
