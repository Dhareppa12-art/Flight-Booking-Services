const cron = require('node-cron');

const bookingService = require('../../services/booking-service');

function scheduleCrons(){
    cron.schedule('*/30 * * * *', async () => {
        const response = await bookingService.canceloldBookings();
        console.log(response)
    });
}

module.exports = scheduleCrons;