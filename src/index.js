const express=require('express');
//Node.js web application framework that provides a robust set of features to develop web and mobile applications.
const bodyParser=require('body-parser');
//body-parser − This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.
// Body-parser is the Node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.
const route=require('./routes/route');
const app=express();
const { default: mongoose } = require('mongoose');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://samirlohiya909:Lohiya123@samirlohiya.nszppy8.mongodb.net/Project-1?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/',route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});