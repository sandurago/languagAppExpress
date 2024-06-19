const moment = require('moment');

function formatDate() {
    return moment().format('DD/MM/YYYY HH:mm:ss');
}

function dateWithoutTime() {
    return moment().format('MMMM Do YYYY');
}

module.exports = { formatDate, dateWithoutTime };