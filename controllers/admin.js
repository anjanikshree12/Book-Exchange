const Book=require('../models/book')
const Author=require('../models/author');
const Cart=require('../models/cart');
const User = require('../models/user');
const Address=require('../models/address')
const cloudinary_util=require('../utils/cloudinary_util')
const file_handling=require('../utils/file_handling')
exports.getAddBook=(req,res,next)=>{
    // console.log(req.user.id);
    res.render('admin/uploadbooks',{
        path:'/addBook'
    });
}


exports.getEditBook=(req,res,next)=>{
    const  bookId=req.params.id;
    const userId=req.user.id;
    Book.getOwner(bookId)
    .then(result=>{
        const owner_id=result[0][0].user_id;
        if(owner_id!=userId){
            return res.redirect('/mybooks')
        }
        Book.getBookDetails(bookId)
        .then(result2=>{
            console.log(result2[0]);
            res.render('admin/uploadbooks',{
            title:result2[0][0].title,
            sp:result2[0][0].sp,
            op:result2[0][0].op,
            descr:result2[0][0].description,
            author:result2[0][0].author,
            language:result2[0][0].lang,
            genre:result2[0][0].genre,
            condition:result2[0][0].bcondition,
            id:result2[0][0].id,
            path:'/editBook'
        })
        })

        
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.postEditBook=(req,res,next)=>{
    console.log('kjhjh');
    console.log(req.body);
    console.log(req.file);
    const title=req.body.title;
    const orignal_price=req.body.orignal_price;
    const selling_price=req.body.selling_price;
    const genre=req.body.genre;
    const language=req.body.language;
    const authorName=req.body.author;
    const image=req.file;
    const imageUrl=image.path;
    const description=req.body.description;
    const condition=req.body.condition;
    const user_id=req.user.id;
    const book_id=req.body.id;
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
               Book.getBookDetailsById(book_id)
               .then(result1=>{
                    const pimageUrl=result1[0][0].imageUrl;
                    console.log(pimageUrl);
                    cloudinary_util.uploader.destroy(pimageUrl)
                    .then(imaged=>{
                        cloudinary_util.uploader.upload(imageUrl, {
                            folder: 'bookExchange',
                            format: 'jpg'
                        }).then(imageUpload=>{
                            const public_id=imageUpload.secure_url;
                            console.log(imageUpload);
                            console.log("final"+aid);
                            file_handling.delete_file(imageUrl).then(filed=>{
                                        console.log(req.body);
                                        const book=new Book(title,orignal_price,selling_price,user_id,genre,language,aid,imageUrl,description,condition);
                                        console.log(book);
                                        Book.editBookByid(book_id,title,orignal_price,selling_price,user_id,genre,language,aid,public_id,description,condition)
                                        .then(result=>{
                                            console.log('book-updated!');
                                            return res.redirect('/myBooks')
                                        })
                                        .catch(err=>{
                                            console.log(err);
                                        });
                            })
                    })
                    
               })
                
    })
})
    .catch(err=>{
        console.log(err);
    
})
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
    const description=req.body.description;
    const condition=req.body.condition;
    // console.log();
   
    // console.log(image);
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
                return cloudinary_util.uploader.upload(imageUrl, {
                    folder: 'bookExchange',
                    format: 'jpg'
                }).then(imageUpload=>{
                    const public_id=imageUpload.secure_url;
                    console.log(imageUpload);
                    console.log("final"+aid);
                    return file_handling.delete_file(imageUrl).then(filed=>{
                        const book=new Book(title,orignal_price,selling_price,user_id,genre,language,aid,public_id,description,condition);
                        // console.log(book);
                        return book.addBook()
                        .then(result=>{
                            console.log('book-updated!');
                            return res.redirect('/myBooks')
                        })
                        .catch(err=>{
                            console.log(err);
                        });
                        })
                    })

                // console.log(req.body);
                
                
    })
    .catch(err=>{
        console.log(err);
    });
}
    
   
   




exports.getMyBook=(req,res,next)=>{
    Book.getBookByUserId(req.user.id)
    .then(books=>{
        console.log('my books:');
        console.log(books[0]);
        res.render('admin/myBook2',{
            prods:books[0],
            path:'/mybooks'
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

exports.postAddAddress=(req,res,next)=>{
    const user_id=req.user.id;
    console.log(req.body);
    let def;
    if(req.body.make_default=='on')
    def=1;
    else
    def=0;
    let id;
    const address=new Address(req.body.locality,req.body.city,req.body.state,req.body.pin_code,'home',user_id,req.body.district,def);
    address.addAddress()
    .then(result=>{
        console.log(result[0]);
        id=result[0].insertId;
        console.log(id);
        console.log('address added');
        if(req.body.make_default=='on'){
            console.log(1);
            Address.removeDefaultExceptOne(id,req.user.id)
            .then(result1=>{
                console.log(result1[0]);
            })
           
        }
        res.redirect('/showOrders')
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(address);
    

    
}