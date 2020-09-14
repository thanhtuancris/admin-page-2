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
mongoose.connect('mongodb://localhost:27017/admin-page-2', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function(err) {
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
    // res.render("home", {trang: "cha_add", ds});
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
            res.render('home', {trang:"cha_list", ds: data});
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
            // res.render('cha_edit', {cha: data});
            res.render('home', {trang:"cha_edit", ds: data}); 
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


//CON
app.get('/con_add', function(req, res){
    Cha.find({}, function(err, data){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            res.render('home2', {trang:"con_add", dsCha: data}); 
        }
    });

});

app.post('/con_add', function(req, res){
    const newCon = Con({
        Title: req.body.txtTitle
    });
    newCon.save(function(err){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            Cha.findOneAndUpdate({_id:req.body.slcCha},{$push: {BungBau: newCon._id}}, function(err){
                console.log(req.body.slcCha);
                console.log(newCon._id);
                if(err){
                    res.json({
                        status: "err",
                        message: err
                    });
                }else{
                    res.render('home3'); 
                }
            });
        }
    });
});

app.get('/', (req, res) => {
    const cha = Cha.aggregate([{ 
        $lookup: { 
            from: "cons",
            localField: "BungBau",
            foreignField: "_id",
            as: "DSCon"
        }
    }], function(err, data){
        if(err){
            res.json({
                status: "err",
                message: err
            });
        }else{
            // console.log(data);
            // res.json(data);
            res.render('home4', {data: data});
        }
    });
    
});

app.listen(port, () =>{
    console.log('Server listening on port ' + port);
});