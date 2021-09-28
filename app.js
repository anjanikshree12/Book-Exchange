const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const db=require('./utils/database')
const shopRoutes=require('./routes/shop')
const authRoutes=require('./routes/auth')
const adminRoutes=require('./routes/admin')
const sync_db = require('./utils/sync_database');
const session=require('express-session');
const { execute } = require('./utils/database');
const  MySQLStore = require('express-mysql-session')(session);
const path=require('path');
const multer=require('multer');

console.log(__dirname + '/node_modules');


app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname +'/node_modules'));
app.use(express.static(path.join(__dirname, 'node_modules')));

// path.dirname(process.mainModule.filename);
const sessionStore = new MySQLStore({
    createDatabaseTable: true,
    expiration: 86400000,
    checkExpirationInterval: 900000
}, db);

const fileStroge=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname);
    }
})

const fileFilter=(req,file,cb)=>{
    if(
        file.mimetype==='image/png'||
        file.mimetype==='image/jpg'||
        file.mimetype==='image/jpeg'
    ){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(multer({storage:fileStroge,fileFilter:fileFilter}).single('image'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}))


app.use((req,res,next)=>{
    // console.log(req.session);
    // console.log(req.session);
    if(!req.session.user){
        return next();
    }else{
        req.user=req.session.user[0];
        next();

    }
})

app.use((req, res, next) => {
    res.locals.isAuth  = req.session.isLoggedIn;
    if(req.user)
    res.locals.userId=req.user.id;
    next();
  });
// console.log(1);


sync_db.sync();




app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);


app.listen(3000);