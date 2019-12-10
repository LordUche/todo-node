const express = require('express');
const date = require(__dirname + '/date');
const app = express();

const todos = [];
const workList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('list', { listTitle: date.getDate(), todos });
});

app.post('/', (req, res) => {
  todos.push(req.body.newItem);
  res.redirect('/');
});

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', todos: workList });
});

app.post('/work', (req, res) => {
  workList.push(req.body.newItem);
  res.redirect('/work');
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
