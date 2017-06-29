const path=require('path');
const express=require('express')
//for setting the app for heroku
const port=process.env.PORT || 3000;

//for going into the public folder where index.html is
const publicPath = path.join(__dirname,'../public');

var app=express();
//creating middleware
app.use(express.static(publicPath));

app.listen(port,()=>{
    console.log(`Server is up at port ${port}`);
});