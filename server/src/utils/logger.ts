import winston, { format, transports } from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf((info) => {
            const { timestamp, level, message } = info;
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [new transports.Console()],
});

export default logger;