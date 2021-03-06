const author = require('../models/author');
const { getBookByCity } = require('../models/book');
const Book=require('../models/book')
const Cart=require('../models/cart')
const Order=require('../models/orders');
const OrderItem=require('../models/orderItem');
const Wishlist = require('../models/wishlist');
const Address=require('../models/address')
exports.getHomePage=(req,res,next)=>{
    console.log(req.user);
    // console.log(req.session.user);
    const orderBy=req.params.orderBy;
    Book.getAllBooks(orderBy,req.user.id)
    .then(result=>{
        res.render('auth/loggedin',{
            prods:result[0],
            path:'/'
        })
        console.log(result[0]);
    })
    .catch(err=>{
        console.log(err);
    })
    // res.render('shop/home');
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
        res.render('auth/loggedin',{
            prods:result[0],
            path:'/genreBook'
        })
    })
}

exports.getBooksByLanguage=(req,res,next)=>{
    const language=req.params.language;
    const orderBy=req.query.orderBy;
    const userId=req.user.id;
    Book.getBooksbyLanguage(language,orderBy,userId)
    .then(result=>{
        res.render('auth/loggedin',{
            prods:result[0],
            path:'/langugeBook'
        })
    })
}


exports.addToWishlist=(req,res,next)=>{
    console.log(req.body);
    const bookId=req.body.bookId;
    const userId=req.user.id
    const path=req.body.path;
    console.log(path);
    Book.getOwner(bookId)
    .then(result=>{
        console.log(result[0]);
        const owner=result[0][0].user_id;
        if(owner==userId){
            return res.redirect(path)
        }
        const wishlist= new Wishlist(bookId,userId,owner);
        console.log(wishlist);
        return wishlist.checkIfExists()
        .then(result=>{
            if(result[0].length!=0){
                return res.redirect(path);
            }else{
                return wishlist.addToWishlist()
                .then(result=>{
                    console.log('added to wishlist');
                    res.redirect('/');
                })
            }
            console.log(result);
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getWishlist=(req,res,next)=>{
    // console.log(req.user);
    const userId=req.user.id;
    const orderBy=req.query.orderBy;
    console.log(orderBy);
    
    Wishlist.getWishlist(userId)
    .then(result=>{
        // console.log(result[0]);
        let bookIds=[];
        for(let i=0;i<result[0].length;i++){
            bookIds.push(result[0][i].book_id);
        }
        // console.log(bookIds);
        if(bookIds.length==0){
            return res.render('admin/wishlist',{
                prods:[],
                path:'/wishlist',
                cost:0,
                books:[]
            })
        }else{
        Book.getBookInArray(bookIds,orderBy)
        .then(result=>{
            Book.getTotalPrice(bookIds)
            .then(result1=>{
                console.log(bookIds);
                console.log(result[0]);
                // console.log(req.body);
                return res.render('admin/wishlist',{
                    prods:result[0],
                    path:'/wishlist',
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

exports.addToCart=(req,res,next)=>{
    console.log(req.body);
    const bookId=req.body.bookId;
    const userId=req.user.id
    const path=req.body.path;
    console.log(path);
    Book.getOwner(bookId)
    .then(result=>{
        console.log(result[0]);
        const owner=result[0][0].user_id;
        if(owner==userId){
            return res.redirect(path)
        }
        const cart= new Cart(bookId,userId,owner);
        console.log(cart);
        return cart.checkIfExists()
        .then(result=>{
            if(result[0].length!=0){
                return res.redirect(path);
            }else{
                return cart.addToCart()
                .then(result=>{
                    console.log('added to cart');
                    res.redirect('/');
                })
            }
            console.log(result);
        })
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
        Address.getAddressById(userId)
        .then(result3=>{
            // console.log(result1[0].length);
        let bookIds=[];
        for(let i=0;i<result[0].length;i++){
            bookIds.push(result[0][i].book_id);
        }
        // console.log(bookIds);
        if(bookIds.length==0){
            return res.render('shop/cart2',{
                prods:[],
                path:'/cart',
                cost:0,
                books:[],
                addresses:result3[0]
            })
        }else{
        Book.getBookInArray(bookIds,orderBy)
        .then(result=>{
            Book.getTotalPrice(bookIds)
            .then(result1=>{
                console.log(bookIds);
                // console.log(result[0]);
                let saving=result1[0][0].orignal_cost-result1[0][0].selling_cost;
                saving=saving.toFixed(2);
                console.log(saving);
                console.log(result1[0].length);
                return res.render('shop/cart2',{
                    prods:result[0],
                    path:'/cart',
                    orignal_cost:result1[0][0].orignal_cost,
                    selling_cost:result1[0][0].selling_cost,
                    saving:saving,
                    books:bookIds,
                    addresses:result3[0]
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
        // console.log(result[0]);
        
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
exports.removeFromWishlist=(req,res,next)=>{
    const bookId=req.body.bookId;
    const userId=req.user.id;
    Wishlist.removeFromWishlist(bookId,userId)
    .then(result=>{
        res.redirect('/wishlist');
        console.log('removed From wishlist');
    })
    .catch(err=>{
        console.log(err);
    })
}


exports.postOrder=(req,res,next)=>{
    const user_id=req.user.id;
    const bookIds=req.body.bookIds;
    const deliver_id=req.body.address;
    // console.log(req.body);
    let books=[];
    console.log(req.body);
    let cur="";
    for(let i=0;i<bookIds.length;i++){
        if(bookIds[i]!=','){
            cur+=bookIds[i];
        }else{
            books.push(cur);
            cur="";
        }
        if(i==bookIds.length-1){
            books.push(cur);
            cur="";
        }
    }
    console.log(books);
    Book.getTotalPrice(books)
    .then(result1=>{
            const orderAmount=result1[0][0].selling_cost;
            console.log(deliver_id);
            console.log(orderAmount);
            console.log(result1[0]);
            Order.addOrder(user_id,orderAmount,deliver_id)
            .then(result=>{
            const orderId=result[0].insertId;
            
            
                OrderItem.addItems(books,orderId)
                .then(result2=>{
                    console.log('orders added');
                    return Cart.removeFromCartByUserId(user_id)
                    .then(result3=>{
                        return Book.makeUnavailable(books)
                        .then(result4=>{
                            console.log('items removed from cart');
                            res.redirect('/cart');
                        })
                        .catch(err=>{
                            console.log();
                        })
                    })
                    
                })
                .catch(err=>{
        
                    console.log(err);
                })
                
            })
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.getOrders=(req,res,next)=>{
    Order.getOrdersByUserId(req.user.id)
    .then(result=>{
        Address.getAddressById(req.user.id)
        .then(result2=>{
        console.log(result[0]);
        console.log(result2[0]);
        if(result[0].length==0){
            res.render('shop/myorders',{
                path:'/myorders',
                orders:"",
                name:"",
                addresses:result2[0]
            })
        }else{
        Book.getOwner(result[0][0].book_id)
        .then(result1=>{
            
                console.log(result2[0]);
                console.log(result1[0]);
                res.render('shop/myorders',{
                    path:'/myorders',
                    orders:result[0],
                    name:result1[0][0].name,
                    addresses:result2[0]
                })
           
            
        })
    }
    })

        
        // console.log(orders);
    })
    .catch(err=>{
        console.log(err);
    })
}



exports.getBookDetails=(req,res,next)=>{
    const bookId=req.params.id;
    console.log(bookId);
    Book.getBookDetailsById(bookId)
    .then(result=>{
        console.log(result[0]);
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.postSearch=(req,res,next)=>{
    const searched=req.body.searchQuery;
    res.redirect('/search/?searched='+searched)
   
}

exports.getSearch=(req,res,next)=>{
    const searched=req.query.searched
    let search='%';
    search+=searched;
    search+='%'
    const path='/search/?searched='+searched
    console.log(path);
    Book.getSearchedBook(search)
    .then(result=>{
        console.log(result[0]);
        res.render('auth/loggedin',{
            prods:result[0],
            path:path
        })
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(searched);
}


// var instance = new Razorpay({ key_id: 'rzp_test_jABxeqkaDNYGkh', key_secret: 'Y7LkvoQ0GkzpHHkrb9IjmvJ9' })
// var options = {  
//     amount: 50000,  // amount in the smallest currency unit  
//     currency: "INR",  
//     receipt: "order_rcptid_11"};
// instance.orders.create(options, function(err, order){
// console.log(order);});