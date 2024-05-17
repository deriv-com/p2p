const path = require('path');

const resources = ['devices.scss', 'modals.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
