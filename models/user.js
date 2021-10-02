const db=require('../utils/database');

class User{
    constructor(email,firstName,lastName,hashedPassword,mobileNumber){
        this.email=email;
        this.firstName=firstName;
        this.lastName=lastName;
        this.password=hashedPassword;
        this.mobileNumber=mobileNumber;
    }

    addUser(){
        const command="INSERT INTO users(email,firstName,lastName,password,mobileNumber) VALUES(?,?,?,?,?)";
        return db.execute(command,[this.email,this.firstName,this.lastName,this.password,this.mobileNumber])
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