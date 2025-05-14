const express = require ('express');
const app = express();
const path = require ('path');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexej1.html'));
});

app.listen(8087, () => {
    console.log('http://127.0.0.1:8087')
});