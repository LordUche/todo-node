const express = require('express');
const app = express();

const todos = [];
const workList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const day = today.toLocaleDateString('en-GB', options);

  res.render('list', { listTitle: day, todos });
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
