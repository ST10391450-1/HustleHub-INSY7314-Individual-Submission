const config = require('./src/config/config');

console.log('Config Loaded');

console.log({
    environment: config.environment,
    port: config.port,
    httpsEnabled: config.https.enabled,
    jwtExpiresIn: config.authentication.jwtExpiresIn,
    bcryptSaltRounds: config.security.bcryptSaltRounds,
    enumerationSafeRegistration:
        config.security.enumerationSafeRegistration
});