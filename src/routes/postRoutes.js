const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
} = require('../controllers/postController');

// Rutas públicas
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Rutas protegidas
router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
