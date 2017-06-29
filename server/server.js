const path=require('path');
const express=require('express')

//for going into the public folder where index.html is
const publicPath = path.join(__dirname,'../public');

var app=express();
//creating middleware
app.use(express.static(publicPath));

app.listen(3000,()=>{
    console.log('Server is up at port 3000');
});