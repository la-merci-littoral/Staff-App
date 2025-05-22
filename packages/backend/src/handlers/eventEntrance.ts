import express from 'express';
import BookingModel from '../models/bookingModel';
import EventModel from '../models/eventModel';
import { EntranceCheckReq, EntranceCheckRes } from 'types';
import typia from 'typia';

const router = express.Router();

router.get('/check/:booking_id', async (req, res) => {
    if (typia.is<EntranceCheckReq>(req.params)) {
        const booking: EntranceCheckRes | null = await BookingModel.findOne({$and: [{booking_id: req.params.booking_id}, {'payment.hasPaid': true}]})
        if (!booking){
            res.status(404).send('Booking not found')
            return
        }
        const bookingObject = booking.toObject()
        const eventDetails = await EventModel.findById(booking.event_id);

        bookingObject.event_name = eventDetails!.display_name;
        bookingObject.category = booking.vip ? "Offert" : eventDetails!.price_categories.find((cat) => cat.price == bookingObject.payment.price)!.display
        res.send(bookingObject)
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
            res.status(200).send({message: "confirmed"})
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