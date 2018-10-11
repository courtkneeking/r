var express = require('express');
var https = require('https');
var fs = require('fs');

var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
var request = require('request');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public', 'dist', 'public')));
app.use(cors());

app.get('/place/:url', (req, res)=>{
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +req.params.url;
    request(url, function (error, response, body) {
        if(error){
            console.log('error:', error); 
            console.log('statusCode:', response && response.statusCode);
            res.json(error);
        }else{
            res.json(body)
        }
    });
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
}); 

app.listen(3000, function(){
    console.log('3000')
})


// var express = require('express');
// var https = require('https');
// var fs = require('fs');

// var app = express();
// var path = require('path');
// var bodyParser = require('body-parser');
// const cors = require('cors');
// var request = require('request');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public', 'dist', 'public')));
// app.use(cors());

// app.get('/place/:url', (req, res)=>{
//     var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +req.params.url;
//     request(url, function (error, response, body) {
//         console.log('error:', error); 
//         console.log('statusCode:', response && response.statusCode);
//         res.json(body);
//     });
// });

// app.all("*", (req,res,next) => {
//     res.sendFile(path.resolve("./public/dist/public/index.html"))
// }); 

// app.listen(3000, function(){
//     console.log('3000')
// })