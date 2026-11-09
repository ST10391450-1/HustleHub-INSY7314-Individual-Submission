
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = require('./app');
const config = require('./config/config');
const UserRepository = require('./repositories/UserRepository');

//region Server Initialisation

async function startServer() {
    try {
        const userRepository = new UserRepository();
        await userRepository.initialise();

        let server;

        if (config.https.enabled) {
            const credentials = {
                key: fs.readFileSync(config.https.keyPath),
                cert: fs.readFileSync(config.https.certificatePath)
            };

            server = https.createServer(credentials, app);

            server.listen(config.port, () => {
                console.log(`HustleHub+ API running at https://localhost:${config.port}`);
            });
        } else {
            if (config.environment === 'production') {
                throw new Error('HTTPS is required in production.');
            }

            console.warn('WARNING: Running without HTTPS. Development only.');

            server = http.createServer(app);

            server.listen(config.port, () => {
                console.log(`HustleHub+ API running at http://localhost:${config.port}`);
            });
        }

        return server;
    } catch (error) {
        console.error('Failed to start HustleHub+ API:', error.message);
        process.exit(1);
    }
}

//endregion

//region Application Entry Point

if (require.main === module) {
    startServer();
}

module.exports = startServer;

//endregion
