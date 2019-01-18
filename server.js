var express = require('express');
var https = require('https');
var fs = require('fs');

var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
var request = require('request');

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/random'); **for development, local
mongoose.connect('mongodb://127.0.0.1:27017/random');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public', 'dist', 'public')));
app.use(cors());

var ReviewSchema = new mongoose.Schema({ 
    user: '',
    text: '',
    city: '',
    place: '',
    lat: '',
    lng: '',
    icon: '', 
    vicinity: '',
});   
var Review = mongoose.model('Review', ReviewSchema);
var questionSchema = new mongoose.Schema({ 
    user: '',
    question: ''
});   
var Question = mongoose.model('Question', questionSchema);
app.get('/city/:url', (req, res)=>{
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?'+req.params.url;
    request(url, function (error, response, body) {
        if(error){
            console.log('error:', error); 
            console.log('statusCode:', response && response.statusCode);
            console.log('body from server', body)
            res.json(error);
        }else{
            console.log('body from server', body)
            res.json(body)
        }
    });
})
app.get('/place/:url', (req, res)=>{
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +req.params.url;
    request(url, function (error, response, body) {
        if(error){
            console.log('error:', error); 
            console.log('statusCode:', response && response.statusCode);
            console.log('body from server', body)
            res.json(error);
        }else{
            console.log('body from server', body)
            res.json(body)
        }
    });
});
app.get('/api/reviews/:city', (req, res) => {
    Review.find({"city" : req.params.city}, (err, reviews)=>{
        if(err){
            res.json(err);
        }else{
            console.log("server get reviews",reviews)
            res.json(reviews)
        }
    })
});
app.post('/api/review', (req, res) => {
    var newReview = new Review(req.body);
    newReview.save((err, newReview)=>{
        if(err){
            res.json(err)
        }else{
            res.json(newReview);
            console.log('review', newReview)
        }
    })
});
app.get('/api/faqs', (req, res) => {
    Question.find({}, (err, questions)=>{
        if(err){
            res.json(err);
        }else{
            console.log("server get reviews",questions)
            res.json(questions)
        }
    })
});
app.post('/api/faqs', (req, res) => {
    var newQuestion = new Question(req.body);
    newQuestion.save((err, newQuestion)=>{
        if(err){
            console.log(err);
        }else{
            res.json(newQuestion);
            console.log('question', newQuestion)
        }
    })
});
app.get('/reviews/delete', (req, res)=>{
    Review.deleteMany({}, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/')
        }
    })
});
app.get('/questions/delete', (req, res)=>{
    Question.deleteMany({}, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/')
        }
    })
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
}); 

app.listen(3000, function(){
    console.log('3000')
})

