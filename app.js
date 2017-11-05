const express  = require('express');
const exphbs   = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose (remote or local)
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
.then(() =>
  console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

// Port server runs on
const port = 5000;

// Listen for server on specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
