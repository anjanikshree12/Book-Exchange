const db=require('../utils/database');


class Book{
    constructor(title,price,user_id,genre,language,author_id){
        this.title=title;
        this.price=price;
        this.genre=genre;
        this.language=language;
        this.user_id=user_id;
        this.author_id=author_id;
    }

    addBook(){
        const command="INSERT INTO BOOKS(title,price,genre,language,author_id,user_id) VALUES(?,?,?,?,?,?)";
        return db.execute(command,[this.title,this.price,this.genre,this.language,this.author_id,this.user_id]);
    }

    static getBookByAuthor(){
        const command="SELECT * FROM books "
        +"JOIN authors "
        +"ON authors.id=author_id WHERE books.available=1";
        return db.execute(command);

    }

    static getBookByCity(cityName,orderBy,userID){
        let command;
        if(orderBy=='true'){
            command="SELECT books.id,title,price FROM (SELECT * FROM users WHERE city=?) as u " 
            +"JOIN books " 
            +"ON u.id=user_id ORDER BY price WHERE user_id!=? AND books.available=1;"
        }else{
        // console.log(cityName);
        command="SELECT books.id,title,price FROM (SELECT * FROM users WHERE city=?) as u " 
        +"JOIN books " 
        +"ON u.id=user_id WHERE user_id!=? AND books.available=1;"
        }
        return db.execute(command,[cityName,userID]); 
    }
    static getBookByUserId(userId){
        const command="SELECT books.id,title,price FROM users "
        +"JOIN books "
        +"ON users.id=user_id "
        +"WHERE users.id=? AND books.available=1;"
        return db.execute(command,[userId]);
    }

    static deleteBookById(book_id){
        const command="DELETE FROM books "
        +"WHERE id=?";
        return db.execute(command,[book_id]);
    }

    static getTopAuthors(){
        const command=" SELECT * FROM  ( SELECT author_id,count(*) as c from books group by author_id  ) AS b  JOIN authors on b.author_id=authors.id order by b.c desc LIMIT 10" 
        return db.execute(command);
    }

    static getBookByAuthorId(authorId,orderByPrice,userId){
        let command
        if(orderByPrice=='true'){
            command="SELECT *FROM books WHERE author_id=? AND user_id!=? AND available=1 ORDER BY price ";
        }else
        command=" SELECT *FROM books WHERE author_id=? AND user_id!=? AND available=1";
        return db.execute(command,[authorId,userId]);
    }

    static getBookByGenre(genre,orderByPrice,userId){
        let command;
        if(orderByPrice=='true'){
            command="SELECT *FROM books where genre=? AND user_id!=? AND available=1 ORDER BY price";
        }else{
            command="SELECT *FROM books where genre=? AND user_id!=? AND available=1";
        }
        return db.execute(command,[genre,userId]);
    }

    static getGenre(){
        let command="SELECT * FROM books GROUP BY genre";
        return db.execute(command);
    }

    static getBookInArray(bookIds,orderBy){
        let command;
        if(orderBy=='true')
        command="SELECT * FROM books WHERE id IN (?) ORDER BY price;";
        else
        command="SELECT * FROM books WHERE id IN (?);";
        return db.query(command,[bookIds]);
    }

    static getTotalPrice(bookIds){
        const command="SELECT SUM(price) AS cost FROM books WHERE id IN (?);"
        return db.query(command,[bookIds]);
    }

    
}

module.exports=Book;