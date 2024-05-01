const React = require('react');

module.exports = {
    process() {
        return `module.exports = ${JSON.stringify(React.Component)}`;
    },
};
