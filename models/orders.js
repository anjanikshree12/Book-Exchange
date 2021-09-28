const db=require('../utils/database');


class Order{
    static addOrder(userId,order_amount){
        const command="INSERT INTO orders(user_id,order_amount) VALUES(?,?);"
        return db.execute(command,[userId,order_amount]);
    }

    static getOrdersByUserId(userId){
        const command="SELECT orders.id AS order_id,order_time,book_id,title,selling_price FROM orders "
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