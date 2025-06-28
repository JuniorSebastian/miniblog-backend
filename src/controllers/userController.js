const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            postId: true,
          },
        },
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};

module.exports = { getProfile };
