const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rumorController = require('./controllers/rumorController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', rumorController.index);
app.get('/detail/:id', rumorController.detail);
app.post('/report', rumorController.report);
app.get('/summary', rumorController.summary);
app.get('/search', rumorController.searchForm);
app.post('/search', rumorController.processSearch);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});