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
        +"ON authors.id=author_id";
        return db.execute(command);

    }

    static getBookByCity(cityName){
        console.log(cityName);
        const command="SELECT books.id,title,price FROM (SELECT * FROM users WHERE city=?) as u " 
        +"JOIN books " 
        +"ON u.id=user_id;"
        return db.execute(command,[cityName]); 
    }
    static getBookByUserId(userId){
        const command="SELECT books.id,title,price FROM users "
        +"JOIN books "
        +"ON users.id=user_id "
        +"WHERE users.id=?"
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

    static getBookByAuthorId(authorId){
        const command=" SELECT *FROM books WHERE author_id=?";
        return db.execute(command,[authorId]);
    }

}

module.exports=Book;