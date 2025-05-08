import mongoose from 'mongoose';
import { INotificationDocument } from '../types/Notification';
export declare const Notification: mongoose.Model<INotificationDocument, {}, {}, {}, mongoose.Document<unknown, {}, INotificationDocument, {}> & INotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Notification;
//# sourceMappingURL=Notification.d.ts.map