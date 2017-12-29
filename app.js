const express = require('express');
const exphbs = require('express-handlebars');
const methodOverrdie = require('method-override');
const bodyParser = require('body-parser'); //Used to get the form values from the HTTP 
const mongoose = require('mongoose');


const app = express();
//Map global promise-get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
})
.then(()=>
console.log('MongoDB Connected..'))
.catch(err=>console.log(err));

//Load Idea (Database) Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


//how middleware works
//Handlebars View Engine 
//Telling the system that we want to use handlebars as the Template Engine

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Method-override middleware
app.use(methodOverrdie('_method'));

//Index Routing
app.get('/', (req,res)=>{
    const title='Welcome';
res.render('index', {
    title: title
});
});

//About page 

app.get('/about', (req,res)=>{
res.render('about');
});
//idea route page
app.get('/ideas', (req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index', {
        ideas:ideas
    });
});
});

//Add idea page (Routing)
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add');
})

//Edit Idea form route
//Get Request

app.get('/ideas/edit/:id', (req,res)=>{
   Idea.findOne({
       _id: req.params.id
   })
   .then(idea=>{
    res.render('ideas/edit',{
idea:idea
    });
   });  
});

//Process Form -> USe post to submit details in the form//

//Post Request
app.post('/ideas', (req,res)=>{
   let errors = [];
   if(!req.body.title){
       errors.push({text:'Please add a title'})
   }
   if(!req.body.details){
       errors.push({text:'Details is empty'})
   }
   if(errors.length>0){
       res.render('ideas/add',{
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
    }
    else
    {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            
        }
new Idea(newUser)
.save()
.then(idea =>{
    res.redirect('/ideas');
})
       }
});

//Put Request-> Editing the ideas and updating using method override module

app.put('/ideas/:id', (req,res)=>{
Idea.findOne({
_id: req.params.id
})
.then(idea=>{
    //new values
    idea.title=req.body.title; //html editing
    idea.details=req.body.details; //html editing
    idea.save()
    .then(idea=>{
        res.redirect('/ideas');
    })
});
});

//Delete Request

app.delete('/ideas/:id', (req,res)=>{
    Idea.remove({_id: req.params.id})
    .then(()=>{ //then is a promise in node.js
        res.redirect('/ideas');
    })
})

const port = 5000; //using const bcoz of ES6 syntax

app.listen(port, ()=> {
console.log(`Server started on the port ${port}`);
});





