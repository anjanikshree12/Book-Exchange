const db=require('../utils/database');


class Order{
    static addOrder(userId,order_amount,deliver_id){
        const command="INSERT INTO orders(user_id,order_amount,deliver_id) VALUES(?,?,?);"
        return db.execute(command,[userId,order_amount,deliver_id]);
    }

    static getOrdersByUserId(userId){
        const command="SELECT orders.id AS order_id,order_time,book_id,title,selling_price,imageUrl,description,locality,city,state,district,pin_code FROM orders "
        +"JOIN order_items "
        +"ON orders.id=order_id "
        +"JOIN books "
        +"ON books.id=book_id "
        +"JOIN addresses "
        +"ON deliver_id=addresses.id "
        +"WHERE orders.user_id=? "
        +"ORDER BY order_time; "
        return db.execute(command,[userId]);
    }
}


module.exports=Order;