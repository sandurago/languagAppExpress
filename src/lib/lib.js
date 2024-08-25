const moment = require('moment');

function formatDate() {
  return moment().format('YYYY/MM/DD HH:mm:ss');
}

function dateWithoutTime(date) {
  return moment(date, 'YYYY/MM/DD').format('MMMM Do YYYY');
}

function formatFullDate(date) {
  return moment(date).format('MMMM Do YYYY');
}

module.exports = { formatDate, dateWithoutTime, formatFullDate };
