const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// In-memory database setup
const db = new sqlite3.Database(':memory:');

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Initialize the database and create a table
db.serialize(() => {
    db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, content TEXT)");
});

// List all posts
app.get('/posts', (req, res) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// Create a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(201).send({ id: this.lastID });
    });
});

// Delete an existing post
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM posts WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
