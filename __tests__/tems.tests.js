const request = require('supertest');
const server = require('../api/server');
const db = require('../data/db-config');

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
    await db.seed.run()
})

beforeEach(async () => {
    await db('movies').truncate()
})

afterAll(async () => {
    await db.destroy()
})

describe('Movies API', () => {

    // Test 1: GET /
    it('should return a status of 200 for the root endpoint', async () => {
        const res = await request(server).get('/');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ api: "up" });
    });

    // Test 2: GET /movies
    it('should return an empty array if no movies exist', async () => {
        const res = await request(server).get('/movies');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    // Test 3: POST /movies
    it('should create a new movie and return it', async () => {
        const newMovie = { movie_title: 'Inception' };
        const res = await request(server).post('/movies').send(newMovie);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(newMovie);
    });

    // Test 4: GET /movies/:id
    it('should return a movie by id', async () => {
        const movie = await db('movies').insert({ movie_title: 'The Matrix' }, ['id']);
        const res = await request(server).get(`/movies/${movie[0].id}`);
        expect(res.status).toBe(200);
        expect(res.body.movie_title).toBe('The Matrix');
    });

    // Test 5: GET /movies/:id (non-existent)
    it('should return 404 if the movie does not exist', async () => {
        const res = await request(server).get('/movies/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Movie with id 999 not found.' });
    });

    // Test 6: PUT /movies/:id
    it('should update a movie and return the updated movie', async () => {
        const movie = await db('movies').insert({ movie_title: 'Avatar' }, ['id']);
        const res = await request(server).put(`/movies/${movie[0].id}`).send({ movie_title: 'Avatar: The Last Airbender' });
        expect(res.status).toBe(200);
        expect(res.body.movie_title).toBe('Avatar: The Last Airbender');
    });

    // Test 7: PUT /movies/:id (non-existent)
    it('should return 404 if trying to update a non-existent movie', async () => {
        const res = await request(server).put('/movies/999').send({ movie_title: 'Non-existent' });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Movie with id 999 not found.' });
    });

    // Test 8: DELETE /movies/:id
    it('should delete a movie and return a message', async () => {
        const movie = await db('movies').insert({ movie_title: 'Titanic' }, ['id']);
        const res = await request(server).delete(`/movies/${movie[0].id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: `Movie with id ${movie[0].id} was deleted.` });
    });

    // Test 9: DELETE /movies/:id (non-existent)
    it('should return 404 if trying to delete a non-existent movie', async () => {
        const res = await request(server).delete('/movies/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Movie with id 999 not found.' });
    });

    // Test 10: GET /movies (after adding a movie)
    it('should return an array with one movie', async () => {
        await db('movies').insert({ movie_title: 'Interstellar' });
        const res = await request(server).get('/movies');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].movie_title).toBe('Interstellar');
    });
});

