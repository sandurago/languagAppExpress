function date() {
    const date = new Date();
    return date.toLocaleString();
}

module.exports = { date };