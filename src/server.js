
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = require('./app');
const config = require('./config/config');
const { connectDatabase, disconnectDatabase } = require('./config/database');


async function startServer() {
    try {

        await connectDatabase();

        let server;

        if (config.https.enabled) {
            const credentials = {
                key: fs.readFileSync(config.https.keyPath),
                cert: fs.readFileSync(config.https.certificatePath)
            };

            server = https.createServer(credentials, app);
        } else {
            if (config.environment === 'production') {
                throw new Error('HTTPS is required in production.');
            }

            console.warn('WARNING: Running without HTTPS. Development only.');

            server = http.createServer(app);
        }

        server.listen(config.port, () => {
            const protocol = config.https.enabled ? 'https' : 'http';

            console.log(
                `HustleHub+ API running at ${protocol}://localhost:${config.port}`
            );
        });

        return server;
    } catch (error) {
        console.error('Failed to start HustleHub+ API:', error.message);

        await disconnectDatabase().catch(() => {});

        process.exit(1);
    }
}
async function shutdownServer(server) {
    console.log('Shutting down HustleHub+ API...');

    if (server) {
        await new Promise((resolve, reject) => {
            server.close(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    await disconnectDatabase();

    console.log('HustleHub+ API shutdown completed.');
}
if (require.main === module) {
    let server;

    startServer().then(startedServer => {
        server = startedServer;
    });

    process.on('SIGINT', async () => {
        try {
            await shutdownServer(server);
            process.exit(0);
        } catch (error) {
            console.error('Shutdown failed:', error.message);
            process.exit(1);
        }
    });

    process.on('SIGTERM', async () => {
        try {
            await shutdownServer(server);
            process.exit(0);
        } catch (error) {
            console.error('Shutdown failed:', error.message);
            process.exit(1);
        }
    });
}

module.exports = {
    startServer,
    shutdownServer
};