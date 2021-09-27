const db=require('../utils/database');

class User{
    constructor(email,name,password,city){
        this.email=email;
        this.name=name;
        this.password=password;
        this.city=city;
    }

    addUser(){
        const command="INSERT INTO users(email,name,password,city) VALUES(?,?,?,?)";
        return db.execute(command,[this.email,this.name,this.password,this.city])
    }
    static getUserByEmail(email){
        return db.execute('SELECT *FROM users WHERE email=?',[email]);
    }
    static getUserDetailsById(id){
        const command="SELECT books.id AS book_id,books.title AS title,books.language AS language,books.selling_price AS sp,books.orignal_price AS op,users.id AS user_id,users.city AS city,users.name AS name  FROM books " 
        +"JOIN users "
        +"ON users.id=books.user_id "
        +"WHERE users.id=?";
        return db.execute(command,[id]);
    }
    
}

module.exports=User