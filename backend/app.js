const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Configurazione EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('form');
});

app.post('/greet', (req, res) => {
    const name = req.body.name;
    res.render('greet', { name: name });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});