const author = require('../models/author');
const { getBookByCity } = require('../models/book');
const Book=require('../models/book')

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




