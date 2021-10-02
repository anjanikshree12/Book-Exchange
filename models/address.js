const db=require('../utils/database');
const User = require('./user');

class Address{
    constructor(locality,city,state,pin_code,type,user_id,district,make_default){
        this.locality=locality;
        this.city=city;
        this.state=state;
        this.pin_code=pin_code;
        this.type=type;
        this.user_id=user_id;
        this.district=district;
        this.make_default=make_default;
    }

    addAddress(){
        const command="INSERT INTO addresses(locality,city,state,pin_code,type,user_id,district,default_add) VALUES(?,?,?,?,?,?,?,?) ";
        console.log(command);
        return db.query(command,[this.locality,this.city,this.state,this.pin_code,this.type,this.user_id,this.district,this.make_default]);
    }
    
    static getAddressById(id){
        const command="SELECT * FROM addresses WHERE user_id=? ";
        return db.execute(command,[id]);
    }
    static deleteAddressById(id){
        const command="DELETE FROM adresses where id=?";
        return db.execute(command,[id]);
    }

    static updateAddressById(add_id,locality,state,pin_code,type,district){
        const command="UPDATE addresses SET locality=?,state=?,pin_code=?,type=?,district=? WHERE id=?";
        return db.execute(command,[locality,state,pin_code,type,district,add_id]);
    }

    static removeDefaultExceptOne(r_id){
        const command="UPDATE addresses SET default_add=0 where id <> ?; "
        return db.execute(command,[r_id]);
    }
}

module.exports=Address;