let express = require('express');
let app = express();

let todos = [];

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const day = today.toLocaleDateString('en-GB', options);

  res.render('list', { day, todos });
});

app.post('/', (req, res) => {
  todos.push(req.body.newItem);
  res.redirect('/');
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
