const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const db=require('./utils/database')
const shopRoutes=require('./routes/shop')
const authRoutes=require('./routes/auth')
const adminRoutes=require('./routes/admin')
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
const user_table="CREATE TABLE IF NOT EXISTS `users`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`name` VARCHAR(50) NOT NULL,"
    +"`email` VARCHAR(50) NOT NULL,"
    +"`password` VARCHAR(50) NOT NULL,"
    +"`CITY` VARCHAR(30) NOT NULL,"
    +"UNIQUE (email)"
    +");";


const author_table="CREATE TABLE IF NOT EXISTS `authors`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`name` VARCHAR(60) NOT NULL,"
    +"UNIQUE (name));"


const bookTable="CREATE TABLE IF NOT EXISTS `books`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`title` VARCHAR(30) NOT NULL,"
    +"`price`  DECIMAL(5,2) NOT NULL,"
    +'`user_id` INT NOT NULL,'
    +'`author_id` INT NOT NULL,'
    +'`language` VARCHAR(30) NOT NULL, '
    +'`genre` VARCHAR (30) NOT NULL, '
    +'`available` BOOL DEFAULT 1, ' 
    +'FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE, '
    +"FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);"

const cartTable="CREATE TABLE IF NOT EXISTS `cart`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT, "
    +"`book_id` INT, "
    +"`user_id` INT, "
    +"FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE, "
    +"FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);"



const orderTable="CREATE TABLE IF NOT EXISTS `orders`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT, "
    +"`user_id` INT NOT NULL, "
    +"`order_amount` DECIMAL(7,2) NOT NULL, "
    +"`order_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
    +"FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);"


const orderItemsTable="CREATE TABLE IF NOT EXISTS `order_items`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT, "
    +"`book_id` INT NOT NULL, "
    +"`order_id` INT NOT NULL, "
    +"FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, "
    +"FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE); "


db.execute(user_table)
.then(result=>{
    console.log('user table created');
})
.catch(err=>{
    console.log(err);
})


db.execute(author_table)
.then(result=>{
    console.log('author table created');
})
.catch(err=>{
    console.log(err);
})

db.execute(bookTable)
.then(result=>{
    console.log('book table created');
})
.catch(err=>{
    console.log(err);
})

db.execute(cartTable)
.then(result=>{
    console.log('cart table created');
})
.catch(err=>{
    console.log(err);
})

db.execute(orderTable)
.then(result=>{
    console.log('orders table created');
})
.catch(err=>{
    console.log(err);
})

db.execute(orderItemsTable)
.then(result=>{
    console.log('order items table created');
})
.catch(err=>{
    console.log(err);
})




app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);


app.listen(3000);