import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'    // ← also good to hash here

const router = Router()
const prisma = new PrismaClient()

// GET  /api/users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ 
      select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, status: true, role: true }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' })
  }
})

// POST /api/users
router.post('/', async (req, res): Promise<any> => {
  const { firstName, lastName, email, phoneNumber, role, status, password } = req.body
  if (!firstName || !lastName || !email || !phoneNumber || !role || !status || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }
  try {
    const hashed = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: { firstName, lastName, email, phoneNumber, role, status, password: hashed, confirmed: true },
    })
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Failed to create user.' })
  }
})

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, role, status } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, email, phoneNumber, role, status },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

export default router
