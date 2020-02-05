const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

const todos = require('./controller/todos.controller');
const users = require('./controller/users.controller');

const {authenticate} = require('./middleware/index');

app.use(bodyParser.json());

app.post('/todos', todos.create);

app.patch('/todos/:id', todos.modify);

app.get('/todo', todos.getAllTodos);

app.get('/todos/:id', todos.getById);

app.delete('/todos/:id', todos.delete);

app.post('/users', users.create);

app.get('/user/me', authenticate, users.getUser);

app.post('/user/authenticate', users.authenticateUser, users.getAuthenticatedUser);

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
