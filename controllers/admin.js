const Book=require('../models/book')
const Author=require('../models/author');
const Cart=require('../models/cart');
const User = require('../models/user');

exports.getAddBook=(req,res,next)=>{
    // console.log(req.user.id);
    res.render('admin/addBook');
}

exports.postAddBook=(req,res,next)=>{
    console.log(req.body);
    const title=req.body.title;
    const orignal_price=req.body.orignal_price;
    const selling_price=req.body.selling_price;
    const genre=req.body.genre;
    const language=req.body.language;
    const authorName=req.body.author;
    const image=req.file;
    const imageUrl=image.path;
    // console.log();
    console.log(image);
    const user_id=req.user.id;
    let author_id;
    Author.findByName(authorName)
    .then(([authors])=>{
        console.log('tu');
        console.log(authors.length);
        console.log(authors);
        if(authors.length>0){
            console.log(authors[0]);
            // console.log('authors=> ');
            // console.log(authors[0][0].id);
            return authors[0].id;
            // return id
            
        }else{
            return Author.addAuthor(authorName)
            .then(([{insertId}])=>{
                console.log(insertId);
                // console.log("add author result=> ")
                // console.log(result[0].insertId);
                // return result[0].insertId
                return insertId;
            })
        
        }
    })
    .then(aid=>{
                console.log("final"+aid);
                // console.log(req.body);
                const book=new Book(title,orignal_price,selling_price,user_id,genre,language,aid,imageUrl);
                console.log(book);
                book.addBook()
                .then(result=>{
                    console.log('book-added!');
                    res.redirect('/myBooks')
                })
                .catch(err=>{
                    console.log(err);
                });
    })
    .catch(err=>{
        console.log(err);
    });
    
   
   

}


exports.getMyBook=(req,res,next)=>{
    Book.getBookByUserId(req.user.id)
    .then(books=>{
        console.log(books[0]);
        res.render('admin/myBook',{
            prods:books[0]
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.deleteBook=(req,res,next)=>{
    console.log(req.body);
    const book_id=req.body.id;
    Book.deleteBookById(book_id,req.user.id)
    .then(result=>{
        console.log("book deleted");
        res.redirect('/myBooks');
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.getUserDetails=(req,res,next)=>{
    const userId=req.params.id;
    User.getUserDetailsById(userId)
    .then(result=>{
        console.log(result[0]);
    })
    .catch(err=>{
        console.log(err);
    })
}

