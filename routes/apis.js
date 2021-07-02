const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// admin restaurant routes
router.get('/admin/restaurants', adminController.getRestaurants)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
// admin category routes
router.get('/admin/categories', categoryController.getCategories)

module.exports = router
