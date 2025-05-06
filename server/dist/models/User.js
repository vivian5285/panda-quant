import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    level: {
        type: Number,
        default: 1
    },
    permissions: [{
            type: String
        }],
    referrerId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    referrer: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
userSchema.methods['comparePassword'] = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this['password']);
};
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this['password'] = await bcrypt.hash(this['password'], 10);
    }
    next();
});
export const User = model('User', userSchema);
export default User;
//# sourceMappingURL=User.js.map