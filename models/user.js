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
    
}

module.exports=User