const db=require("../utils/database");


class author{
    constructor(id,name){
        this.id=id;
        this.name=name;
    }
  
    static findByName(name){
        const command="SELECT * FROM authors "
        +"WHERE name=?";
        return db.execute(command,[name]);
    }

    static addAuthor(author){
        const command="INSERT INTO authors(name) VALUES(?)";
        return db.execute(command,[author]);
    }
}


module.exports=author;