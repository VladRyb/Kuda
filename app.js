const express = require('express');
const path = require('path');
const useMiddleware = require('./middleware');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const postRouter = require('./routes/post');
const mapsRouter = require('./routes/maps');
const useErrorHandlers = require('./middleware/error-handlers');

const app = express();
useMiddleware(app);

app.use(express.static(path.join(__dirname, 'public')));

// Подключаем импортированные маршруты с определенным url префиксом.
//
//
//
//
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post-detals', postRouter);
app.use('/maps', mapsRouter);

useErrorHandlers(app);

module.exports = app;
