const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        author: { select: { email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: userId,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear comentario', error });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
    if (comment.authorId !== userId) return res.status(403).json({ message: 'No autorizado' });

    const updated = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', error });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
    if (comment.authorId !== userId) return res.status(403).json({ message: 'No autorizado' });

    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario', error });
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
