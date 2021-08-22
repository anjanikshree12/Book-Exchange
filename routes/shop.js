const express=require('express');
const shopController=require('../controllers/shop');
const router=express.Router();
const isAuth=require('../middlewares/isAuth')

router.get('/',isAuth,shopController.getHomePage);
router.get('/cityBook',isAuth,shopController.getCityBook);
router.get('/topAuthor',isAuth,shopController.getTopAuthors);
router.get('/authorBooks/:id',isAuth,shopController.getAuthorBooks);
router.get('/genreBook/:genre',isAuth,shopController.getBooksByGenre);
router.get('/genre',isAuth,shopController.getGenre);
module.exports=router