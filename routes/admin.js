const express=require('express');
const router=express.Router();
const adminController=require('../controllers/admin');
const isAuth=require('../middlewares/isAuth')



router.get('/addBook',isAuth,adminController.getAddBook);

router.post('/addBook',isAuth,adminController.postAddBook);

router.get('/myBooks',isAuth,adminController.getMyBook);

router.post('/deleteBook',isAuth,adminController.deleteBook);

router.get('/userDetails/:id',isAuth,adminController.getUserDetails)

router.get('/editBook/:id',isAuth,adminController.getEditBook);
router.post('/editBook/:id',isAuth,adminController.postEditBook);
module.exports=router