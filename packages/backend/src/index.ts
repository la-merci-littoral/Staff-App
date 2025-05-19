import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'


const envPath = process.env.NODE_ENV === 'production' ? __dirname + '/../.env.production' : __dirname + '/../.env.development';
require('dotenv').config({ path: envPath });
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express()
app.use(express.json(), express.urlencoded(), cors())

import authHandler from './handlers/auth'
import entranceHandler from './handlers/eventEntrance'

const router = express.Router()

router.use((req, res, next) => {
    if (req.path != '/auth/token') {
        if (!req.headers.authorization) {
            res.status(401).send('Unauthorized')
            return
        }
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET!, async (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err || !decoded) {
                res.status(401).send('Unauthorized')
                return
            }
            next()
        })
    } else { next() }
})
router.use('/auth', authHandler)
router.use('/entrances', entranceHandler)

// Mount the router on the app
app.use(router);

app.listen(process.env.PORT!, () => {console.log("Listening on port", process.env.PORT!)})