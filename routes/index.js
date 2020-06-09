/*
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
const path=require('path');
const express=require('express');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const config=require('config-lite')(__dirname);
const routes=require('../routes');
const pkg=require('../package');

const app=express();

app.set('views',path.join(__dirname),'views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname),'public'));
app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    resave:true,
    saveUninitialized:flase,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new MongoStore({
        url:config.mongodb
    })
}));
app.use(flash());
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),
    keepExtensions:true
}))

app.listen(config.port,function () {
    console.log('${pkg.name} listening on port ${config.port}')
});

app.locals.blog={
    title:pkg.name,
    description:pkg.description
};
app.use(function (req,res,next) {
    res.locals.user=req.session.user;
    res.locals.success=req.flash('success').toString();
    res.locals.error=req.flash('errpr').toString();
});

module.exports=function (app) {
    app.get('/',function (req,res) {
        res.redirect('/posts')
    });
    app.use('/signup',require('./signup'));
    app.use('/signin',require('./signin'));
    app.use('/signout',require('./signout'));
    app.use('/posts',require('./posts'));
    app.use('/comments',require('./comments'))
};