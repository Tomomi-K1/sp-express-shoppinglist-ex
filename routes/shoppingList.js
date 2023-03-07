const express = require('express');
const router = new express.Router();
const ExpressError = require('../errorHandling');
const items = require('../fakeDb');

// Your application should have the following routes:

// GET /items - this should render a list of shopping items.
// Here is what a response looks like:
// [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
router.get('/', (req, res) => {
        return res.json(items);     
});

// GET /items/:name - this route should display a single item’s name and price.
// Here is what a sample response looks like:
// {“name”: “popsicle”, “price”: 1.45}

router.get('/:name', (req, res, next) => {
    try{    
        const foundItem = items.find(a => a.name === req.params.name); 
        if(foundItem === undefined) throw new ExpressError("item was not found", 404);
        //=> why does this show as 500 on insomunia
        return res.json(foundItem);
    } catch (e){
        next(e);
    }
})

// POST /items - this route should accept JSON data and add it to the shopping list. // Here is what a sample request/response looks like:
// {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}

router.post('/', (req, res, next) => {
    try{
        if(!req.body.name) throw new ExpressError("please enter name of product", 400);
        if(!req.body.price) throw new ExpressError("please enter the price", 400);
        const newItem ={name: req.body.name, price: req.body.price};
        items.push(newItem)
        return res.status(201).json({
            added: newItem
        });
    } catch(e){
        next(e);
    }
})

// PATCH /items/:name, this route should modify a single item’s name and/or price.
// Here is what a sample request/response looks like:
// {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}
router.patch('/:name', (req,res,next) => {
    try{
        const foundItem =items.find(a=>a.name === req.params.name);
        if(!foundItem) throw new ExpressError('Item not found', 404)
        foundItem.name = req.body.name;
        foundItem.price = req.body.price;
        return res.json({
            updated: foundItem
        })
    } catch(e){
        next(e);
    }
})
// DELETE /items/:name - this route should allow you to delete a specific item from the array.
// Here is what a sample response looks like:
// {message: “Deleted”}

router.delete('/:name', (req, res, next) => {
    try{
        const foundItem =items.find(a=>a.name === req.params.name);
        if(!foundItem) throw new ExpressError('Item not found', 404);
        items.pop(foundItem);
        return res.json({
            message: "Deleted"
        })
    } catch(e){
        next(e)
    }
})




module.exports = router;