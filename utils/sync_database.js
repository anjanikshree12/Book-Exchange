const db = require('./database');

const user_table="CREATE TABLE IF NOT EXISTS `users`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`firstName` VARCHAR(50) NOT NULL,"
    +"`lastName` VARCHAR(50) NOT NULL,"
    +"`email` VARCHAR(50) NOT NULL,"
    +"`password` VARCHAR(255) NOT NULL,"
    +"`CITY` VARCHAR(30) NOT NULL,"
    +"`pincode` VARCHAR(10) NOT NULL,"
    +"`mobileNumber` VARCHAR(20) NOT NULL,"
    +"`address` VARCHAR(255) NOT NULL,"
    +"`state` VARCHAR(50) NOT NULL,"
    +"UNIQUE (email)"
    +");";


const author_table="CREATE TABLE IF NOT EXISTS `authors`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`name` VARCHAR(60) NOT NULL,"
    +"UNIQUE (name));"


const bookTable="CREATE TABLE IF NOT EXISTS `books`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT,"
    +"`title` VARCHAR(30) NOT NULL,"
    +"`selling_price`  DECIMAL(5,2) NOT NULL,"
    +"`orignal_price`  DECIMAL(5,2) NOT NULL,"
    +'`user_id` INT NOT NULL,'
    +'`author_id` INT NOT NULL,'
    +'`language` VARCHAR(30) NOT NULL, '
    +'`genre` VARCHAR (30) NOT NULL, '
    +'`imageUrl` VARCHAR(255) NOT NULL, '
    +'`description` VARCHAR(255) NOT NULL, '
    +'`bcondition` VARCHAR(50) NOT NULL, '
    +'`available` BOOL DEFAULT 1, ' 
    +'FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE, '
    +"FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);"

const cartTable="CREATE TABLE IF NOT EXISTS `cart`("
    +"`id` INT PRIMARY KEY AUTO_INCREMENT, "
    +"`book_id` INT, "
    +"`user_id` INT, "
    +"FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE, "
    +"FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);"

const wishlistTable="CREATE TABLE IF NOT EXISTS `wishlist`("
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


    exports.sync = async () => {
        try {
    
            await db.execute(user_table);
            console.log('user table created');
            await db.execute(author_table);
            await db.execute(bookTable);
            await db.execute(cartTable);
            await db.execute(wishlistTable);
            await db.execute(orderTable);
            await db.execute(orderItemsTable);
        } catch (err) {
            console.log(err);
        }
    }