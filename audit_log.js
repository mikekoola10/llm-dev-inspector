// Audit Logging Module

// Stub for chrome.storage.local
const storage = {
    logs: []
};

const MAX_LOG_ENTRIES = 100;

/**
 * Adds an entry to the persistent audit log.
 * @param {object} entry - The log entry object.
 */
export function auditLog(entry) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        ...entry
    };

    // In a real extension, this would use chrome.storage.local.set
    storage.logs.push(logEntry);

    // Keep the log size manageable
    if (storage.logs.length > MAX_LOG_ENTRIES) {
        storage.logs.shift();
    }

    console.log("AUDIT LOG (Persisted Stub):", logEntry);
}

/**
 * Retrieves the full audit log.
 * @returns {Promise<Array<object>>} - The array of log entries.
 */
export async function getAuditLog() {
    // In a real extension, this would use chrome.storage.local.get
    return storage.logs;
}

/**
 * Clears the audit log.
 */
export function clearAuditLog() {
    storage.logs = [];
    console.log("Audit Log Cleared.");
}
