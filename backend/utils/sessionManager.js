// Session Manager - AI Data Explainer+

const sessions = new Map();
const constants = require('../config/constants');

class SessionManager {
    createSession(sessionId, sessionData) {
        sessions.set(sessionId, {
            ...sessionData,
            createdAt: new Date(),
            lastAccessed: new Date()
        });
        console.log(`Session created: ${sessionId}`);
    }

    getSession(sessionId) {
        const session = sessions.get(sessionId);
        if (session) {
            session.lastAccessed = new Date();
            return session;
        }
        return null;
    }

    updateSession(sessionId, updates) {
        const session = sessions.get(sessionId);
        if (session) {
            Object.assign(session, updates);
            session.lastAccessed = new Date();
            console.log(`Session updated: ${sessionId}`);
        }
    }

    deleteSession(sessionId) {
        const session = sessions.get(sessionId);
        if (session) {
            // Clean up uploaded file
            const fs = require('fs');
            if (session.filepath && fs.existsSync(session.filepath)) {
                fs.unlinkSync(session.filepath);
                console.log(`File deleted: ${session.filepath}`);
            }
            sessions.delete(sessionId);
            console.log(`Session deleted: ${sessionId}`);
        }
    }

    getAllSessions() {
        return Array.from(sessions.values());
    }

    cleanupExpiredSessions() {
        const now = new Date();
        const expiredSessions = [];

        sessions.forEach((session, sessionId) => {
            const age = now - session.lastAccessed;
            if (age > constants.SESSION_TIMEOUT) {
                expiredSessions.push(sessionId);
            }
        });

        expiredSessions.forEach(sessionId => {
            this.deleteSession(sessionId);
        });

        console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
}

// Run cleanup every 5 minutes
const sessionManager = new SessionManager();

if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        sessionManager.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
}

module.exports = sessionManager;
