import { model, Model, Schema, Document } from "mongoose";

interface IEvent extends Document {
    display_name: string;
    date_start: Date;
    date_end: Date;
    location: string;
    price_categories: {
        type: 'member' | 'minor' | 'default';
        price: number;
        display: string;
    }[];
    order: number;
    limit: number;
    bookings_left: number;
    fields: ('name' | 'surname' | 'email' | 'phone' | 'attendants')[];
    booking_open: Date;
    booking_close: Date;
}

const EventSchema: Schema<IEvent> = new Schema({
    display_name: { type: String, required: true },
    date_start: { type: Date, required: true },
    date_end: { type: Date, required: true },
    location: { type: String, required: true },
    price_categories: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
        display: { type: String, required: true }
    }],
    order: { type: Number, required: true },
    limit: { type: Number, required: true },
    booking_open: { type: Date, required: true },
    booking_close: { type: Date, required: true },
});

const EventModel: Model<IEvent> = model("event", EventSchema, "evenement");
export default EventModel;