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


const sessionStore = new MySQLStore({
    createDatabaseTable: true,
    expiration: 86400000,
    checkExpirationInterval: 900000
}, db);

app.use(bodyParser.urlencoded({ extended: false }));
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
    if(!req.session.user){
        return next();
    }else{
        req.user=req.session.user[0];
        next();

    }
})
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
    +'FOREIGN KEY (author_id) REFERENCES authors(id) , '
    +"FOREIGN KEY (user_id) REFERENCES users(id));"




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


app.use(authRoutes);
app.use(shopRoutes);
app.use(adminRoutes);


app.listen(3000);