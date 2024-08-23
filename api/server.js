const express = require("express");

const Movies = require("./movies/movies-model");  

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" })
})

server.get("/movies", (req, res) => {
    Movies.getAll()
        .then(movies => {
            res.status(200).json(movies)
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to retrieve movies." })
        })
})

server.get("/movies/:id", (req, res) => {
    const { id } = req.params

    Movies.getById(id)
        .then(movie => {
            if (movie) {
                res.status(200).json(movie)
            } else {
                res.status(404).json({ message: `Movie with id ${id} not found.` })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to retrieve movie." })
        })
})

server.post("/movies", async (req, res) => {
    try {
        const movie = await Movies.insert(req.body)
        res.status(201).json(movie)
    } catch (error) {
        res.status(500).json({ message: "Failed to add movie." })
    }
});

server.delete("/movies/:id", async (req, res) => {
    const { id } = req.params

    try {
        const deletedId = await Movies.remove(id)

        if (deletedId) {
            res.status(200).json({ message: `Movie with id ${id} was deleted.` })
        } else {
            res.status(404).json({ message: `Movie with id ${id} not found.` })
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete movie." })
    }
})

server.put("/movies/:id", async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        const updatedMovie = await Movies.update(id, changes)

        if (updatedMovie) {
            res.status(200).json(updatedMovie)
        } else {
            res.status(404).json({ message: `Movie with id ${id} not found.` })
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update movie." })
    }
})

module.exports = server;
