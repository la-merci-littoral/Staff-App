import { Request, Response } from 'express';
import { AuthReq, AuthRes } from 'types';
import StaffModel from '../models/staffModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    res.send('Auth API');
})

router.post('/token', async (req, res) => {
    const { username, password } = req.body as AuthReq;

    const result = await StaffModel.findOne({ "username": username });
    if (result === null) {
        res.status(401).json({ error: 'Invalid user' });
        return;
    }

    if (!(await bcrypt.compare(password, result.pwdH))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    const authResponse: AuthRes = {
        token: jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '24h' }),
        name: result.name,
        roles: result.roles
    };

    res.json(authResponse);
    return;
})

export default router;