module.exports = {
  name: 'clientReady',
  run: async (client) => {
    const prefix = '[GATEWAY]';

    const safeLog = (...args) => {
      try {
        console.log(...args);
      } catch (_) {}
    };

    safeLog(`${prefix} debug logger enabled`);

    client.on('ready', () => {
      safeLog(`${prefix} ready ${client.user?.tag} (${client.user?.id})`);
    });

    client.on('invalidated', () => {
      safeLog(`${prefix} invalidated`);
    });

    client.on('warn', (w) => {
      safeLog(`${prefix} warn`, w);
    });

    client.on('error', (e) => {
      safeLog(`${prefix} error`, e);
    });

    client.on('shardReady', (shardId) => {
      safeLog(`${prefix} shardReady`, shardId);
    });

    client.on('shardResume', (shardId, replayedEvents) => {
      safeLog(`${prefix} shardResume`, shardId, { replayedEvents });
    });

    client.on('shardDisconnect', (event, shardId) => {
      safeLog(`${prefix} shardDisconnect`, shardId, {
        code: event?.code,
        reason: event?.reason,
        wasClean: event?.wasClean
      });
    });

    client.on('shardReconnecting', (shardId) => {
      safeLog(`${prefix} shardReconnecting`, shardId);
    });

    client.on('shardError', (error, shardId) => {
      safeLog(`${prefix} shardError`, shardId, error);
    });

    client.rest?.on('rateLimited', (info) => {
      safeLog(`${prefix} rateLimited`, {
        route: info?.route,
        method: info?.method,
        timeToReset: info?.timeToReset,
        limit: info?.limit,
        global: info?.global
      });
    });

    if (client.ws) {
      client.ws.on('close', (event) => {
        safeLog(`${prefix} wsClose`, {
          code: event?.code,
          reason: event?.reason,
          wasClean: event?.wasClean
        });
      });
    }
  }
};
