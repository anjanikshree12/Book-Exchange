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
router.post('/addToCart',isAuth,shopController.addToCart);
router.get('/cart',isAuth,shopController.getCart);
router.post('/removeFromCart',isAuth,shopController.removeFromCart)
router.post('/order',isAuth,shopController.postOrder);
router.get('/showOrders',isAuth,shopController.getOrders);
router.get('/bookDetails/:id',isAuth,shopController.getBookDetails)
router.get('/languageBook/:language',isAuth,shopController.getBooksByLanguage)
module.exports=router