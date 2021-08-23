const author = require('../models/author');
const { getBookByCity } = require('../models/book');
const Book=require('../models/book')
const Cart=require('../models/cart')

exports.getHomePage=(req,res,next)=>{
    // console.log(req.session.user);
    res.render('shop/home');
}


exports.getCityBook=(req,res,next)=>{
    console.log(req.user);
    const cityName=req.user.CITY;
    const orderByPrice=req.query.orderBy;
    console.log(cityName+'city');
    Book.getBookByCity(cityName,orderByPrice)
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
    // console.log(authorId);
    console.log('/authorBooks/'+authorId);
    Book.getBookByAuthorId(authorId,orderByPrice)
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
    Book.getBookByGenre(genre,orderBy)
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
        console.log(result[0]);
        let bookIds=[];
        for(let i=0;i<result[0].length;i++){
            bookIds.push(result[0][i].book_id);
        }
        console.log(bookIds);
        Book.getBookInArray(bookIds,orderBy)
        .then(result=>{
            Book.getTotalPrice(bookIds)
            .then(result1=>{
                console.log();
                res.render('shop/cart',{
                    prods:result[0],
                    path:'/cart',
                    cost:result1[0][0].cost
                })
            })
            .catch(err=>{
                console.log(err);
            })
            console.log(result[0]);
            
        })
        .catch(err=>{
            console.log(err);
        })
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