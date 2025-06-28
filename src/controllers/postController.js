const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('❌ Error en getAllPosts:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const postId = parseInt(id);
  if (isNaN(postId)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { email: true } },
        comments: {
          include: { author: { select: { email: true } } },
        },
      },
    });

    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    console.error('❌ Error en getPostById:', error);
    res.status(500).json({ message: 'Error al obtener el post' });
  }
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (!title || !content || !userId) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('❌ Error en createPost:', error);
    res.status(500).json({ message: 'Error al crear el post' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const postId = parseInt(id);
  const userId = req.user?.userId;

  if (isNaN(postId)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    if (post.authorId !== userId) return res.status(403).json({ message: 'No autorizado' });

    // 🔥 Eliminar primero los comentarios relacionados
    await prisma.comment.deleteMany({ where: { postId } });

    // 🔥 Luego eliminar el post
    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: 'Post y comentarios eliminados correctamente' });
  } catch (error) {
    console.error('❌ Error en deletePost:', error);
    res.status(500).json({ message: 'Error al eliminar el post' });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const postId = parseInt(id);
  const userId = req.user?.userId;

  if (isNaN(postId)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    if (post.authorId !== userId) return res.status(403).json({ message: 'No autorizado' });

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('❌ Error en updatePost:', error);
    res.status(500).json({ message: 'Error al actualizar el post' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
};
