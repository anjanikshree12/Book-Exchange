const db=require('../utils/database');


class Book{
    constructor(title,orignal_price,selling_price,user_id,genre,language,author_id,imageUrl,description,condition){
        this.title=title;
        this.orignal_price=orignal_price;
        this.selling_price=selling_price;
        this.genre=genre;
        this.language=language;
        this.user_id=user_id;
        this.author_id=author_id;
        this.imageUrl=imageUrl;
        this.description=description;
        this.condition=condition;
    }

    addBook(){
        const command="INSERT INTO books(title,orignal_price,selling_price,genre,language,author_id,user_id,imageUrl,description,bcondition) VALUES(?,?,?,?,?,?,?,?,?,?)";
        return db.query(command,[this.title,this.orignal_price,this.selling_price,this.genre,this.language,this.author_id,this.user_id,this.imageUrl,this.description,this.condition]);
    }

    static getBookByAuthor(){
        const command="SELECT *,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books "
        +"JOIN authors "
        +"ON authors.id=author_id WHERE books.available=1";
        return db.execute(command);

    }

    static getBookByCity(cityName,orderBy,userID){
        let command="SELECT books.id,title,orignal_price,selling_price,imageUrl,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM (SELECT * FROM users WHERE city=?) as u " 
        +"JOIN books " 
        +"ON u.id=user_id WHERE user_id!=? AND books.available=1 ";
        if(orderBy=='true'){
            command+="ORDER BY orignal_price ;"
        }
        return db.execute(command,[cityName,userID]); 
    }
    static getBookByUserId(userId){
        const command="SELECT books.id,title,name,selling_price,orignal_price,available,imageUrl,bcondition,user_id,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM users "
        +"JOIN books "
        +"ON users.id=user_id " 
        +"JOIN authors "
        +"ON author_id=authors.id "
        +"WHERE users.id=?;"
        return db.execute(command,[userId]);
    }

    static deleteBookById(book_id,user_id){
        const command="DELETE FROM books "
        +"WHERE id=? AND user_id=? AND AVAILABLE=1";
        return db.execute(command,[book_id,user_id]);
    }

    static getTopAuthors(){
        const command=" SELECT * FROM  ( SELECT author_id,count(*) as c from books WHERE available=1 group by author_id  ) AS b  JOIN authors on b.author_id=authors.id order by b.c desc LIMIT 10" 
        return db.execute(command);
    }

    static getBookByAuthorId(authorId,orderByPrice,userId){
        let command="SELECT *,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books WHERE author_id=? AND available=1";

        if(orderByPrice=='true'){
            command+=" ORDER BY orignal_price;"
        }
        return db.execute(command,[authorId]);
    }

    static getBookByGenre(genre,orderByPrice,userId){
            let command="SELECT *,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books where genre=?  AND available=1  AND books.user_id!=?";
         
        if(orderByPrice=='true'){
            command+="ORDER BY orignal_price;"
        }
        return db.execute(command,[genre,userId]);
    }

    static getBooksbyLanguage(language,orderByPrice,userId){
        let command="SELECT *,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books where language=?  AND available=1 AND books.user_id!=? ";
     
    if(orderByPrice=='true'){
        command+="ORDER BY orignal_price;"
    }
    return db.execute(command,[language,userId]);
}

    static getGenre(){
        let command="SELECT * FROM books GROUP BY genre";
        return db.execute(command);
    }

    static getBookInArray(bookIds,orderBy){
        let command="SELECT *,books.id as id,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books JOIN users ON user_id=users.id WHERE books.id IN (?) ";
        if(orderBy=='true')
        command+="ORDER BY selling_price;";
        return db.query(command,[bookIds]);
    }

    static getTotalPrice(bookIds){
        const command="SELECT SUM(selling_price) AS selling_cost,SUM(orignal_price) AS orignal_cost FROM books WHERE id IN (?);"
        return db.query(command,[bookIds]);
    }

    static makeUnavailable(books){
        const command="UPDATE books SET available=0 WHERE id IN (?);"
        return db.query(command,[books]);
    }
    
    static getAllBooks(orderBy,userId){
        const command="SELECT *,books.id as id,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books JOIN authors ON books.author_id=authors.id  WHERE AVAILABLE=1 AND user_id!=?";
        if(orderBy=='true'){
            command+=' ORDER BY orignal_price';
        }
        return db.execute(command,[userId])
    }
    static getOwner(book_id){
        const command="SELECT user_id,concat(firstName,' ',lastName) AS name FROM books "
        +"JOIN users ON user_id=users.id "
        +"WHERE books.id=? ;";
        return db.execute(command,[book_id]);
    }

    static getBookDetailsById(id){
        const command="SELECT books.id AS book_id,books.title AS title,books.language AS language,books.selling_price AS sp,books.orignal_price AS op,users.id AS user_id,books.description AS descr,imageUrl FROM books " 
        +"JOIN users "
        +"ON users.id=books.user_id "
        +"WHERE books.id=?";
        return db.execute(command,[id]);
    }

    static getBookDetails(id){
        const command="SELECT books.id as id,books.title AS title,books.orignal_price AS op,books.selling_price AS sp,books.language as lang,books.description AS description,books.genre AS genre,authors.name as author,books.bcondition AS bcondition FROM books "+
                    "JOIN authors ON author_id=authors.id "+
                    "WHERE books.id=?"
        return db.execute(command,[id])
    }
    
    static editBookByid(id,title,orignal_price,selling_price,user_id,genre,language,aid,imageUrl,description,bcondition){
        const command="UPDATE books SET title=?,orignal_price=?,selling_price=?,user_id=?,genre=?,language=?,author_id=?,imageUrl=?,description=?,bcondition=? WHERE books.id=?;  "
        return db.query(command,[title,orignal_price,selling_price,user_id,genre,language,aid,imageUrl,description,bcondition,id]);
    }

    static getSearchedBook(searched){
        const command="SELECT *,round(((orignal_price-selling_price)/orignal_price)*100,2) AS sale FROM books WHERE title LIKE ? AND available=1; ";
        return db.query(command,[searched]);
    }
}

module.exports=Book;