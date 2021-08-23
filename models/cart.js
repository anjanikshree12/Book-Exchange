const db=require('../utils/database');


class Cart{
    constructor(bookId,userId){
        this.bookId=bookId;
        this.userId=userId;
    }

    checkIfExists(){
        const command="SELECT * FROM CART WHERE (book_id=? AND user_id=?)";
        return db.execute(command,[this.bookId,this.userId]);

    }
    addToCart(){
        const command="INSERT INTO cart(book_id,user_id) values(?,?)";
        return db.execute(command,[this.bookId,this.userId]);
    }
    static getCart(userId){
        let command;
        command="SELECT book_id FROM cart WHERE user_id=?";
        return db.execute(command,[userId]);
    }
    static removeFromCart(bookId,userId){
        let command="DELETE FROM cart WHERE book_id=? AND user_id=?";
        return db.execute(command,[bookId,userId]);
    }

}

module.exports=Cart;