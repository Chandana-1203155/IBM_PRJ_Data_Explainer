// Chat History Manager - AI Data Explainer+

class ChatHistoryManager {
    constructor() {
        this.histories = new Map();
        this.maxHistoryLength = 20; // Maximum messages per session
        this.maxSessions = 1000; // Maximum active sessions
    }

    addMessage(sessionId, role, content) {
        if (!this.histories.has(sessionId)) {
            this.histories.set(sessionId, []);
        }

        const history = this.histories.get(sessionId);
        
        // Add new message
        history.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        // Trim history if too long
        if (history.length > this.maxHistoryLength) {
            history.shift(); // Remove oldest message
        }

        // Clean up old sessions if too many
        if (this.histories.size > this.maxSessions) {
            const oldestSession = this.histories.keys().next().value;
            this.histories.delete(oldestSession);
        }
    }

    getHistory(sessionId) {
        return this.histories.get(sessionId) || [];
    }

    getFormattedHistory(sessionId) {
        const history = this.getHistory(sessionId);
        return history.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    clearHistory(sessionId) {
        this.histories.delete(sessionId);
    }

    getLastNMessages(sessionId, n) {
        const history = this.getHistory(sessionId);
        return history.slice(-n);
    }

    getSummary(sessionId) {
        const history = this.getHistory(sessionId);
        return {
            sessionId,
            messageCount: history.length,
            lastActivity: history.length > 0 ? history[history.length - 1].timestamp : null
        };
    }

    getAllSummaries() {
        const summaries = [];
        this.histories.forEach((history, sessionId) => {
            summaries.push({
                sessionId,
                messageCount: history.length,
                lastActivity: history.length > 0 ? history[history.length - 1].timestamp : null
            });
        });
        return summaries;
    }
}

module.exports = new ChatHistoryManager();
