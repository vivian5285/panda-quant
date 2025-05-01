import { IMonitoring } from '../types/IMonitoring';
export declare const Monitoring: import("mongoose").Model<IMonitoring, {}, {}, {}, import("mongoose").Document<unknown, {}, IMonitoring, {}> & IMonitoring & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Monitoring;
