const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require("body-parser")

const app = express()
const db = new sqlite3.Database("portal.db")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `)

    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row && row.count === 0) {
            db.run(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                ["admin", "admin123"]
            )

            db.run(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                ["employee", "password"]
            )
        }
    })
})


app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    // FIX: Use placeholders (?) instead of string concatenation
    const query = "SELECT * FROM users WHERE username = ? AND password = ?"

    console.log("\nExecuting Secure SQL Query")
    
    // FIX: Pass user input as an array in the second argument of db.all()
    db.all(query, [username, password], (err, rows) => {
        if (err) {
            console.error("Database error:", err)
            return res.status(500).send("Database error")
        }

        if (rows && rows.length > 0) {
            res.send("Login success")
        } else {
            res.send("Login failed")
        }
    })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})
