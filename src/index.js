const express = require('express');

const { serverConfig, Logger } = require('./config');
const apiRoutes = require('./routes');
const { CRONS } = require('./utils/common')
 
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started the Server on PORT : ${serverConfig.PORT}`)
    CRONS();
})