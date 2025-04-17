const path = require('path');

const resources = ['global_styles.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
