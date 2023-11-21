
// const { transports, format, createLogger } = require('winston');
import { transports, format, createLogger } from 'winston'


const winston_logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.File({
            filename: 'info-logger.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
        }),
    ],
});

const winston_exceptions = createLogger({
    transports: [
        new transports.File({
            filename: 'uncaught-exception.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
        }),
    ],
});

export { winston_logger, winston_exceptions };
