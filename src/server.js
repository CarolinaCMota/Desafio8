const { hash } = require("bcryptjs");
const express = require("express");
const database = require("./database/sqlite");
const migrationsRun = require("./database/sqlite/migrations");


database();
migrationsRun();


const app = express();
app.use(express.json());

app.get("/", (request, response) => {
    response.send("Hello, word")
});

app.post("/usuario", async (request, response) => {
    const db = await database();

    const checkUserExists = await db.get("SELECT * FROM users WHERE email = (?)", [request.body.email])
    if (checkUserExists) {
        return response.status(409).json("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(request.body.password, 8)

    await db.run(
        "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)",
        [request.body.name, request.body.email, hashedPassword, request.body.avatar]
    );
    return response.status(201).json();

})

app.post("/notes", async (request, response) => {
    const db = await database();
    await db.run(
        "INSERT INTO notes (user_id, title, description, rating) VALUES (?, ?, ?, ?)",
        [request.body.userId, request.body.title, request.body.description, request.body.rating]
    );
    return response.status(201).json();
})

app.post("/tags", async (request, response) => {
    const db = await database();
    await db.run(
        "INSERT INTO tags (note_id, user_id, name) VALUES (?, ?, ?)",
        [request.body.noteId, request.body.userId, request.body.name,]
    );
    return response.status(201).json();
})

app.delete("/notes/:id", async (request, response) => {
    const db = await database()
    await db.run(
        "DELETE FROM notes WHERE id = ?",
        [request.params.id]
    );
    return response.status(201).json();
});


const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))


