const express = require('express');
const app = express();
const shoppingRoutes = require('./routes/shoppingList')
const ExpressError = require('./errorHandling');
const morgan = require('morgan');

app.use(express.json());

app.use(morgan('dev'));

app.use('/items', shoppingRoutes)


/** 404 handler */
app.use((req, res, next) => {
    const NotFound = new ExpressError('Not Found', 404)
    next(NotFound);
});


/** global errorhandler **/
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;
    console.log(error);

    return res.status(status).json({
        error: message,
        status: status
    })
})

// app.listen(3000, ()=>{
//     console.log("server starting on port 3000");
// })


module.exports = app;