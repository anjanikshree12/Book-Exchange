const db=require('../utils/database');


class Wishlist{
    constructor(bookId,userId,owner){
        this.bookId=bookId;
        this.userId=userId;
        this.owner=owner
    }
    checkIfExists(){
        const command="SELECT * FROM wishlist WHERE (book_id=? AND user_id=?)";
        return db.execute(command,[this.bookId,this.userId]);

    }
    addToWishlist(){
        const command="INSERT INTO wishlist(book_id,user_id) values(?,?)";
        return db.execute(command,[this.bookId,this.userId]);
    }
    static getWishlist(userId){
        let command;
        command="SELECT book_id FROM wishlist WHERE user_id=? ";
        return db.execute(command,[userId]);
    }
    static removeFromWishlist(bookId,userId){
        let command="DELETE FROM wishlist WHERE book_id=? AND user_id=?";
        return db.execute(command,[bookId,userId]);
    }
    static removeFromWishlistByUserId(userId){
        let command="DELETE FROM wishlist WHERE user_id=?";
        return db.execute(command,[userId]);
    }
    static getWishlistNum(userId){
        let command="SELECT COUNT(*) as n FROM wishlist WHERE user_id=?";
        return db.execute(command,[userId]);
    }
}

module.exports=Wishlist;