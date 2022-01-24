const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const gateway = require('./routes/gateway');
const device = require('./routes/device');

const app = express();

const uri = 'mongodb://localhost:27017/gateway';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, options).then(
    () => {
        console.log('Conectado a DB')
    },
    err => {
        console.log(err)
    }
);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', [gateway, device]);

const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));



app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
    console.log('Gateway-Device app listening on port ' + app.get('puerto'));
});