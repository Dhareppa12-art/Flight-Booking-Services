const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize')
const { Booking } = require('../models');
const CrudRepository = require('./crud-repository');
const { createBooking } = require('../services/booking-service');
const { Transaction, where, TableHints } = require('sequelize');
const AppError = require('../utils/errors/app-error');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(DataTransfer, Transaction) {
        const response = await Booking.create(DataTransfer, {Transaction: Transaction});
        return response
    }
    async get(data) {
        const response = await this.model.findByPk(data, { transaction: transaction});
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND)
        }
        return response;
    }
    async update(id, data, transaction) {
        const response = await this.model.update(data, {
                where: {
                    id:id
                }
        }, {transaction: transaction})
        return response;
    }
    
    async canceloldBookings(timestamp) {
        const response = await Booking.find({
            where: {
                createdAt: {
                    [Op.get]: timestamp
                }
            }
        });
        return response;
    }
}            
            
       

module.exports = BookingRepository;