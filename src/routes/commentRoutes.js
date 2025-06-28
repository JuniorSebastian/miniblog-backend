const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

router.get('/:postId', getCommentsByPost);
router.post('/:postId', verifyToken, createComment);
router.put('/edit/:id', verifyToken, updateComment);
router.delete('/delete/:id', verifyToken, deleteComment);

module.exports = router;
