// const express = require('express');
process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

let jam = {name : 'jam', price: 1.99}

beforeEach(() => {
    items.push(jam); 
})

afterEach(() => {
    items.length =0; 
})

describe('/GET items', () => {
    
    test('getting list of items', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([jam])
    })

    test('getting a specific item', async () => {
        const res =await request(app).get(`/items/${jam.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(jam);
    })

    test('item does not exist', async () => {
        const res =await request(app).get('/items/hello');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toEqual("item was not found");
    })

})

describe('/POST items', () => {
    
    test('adding an item', async () => {
        const res = await request(app)
            .post('/items')
            .send({name:"bread", price: 2.99});

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            added: {
                name:"bread", 
                price: 2.99
            }
        })
    })
})

describe('/PATCH items/:name', () => {
    
    test('updating an item', async () => {
        const res = await request(app)
            .patch(`/items/${jam.name}`)
            .send({name:"StrawberryJam", price: 2.99});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated: {
                name:"StrawberryJam", 
                price: 2.99
            }
        })
    })

    test('when item was not found', async () => {
        const res = await request(app)
        .patch(`/items/awefe`)
        .send({name:"StrawberryJam", price: 2.99});

        expect(res.statusCode).toBe(404)
    })
})

describe('/DELETE items/:name', () => {
    
    test('deleting an item', async () => {
        const res = await request(app)
            .delete(`/items/${jam.name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message:"Deleted"
        })
    })

    test('when item was not found', async () => {
        const res = await request(app)
        .delete(`/items/awefe`);

        expect(res.statusCode).toBe(404)
    })
})
