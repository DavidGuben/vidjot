// Declare dependencies
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const exphbs     = require('express-handlebars');

// Map express function to app variable
const app = express();

// Map global promise - gets rid of warning
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

// Body parser middleware
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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});


// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// Process Form
app.post('/ideas', (req, res) => {
  // Create a variable with an empty array to store errors
  let errors = [];

  if(!req.body.title){ // If title is empty error
    errors.push({ text: 'Please add a title' });
  }
  if(!req.body.details){ // If details are empty error
    errors.push({ text: 'Please add details' });
  }
  // If errors array is greater than 0
  if(errors.length > 0) {
    res.render('ideas/add', {
      // Empty fields and show errors
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    // Attach input contents to the newUser object
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    // Push newUser object to database
    new Idea(newUser)  // Idea variable comes from mongoose model
    .save()            // save data to mongodb
    .then(idea => {    // redirect user to /ideas route (list of ideas)
      res.redirect('/ideas')
    })
  }
});

// Port variable
const port = 5000;

// Listen for server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
