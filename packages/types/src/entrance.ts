import { IBooking } from "./bookings";

export interface EntranceCheckReq {
    booking_id: string;
}

export interface EntranceCheckRes extends IBooking {
    event_name?: string;
    category?: string;
}