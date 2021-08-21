const Book=require('../models/book')

exports.getHomePage=(req,res,next)=>{
    // console.log(req.session.user);
    res.render('shop/home');
}


exports.getCityBook=(req,res,next)=>{
    console.log(req.user);
    const cityName=req.user.CITY;
    console.log(cityName+'city');
    Book.getBookByCity(cityName)
    .then(result=>{
        console.log(result[0]);
        res.render('shop/bookCity',{
            prods:result[0]
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
    console.log(authorId);
    Book.getBookByAuthorId(authorId)
    .then(result=>{
        console.log(result[0]);
        res.render('shop/bookCity',{
            prods:result[0]
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

