const express  = require('express');
const exphbs   = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose (remote or local)
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
.then(() =>
  console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');
// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  console.log(req.name);
  res.render('index', {
    title: title
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add a details'});
  }

  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    res.send('passed');
  }
});
// Port server runs on
const port = 5000;

// Listen for server on specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
