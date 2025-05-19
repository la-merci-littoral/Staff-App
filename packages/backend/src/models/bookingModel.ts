import { Schema, model } from "mongoose";
import { IBooking } from "../../../types";

const BookingSchema: Schema<IBooking> = new Schema({
    _id: { type: String, required: true },
    booking_id: { type: String, required: true },
    member_id: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    attendants: { type: Number, required: true },
    event_id: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    payment: {
        hasPaid: { type: Boolean, required: true },
        date: { type: Date, required: true },
        method: { type: String, required: true },
        intentId: { type: String, required: true },
        price: { type: Number, required: true }
    },
    vip: { type: Boolean, required: false, default: false },
    entered: { type: Boolean, required: false, default: false },
})

const BookingModel = model<IBooking>("booking", BookingSchema, "inscription");
export default BookingModel;