import express from 'express';
import BookingModel from '../models/bookingModel';
import { EntranceCheckReq } from 'types';
import typia from 'typia';

const router = express.Router();

router.get('/check/:booking_id', async (req, res) => {
    if (typia.is<EntranceCheckReq>(req.params)) {
        const booking = await BookingModel.findOne({booking_id: req.params.booking_id})
        if (!booking){
            res.status(404).send('Booking not found')
            return
        }
        res.send(booking)
    } else {
        res.status(400).send('Invalid booking ID')
    }
})

router.post('/confirm/:booking_id', async (req, res) => {
    if (typia.is<EntranceCheckReq>(req.params)) {
        const booking = await BookingModel.findOne({booking_id: req.params.booking_id})
        if (!booking){
            res.status(404).send('Booking not found')
            return
        }
        try {
            await BookingModel.updateOne({booking_id: req.params.booking_id}, {entered: true})
            res.status(200).send('Booking confirmed')
        } catch (err) {
            console.error('Error saving booking:', err)
            res.status(500).send('Error saving booking')
            return
        }
    } else {
        res.status(400).send('Invalid booking ID')
    }
})

export default router;