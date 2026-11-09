const winston = require('winston');
const path = require('path');
const { WinstonTransport: AxiomTransport } = require('@axiomhq/winston');

const logDirectory = path.join(process.cwd(), 'logs');

const transports = [

    new winston.transports.Console(),

    new winston.transports.File({
        filename: path.join(logDirectory, 'error.log'),
        level: 'error'
    }),

    new winston.transports.File({
        filename: path.join(logDirectory, 'combined.log')
    })
];

if (process.env.AXIOM_DATASET && process.env.AXIOM_TOKEN) {
    transports.push(
        new AxiomTransport({
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN
        })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',

    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({
            stack: true
        }),
        winston.format.json()
    ),

    defaultMeta: {
        service: 'hustlehub-api'
    },

    transports
});

const logInfo = (message, metadata = {}) => {
    logger.info(message, metadata);
};

const logWarning = (message, metadata = {}) => {
    logger.warn(message, metadata);
};

const logError = (message, metadata = {}) => {
    logger.error(message, metadata);
};

module.exports = {
    logger,
    logInfo,
    logWarning,
    logError
};
