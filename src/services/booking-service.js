const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');  // import the class
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

// ✅ create an instance of BookingRepository (different name)
const bookingRepository = new BookingRepository();


async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(data.noofSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noofSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await BookingRepository.create(bookingPayload, transaction);
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noofSeats
        })
        await transaction.commit();
        return booking
    } catch(error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await BookingRepository.get(data.bookingId, transaction);
        if(bookingDetails.status = CANCELLED) {
            throw new AppError('the booking has expired', StatusCodes.BAD_REQUEST)
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000) {
            await BookingRepository.update(data.bookingId, {status: CANCELLED}, transaction);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost != data.totalCost) {
             throw new AppError('the amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId) {
            throw new AppError('the user corresponding to the booking doestnt match', StatusCodes.BAD_REQUEST)
        }
        await BookingRepository.update(data.bookingId, {status: BOOKED}, transaction);
        await transaction.commit();
    } catch(error) {
         await transaction.rollback();
         throw error;
    }
}

module.exports = {
    createBooking,
    makePayment
}