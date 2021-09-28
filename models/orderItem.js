const db=require("../utils/database");


class orderItem{
    static addItems(items,orderId){
        let command="INSERT INTO order_items(book_id,order_id) VALUES ";
        let l=items.length;
        // l-=1;
        // console.log(items);
        for(let i=0;i<l;i++){
            if(i==l-1){
                command+="("+items[i]+","+orderId+");"
            }else{
                command+="("+items[i]+","+orderId+"),";
            }
        }
        console.log(command);
        return db.execute(command);
    }
}


module.exports=orderItem;