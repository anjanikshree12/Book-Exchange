const db=require('../utils/database');


class Order{
    static addOrder(userId){
        const command="INSERT INTO orders(user_id) VALUES(?);"
        return db.execute(command,[userId]);
    }

    static getOrdersByUserId(userId){
        const command="SELECT orders.id AS order_id,order_time,book_id,title,price FROM orders "
        +"JOIN order_items "
        +"ON orders.id=order_id "
        +"JOIN books "
        +"ON books.id=book_id "
        +"WHERE orders.user_id=? "
        +"ORDER BY order_time; "
        return db.execute(command,[userId]);
    }
}


module.exports=Order;