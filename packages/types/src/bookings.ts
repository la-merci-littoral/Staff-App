import { Document, Schema } from "mongoose";

export interface IBooking extends Document {
    _id: string;
    booking_id: string;
    member_id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    attendants: number;
    event_id: Schema.Types.ObjectId;
    date: Date;
    payment: {
        hasPaid: boolean;
        date: Date;
        method: string;
        intentId: string;
        price: number;
    };
    vip: boolean;
    entered: boolean;
}