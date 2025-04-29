import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const activeServices = await prisma.service.findMany({
            where: { status: 'active' },
        });
        res.json(activeServices);
    } catch (error) {
        console.error('Failed to fetch active services:', error);
        res.status(500).json({ error: 'Failed to fetch active services.' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const allServices = await prisma.service.findMany();
        res.json(allServices);
    } catch (error) {
        console.error('Failed to fetch all services:', error);
        res.status(500).json({ error: 'Failed to fetch all services.' });
    }
});

router.post('/', async (req: express.Request, res: express.Response): Promise<any> => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is missing or empty.' });
    }

    const { name, description, price_min, price_max, status } = req.body;

    try {
        const newService = await prisma.service.create({
            data: {
                name,
                description,
                price_min: parseFloat(price_min),
                price_max: parseFloat(price_max),
                status: status || 'active',
            },
        });

        res.status(201).json(newService);
    } catch (error) {
        console.error('Request body:', req.body);
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to create service.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price_min, price_max, status } = req.body;

    try {
        const updatedService = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price_min: parseFloat(price_min),
                price_max: parseFloat(price_max),
                status,
            },
        });

        res.status(200).json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.service.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Service deleted successfully.' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service.' });
    }
});

export default router;