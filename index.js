const dotenv = require('dotenv');
dotenv.config({path: './prod.env'});
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
 })

const app = require('./app');

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful');
})

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log('server has started...');
})

process.on('unhandledRejection', (err) => {
   console.log(err.name, err.message);
   console.log('Unhandled rejection occured! Shutting down...');

   server.close(() => {
    process.exit(1);
   })
})


