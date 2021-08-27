const author = require('../models/author');
const { getBookByCity } = require('../models/book');
const Book=require('../models/book')
const Cart=require('../models/cart')
const Order=require('../models/orders');
const OrderItem=require('../models/orderItem');

exports.getHomePage=(req,res,next)=>{
    // console.log(req.session.user);
    res.render('shop/home');
}


exports.getCityBook=(req,res,next)=>{
    console.log(req.user);
    const cityName=req.user.CITY;
    const userId=req.user.id;
    const orderByPrice=req.query.orderBy;
    console.log(cityName+'city');
    Book.getBookByCity(cityName,orderByPrice,userId)
    .then(result=>{
        console.log(result[0]);
        res.render('shop/bookCity',{
            prods:result[0],
            path:'/cityBook'
        })
    })
    .catch(err=>{
        console.log(err);
    })
}


exports.getTopAuthors=(req,res,next)=>{
    
    Book.getTopAuthors()
    .then(result=>{
        res.render('shop/topAuthor',{
            author:result[0]
        })
        // console.log(result[0]);
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getAuthorBooks=(req,res,next)=>{
    const authorId=req.params.id;
    const orderByPrice=req.query.orderBy;
    const userId=req.user.id;
    // console.log(authorId);
    console.log('/authorBooks/'+authorId);
    Book.getBookByAuthorId(authorId,orderByPrice,userId)
    .then(result=>{
        console.log(result[0]);
        res.render('shop/bookCity',{
            prods:result[0],
            path:'/authorBooks/'+authorId
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getGenre=(req,res,next)=>{
    Book.getGenre()
    .then(result=>{
        console.log(result[0]);
        res.render('shop/genre',{
            prods:result[0]
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getBooksByGenre=(req,res,next)=>{
    const genre=req.params.genre;
    const orderBy=req.query.orderBy;
    const userId=req.user.id;
    Book.getBookByGenre(genre,orderBy,userId)
    .then(result=>{
        console.log(result[0]);
        res.render('shop/bookCity',{
            prods:result[0],
            path:'/genreBook/'+genre
        })
    })
}


exports.addToCart=(req,res,next)=>{
    // console.log(req.body);
    const bookId=req.body.bookId;
    const userId=req.user.id
    const path=req.body.path;
    const cart= new Cart(bookId,userId);
    // console.log(cart);
    cart.checkIfExists()
    .then(result=>{
        if(result[0].length!=0){
            return res.redirect(path);
        }else{
            return cart.addToCart()
            .then(result=>{
                console.log('added to cart');
                res.redirect('/cart');
            })
        }
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getCart=(req,res,next)=>{
    const userId=req.user.id;
    const orderBy=req.query.orderBy;
    console.log(orderBy);
    Cart.getCart(userId)
    .then(result=>{
        // console.log(result[0]);
        let bookIds=[];
        for(let i=0;i<result[0].length;i++){
            bookIds.push(result[0][i].book_id);
        }
        // console.log(bookIds);
        if(bookIds.length==0){
            return res.render('shop/cart',{
                prods:[],
                path:'/cart',
                cost:0,
                books:[]
            })
        }else{
        Book.getBookInArray(bookIds,orderBy)
        .then(result=>{
            Book.getTotalPrice(bookIds)
            .then(result1=>{
                console.log(bookIds);
                // console.log(req.body);
                return res.render('shop/cart',{
                    prods:result[0],
                    path:'/cart',
                    cost:result1[0][0].cost,
                    books:bookIds
                })
            })
            .catch(err=>{
                console.log(err);
            })
            // console.log(result[0]);
            
        })
        .catch(err=>{
            console.log(err);
        })
    }
    })

    .catch(err=>{
        console.log(err);
    })
}


exports.removeFromCart=(req,res,next)=>{
    const bookId=req.body.bookId;
    const userId=req.user.id;
    Cart.removeFromCart(bookId,userId)
    .then(result=>{
        res.redirect('/cart');
        console.log('removed From Cart');
    })
    .catch(err=>{
        console.log(err);
    })
}


exports.postOrder=(req,res,next)=>{
    const user_id=req.user.id;
    Order.addOrder(user_id)
    .then(result=>{
        const orderId=result[0].insertId;
        const bookIds=req.body.bookIds;
        let books=[];
        for(let i=0;i<bookIds.length;i++){
            if(bookIds[i]!=','){
                books.push(bookIds[i]);
            }
        }
        console.log(books);
        // console.log(req.body);
        OrderItem.addItems(books,orderId)
        .then(result=>{
            console.log('orders added');
            return Cart.removeFromCartByUserId(user_id)
            .then(result=>{
                console.log('items removed from cart');
                res.redirect('/cart');
            })
            
        })
        .catch(err=>{

            console.log(err);
        })
        
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.getOrders=(req,res,next)=>{
    Order.getOrdersByUserId(req.user.id)
    .then(result=>{
        console.log(result[0].length);
        let orders=[];
        let curord;
        let cur=[];
        for(let i=0;i<result[0].length;i++){

            // console.log(temp);
            if(i==0){
                curord=result[0][i].order_id;
                cur.push(result[0][i])
                continue;
            }
            if(result[0][i].order_id!=curord){
                console.log('nequal');
                orders.push(cur);
                cur=[];
                cur.push(result[0][i]);
                curord=result[0][i].order_id;

            }else{
                console.log('equal');
                cur.push(result[0][i]);
            }
            if(i==result[0].length-1){
                console.log('end');
                orders.push(cur);
            }
            
            // console.log(curdate);
        }
        res.render('shop/orders',{
            orders:orders
        })
        console.log(orders);
    })
    .catch(err=>{
        console.log(err);
    })
}