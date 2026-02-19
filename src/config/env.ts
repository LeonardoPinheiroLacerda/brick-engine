export function isClientMode() {
    return process.env.APP_MODE === 'client';
}

export function isServerMode() {
    return process.env.APP_MODE === 'server';
}
