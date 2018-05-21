//import modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

//DB connection
mongoose.connect('mongodb://localhost/realdb');
let db = mongoose.connection;

//check DB connection
db.on('error', (err)=>{
    console.log(err);
});

db.once('open', ()=>{
    console.log('Connection to MongoDB successful !');
})




//initialize app
const app = express();





//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());


//express session
app.use(session({
    secret:'iwhoqodhwqodnnnn',
    resave: true,
    saveUninitialized: true
}));





//import user model
const userModel = require('./models/user');





//Home route @'/'
app.get('/', (req, res)=>{
    res.render('index');
});

//login route
app.post('/', (req, res)=>{
    var username = req.body.username;
    var password = req.body.password;

    if(username==""||password==""){
        console.log('Empty Field');
        res.redirect('/');
    }else{
         userModel.findOne({username: username, password: password},(err, data)=>{
        if(err){
            console.log(err)
        }
        else{
            if(!data){
                console.log('User doesnot exist' )
            }
            else{
                req.session.user = data;
                res.redirect('dashboard');
            }
        }
    })
    }
   
});

//import result model
let resultModel = require('./models/result.js');

//dashboard route @'/dashboard'
app.get('/dashboard', (req, res)=>{

    if(!req.session.user){
        console.log('Not logged in')
        res.redirect('/');
    }
    else{
        resultModel.find({}, (err, data)=>{
            
            if(err){
                console.log(err);
            }
            else{
                res.render('dashboard', {
                    data: data
                });
            }

        });   
    }
});

//add route @'/add'
app.get('/add', (req, res)=>{
    if(!req.session.user){
        console.log('Not Logged in ');
        res.redirect('/');
    }
    else{
        res.render('add');
    }
});

app.post('/add', (req, res)=>{
    var symbolno = req.body.symbolno;
    var name = req.body.name;
    var faculty = req.body.faculty;
    var cgpa = req.body.cgpa;

    let addUser = new resultModel();

    addUser.symbolno = symbolno;
    addUser.name = name;
    addUser.faculty = faculty;
    addUser.cgpa = cgpa;

    addUser.save({}, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Successful ');
            res.redirect('/dashboard');
        }
    });

});

//user profile route @'/user'
app.get('/user/:id',(req, res)=>{
    if(!req.session.user){
        console.log('Not logged in')
        res.redirect('/');
    }
    else{
        resultModel.findById({_id: req.params.id}, (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('user', {
                data: data
            })
        }
    })
    }
    
});


//edit profile
app.get('/edit/:id', (req, res)=>{
    if(!req.session.user){
        console.log('User not logged in! Access denied to route @/edit');
    }
    else{
        resultModel.findById({_id: req.params.id}, (err, data)=>{

        if(err){
            console.log(err)
        }
        else{
             res.render('edit',{
                 data: data
             });
        }

    })
    }
    
   
});

app.post('/edit/:id', (req, res)=>{

    let data = {};

    data.symbolno = req.body.symbolno;
    data.name =req.body.name;
    data.faculty = req.body.faculty;
    data.cgpa = req.body.cgpa;

    let query = {_id: req.params.id}

    resultModel.update(query, data, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Successful ');
            res.redirect('/dashboard');
        }
    });


});

//search route @'/search'
app.post('/search', (req, res)=>{
    var searchItem =req.body.search;
    if(searchItem==""){
        console.log('Empty')
    }
    else{
        resultModel.find({name: {$regex : "^" + searchItem, $options:'i'}},(err, data)=>{

            res.render('search', {
                data: data
            });

        });
    }

} );

//delete user route @'/delete/'
app.delete('/delete/:id', (req, res)=>{
    if(!req.session.user){
        console.log('Not logged in ! Access denied to delete route');
    }else{
        resultModel.findOneAndRemove({_id: req.params.id}, (err)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send('success');
            }
        });
    }
});


//logout route @'/logout'
app.get('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/');
});


//server started
app.listen(3000, console.log('Server started on port 3000...'))