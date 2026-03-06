const express = require('express');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

// login
router.post('/login', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log('Login attempt - Username:', username, 'Password:', password);
    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
      console.log('Admin found:', admin);
      if (admin) {
        const token = JwtUtil.genToken(admin.username, admin.password);
        res.json({ success: true, message: 'Authentication successful', token: token });
      } else {
        res.json({ success: false, message: 'Incorrect username or password' });
      }
    } else {
      res.json({ success: false, message: 'Please input username and password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token: token });
  } catch (error) {
    console.error('Token check error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// API tạo category (POST)
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

// API cập nhật category (PUT)
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

// THÊM MỚI: API xóa category (DELETE)
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // get data
  var products = await ProductDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// test endpoint - get all admins
router.get('/all', async function (req, res) {
  try {
    const admins = await AdminDAO.selectAll();
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// test endpoint - create admin
router.post('/create', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      const admin = await AdminDAO.insert(username, password);
      res.json({ success: true, message: 'Admin created', data: admin });
    } else {
      res.json({ success: false, message: 'Please provide username and password' });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;