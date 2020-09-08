const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

//connect DB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin-page-2', {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if(err) {
        console.log('Error connecting' + err);
    }else{
        console.log('Connected to MongoDB');
    }
});


//Models
const Cha = require('./Models/Cha');
const Con = require('./Models/Con');

app.get('/cha_add', function(req, res){
    res.render('cha_add');
});
app.post('/cha_add', function(req, res){
    const cha = new Cha({
        Title: req.body.txtCha_Title,
        BungBau: []
    });
    cha.save((err) => {
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.redirect('./cha_list');
        }
    });
});

app.get('/cha_list', function(req, res){
    Cha.find({}, function(err, data){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.render('cha_list', {ds: data});
        }
    });
});

app.get('/cha_edit/:id', function(req, res){
    Cha.findOne({_id: req.params.id}, function(err, data){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.render('cha_edit', {cha: data});
        }
    });
});
app.post('/cha_edit', function(req, res){
    Cha.updateOne({_id: req.body.ID_cha}, {Title: req.body.txtCha_Title}, function(err){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.redirect('./cha_list');
        }
    });
});

app.get('/cha_delete/:id', function(req, res){
    Cha.deleteOne({_id: req.params.id}, function(err){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.redirect('../cha_list');
        }
    });
});

app.get('/', (req, res) =>{
    res.render('home');
});

app.listen(port, () =>{
    console.log('Server listening on port ' + port);
});