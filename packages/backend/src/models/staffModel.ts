import { InternalStaffInfo } from 'types';
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema<InternalStaffInfo>({
    username: { type: String, required: true },
    name: { type: String, required: true },
    pwdH: { type: String, required: true },
    roles: { type: [String], required: true }
}, { collection: "staff" })

const StaffModel = mongoose.model<InternalStaffInfo>("staff", staffSchema)

export default StaffModel