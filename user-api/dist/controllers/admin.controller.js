"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const errors_1 = require("../utils/errors");
class AdminController {
    constructor(userModel) {
        this.userModel = userModel;
        this.listUsers = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { users, total } = await this.userModel.findAllUsers(page, limit);
                res.json({
                    status: 'success',
                    data: {
                        users: users.map(user => ({
                            ...user,
                            password_hash: undefined
                        })),
                        pagination: {
                            page,
                            limit,
                            total,
                            totalPages: Math.ceil(total / limit)
                        }
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Error listing users'
                });
            }
        };
        this.searchUsers = async (req, res) => {
            try {
                const { query } = req.query;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (!query) {
                    throw new errors_1.ValidationError('Search query is required');
                }
                const { users, total } = await this.userModel.searchUsers(query, page, limit);
                res.json({
                    status: 'success',
                    data: {
                        users: users.map(user => ({
                            ...user,
                            password_hash: undefined
                        })),
                        pagination: {
                            page,
                            limit,
                            total,
                            totalPages: Math.ceil(total / limit)
                        }
                    }
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        status: 'error',
                        message: 'Error searching users'
                    });
                }
            }
        };
        this.updateUserRole = async (req, res) => {
            try {
                const { id } = req.params;
                const { role, isAdmin, adminType } = req.body;
                if (!role) {
                    throw new errors_1.ValidationError('Role is required');
                }
                const user = await this.userModel.updateUserRole(parseInt(id), role, isAdmin || false, adminType);
                res.json({
                    status: 'success',
                    data: {
                        user: {
                            ...user,
                            password_hash: undefined
                        }
                    }
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        status: 'error',
                        message: 'Error updating user role'
                    });
                }
            }
        };
        this.updateUserPermissions = async (req, res) => {
            try {
                const { id } = req.params;
                const { permissions } = req.body;
                if (!permissions) {
                    throw new errors_1.ValidationError('Permissions are required');
                }
                const user = await this.userModel.updateUserPermissions(parseInt(id), permissions);
                res.json({
                    status: 'success',
                    data: {
                        user: {
                            ...user,
                            password_hash: undefined
                        }
                    }
                });
            }
            catch (error) {
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        status: 'error',
                        message: 'Error updating user permissions'
                    });
                }
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const { id } = req.params;
                await this.userModel.deleteUser(parseInt(id));
                res.json({
                    status: 'success',
                    message: 'User deleted successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Error deleting user'
                });
            }
        };
    }
}
exports.AdminController = AdminController;
