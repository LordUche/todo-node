const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const app = express();

mongoose
  .connect('mongodb://localhost/todoListDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connected to database.'));

const itemSchema = new mongoose.Schema({ name: { type: String, required: true } });
const Item = mongoose.model('Item', itemSchema);
const item1 = new Item({ name: 'Buy food' });
const item2 = new Item({ name: 'Cook food' });
const item3 = new Item({ name: 'Eat food' });
const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: { type: String, required: true },
  items: [itemSchema]
});

const List = mongoose.model('List', listSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  Item.find({})
    .then(items => {
      if (items.length) {
        const todos = items;
        res.render('list', { listTitle: 'Today', todos });
      } else {
        Item.insertMany(defaultItems).then(() => res.redirect('/'));
      }
    })
    .catch(console.error);
});

app.post('/', (req, res) => {
  const newItem = new Item({ name: req.body.newItem });
  const listName = _.capitalize(req.body.list);
  if (listName === 'Today') {
    newItem
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch(_err => res.redirect('/'));
  } else {
    List.findOne({ name: listName })
      .then(list => {
        list.items.push(newItem);
        list.save();
        res.redirect('/' + listName);
      })
      .catch(_err => res.redirect('/' + listName));
  }
});

app.post('/delete', (req, res) => {
  const checkbox = req.body.checkbox;
  const listName = _.capitalize(req.body.listName);
  if (listName === 'Today') {
    Item.findByIdAndRemove(req.body.checkbox).then(() => {
      res.redirect('/');
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkbox } } })
      .then(() => res.redirect('/' + listName))
      .catch(_err => res.redirect('/' + listName));
  }
});

app.get('/:listName', (req, res) => {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName }).then(list => {
    if (list) {
      res.render('list', { listTitle: list.name, todos: list.items });
    } else {
      const list = new List({ name: listName, items: defaultItems });
      list.save().then(() => res.redirect('/' + listName));
    }
  });
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
