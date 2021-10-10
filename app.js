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
const Cart=require('./models/cart')
const  MySQLStore = require('express-mysql-session')(session);
const path=require('path');
const multer=require('multer');
const cloudinary = require('cloudinary').v2;
const morgan=require('morgan');
const Wishlist = require('./models/wishlist');
require('dotenv').config();



console.log(__dirname + '/node_modules');
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret:process.env.CLOUDINARY_API_SECRET  
  });

  app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname +'/node_modules'));
app.use(morgan('dev'));
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
    
    if(req.user){
    res.locals.userId=req.user.id;
    res.locals.userEmail=req.user.email;
    }
    else{
    res.locals.userId=-1;
    res.locals.userEmail='';
    }
    if(req.user){
        Cart.getCartNum(req.user.id).then(result=>{
            res.locals.cartnum=result[0][0].n;
            Wishlist.getWishlistNum(req.user.id).then(result1=>{
                console.log(result1[0]);
                res.locals.wishlistNum=result1[0][0].n;
                next()
            })
            .catch(err=>{
                console.log(err);
            })
           
        }).catch(err=>{
            console.log(err);
        })

    }else
    next();
  });
// console.log(1);


sync_db.sync();




app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port);

app.listen(3000, function(){
    console.log("server started on port 3000");
});