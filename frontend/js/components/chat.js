// Chat Component - AI Data Explainer+

const Chat = {
    sessionId: null,
    history: [],
    activeMessageId: null,
    isStreaming: false,
    messageCounter: 0,

    enable(sessionId) {
        const sameSession = this.sessionId === sessionId;
        this.sessionId = sessionId;
        this.isStreaming = false;
        this.activeMessageId = null;

        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        if (chatInput) {
            chatInput.disabled = false;
            chatInput.placeholder = 'Ask a question about your data...';
        }

        if (chatSend) {
            chatSend.disabled = false;
        }

        if (chatMessages) {
            if (!sameSession || this.history.length === 0) {
                this.history = [];
                chatMessages.innerHTML = '';
                this.renderMessages();
                this.addMessage('ai', 'Hello! I\'m ready to help you analyze your data. Ask me anything about your dataset.');
            } else {
                this.renderMessages();
            }
        }

        this.bindEvents();
        if (sessionId) {
            this.loadExistingHistory(sessionId);
        }
    },

    bindEvents() {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        if (chatSend && chatSend.dataset.bound !== 'true') {
            chatSend.addEventListener('click', () => this.sendMessage());
            chatSend.dataset.bound = 'true';
        }

        if (chatInput && chatInput.dataset.bound !== 'true') {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            chatInput.dataset.bound = 'true';
        }
    },

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const question = chatInput?.value?.trim();

        if (!question || !this.sessionId || this.isStreaming) {
            return;
        }

        this.addMessage('user', question);
        chatInput.value = '';

        this.isStreaming = true;
        this.setInputDisabled(true);

        const assistantMessageId = this.addMessage('ai', '', true);
        this.activeMessageId = assistantMessageId;

        try {
            const response = await API.chat(this.sessionId, question);
            await this.handleStreamingResponse(response, assistantMessageId);
        } catch (error) {
            console.error('Chat error:', error);
            this.updateMessage(assistantMessageId, 'I apologize, but I\'m unable to connect to the AI service right now. Please try again later or check your AI provider configuration.', false);
        } finally {
            this.isStreaming = false;
            this.activeMessageId = null;
            this.setInputDisabled(false);
        }
    },

    generateFallbackResponse(question) {
        console.log('Generating fallback response for question:', question);
        const dataset = App.state.dataset;

        if (!dataset || !dataset.metadata) {
            this.addMessage('ai', 'I apologize, but I\'m unable to connect to the AI service right now. Please try again later or check your AI provider configuration.');
            return;
        }

        const metadata = dataset.metadata;
        const questionLower = question.toLowerCase();

        let response = '';

        if (questionLower.includes('row') || questionLower.includes('record') || questionLower.includes('count')) {
            response = `The dataset contains ${metadata.rows} rows/records.`;
        } else if (questionLower.includes('column') || questionLower.includes('field')) {
            response = `The dataset has ${metadata.columns} columns: ${metadata.columnNames.slice(0, 5).join(', ')}${metadata.columnNames.length > 5 ? '...' : ''}.`;
        } else if (questionLower.includes('size') || questionLower.includes('file')) {
            response = `The file size is ${this.formatBytes(metadata.fileSize)}.`;
        } else if (questionLower.includes('data') || questionLower.includes('dataset')) {
            response = `This dataset has ${metadata.rows} rows and ${metadata.columns} columns with a file size of ${this.formatBytes(metadata.fileSize)}. The columns are: ${metadata.columnNames.join(', ')}.`;
        } else if (questionLower.includes('help') || questionLower.includes('what can')) {
            response = `I can help you analyze your dataset with ${metadata.rows} rows and ${metadata.columns} columns. You can ask me about row counts, column information, data size, or general dataset statistics. Note: AI-powered analysis is currently unavailable.`;
        } else {
            response = `I apologize, but the AI service is currently unavailable. I can tell you that your dataset has ${metadata.rows} rows and ${metadata.columns} columns. For detailed analysis, please check your AI provider configuration.`;
        }

        this.addMessage('ai', response);
    },

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    addMessage(role, content, pending = false) {
        const id = `msg-${Date.now()}-${++this.messageCounter}`;
        this.history.push({ id, role, content, pending });
        this.renderMessages();
        return id;
    },

    updateMessage(messageId, content, pending = false) {
        const message = this.history.find((entry) => entry.id === messageId);
        if (message) {
            message.content = content;
            message.pending = pending;
            this.renderMessages();
        }
    },

    renderMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        if (this.history.length === 0) {
            chatMessages.innerHTML = `
                <div class="chat-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Ask a question about your dataset</p>
                </div>
            `;
            return;
        }

        chatMessages.innerHTML = '';
        const fragment = document.createDocumentFragment();

        this.history.forEach((message) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${message.role}`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'chat-message-content';

            if (message.pending) {
                const typingIndicator = document.createElement('span');
                typingIndicator.className = 'typing-indicator';
                typingIndicator.textContent = '...';
                contentDiv.appendChild(typingIndicator);
            } else {
                contentDiv.textContent = message.content;
            }

            messageDiv.appendChild(contentDiv);
            fragment.appendChild(messageDiv);
        });

        chatMessages.appendChild(fragment);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    async loadExistingHistory(sessionId) {
        if (!sessionId) return;

        try {
            const response = await API.getChatHistory(sessionId);
            if (response?.success && Array.isArray(response.history)) {
                const normalizedHistory = response.history.map((message) => ({
                    id: `history-${message.timestamp || Date.now()}-${this.messageCounter++}`,
                    role: message.role,
                    content: message.content,
                    pending: false
                }));

                if (this.sessionId === sessionId && normalizedHistory.length > 0) {
                    this.history = normalizedHistory;
                    this.renderMessages();
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    },

    async handleStreamingResponse(response, messageId) {
        if (!response?.body?.getReader) {
            this.updateMessage(messageId, 'I apologize, but I\'m unable to connect to the AI service right now. Please try again later.', false);
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;

                    const payload = line.slice(6);
                    if (!payload) continue;

                    const data = JSON.parse(payload);

                    if (data.type === 'chunk') {
                        fullResponse += data.content || '';
                        if (this.activeMessageId === messageId) {
                            this.updateMessage(messageId, fullResponse, true);
                        }
                    } else if (data.type === 'done') {
                        fullResponse = data.fullResponse || fullResponse;
                        if (this.activeMessageId === messageId || !this.activeMessageId) {
                            this.updateMessage(messageId, fullResponse, false);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming response error:', error);
            this.updateMessage(messageId, fullResponse || 'I apologize, but I\'m unable to connect to the AI service right now. Please try again later.', false);
        }
    },

    setInputDisabled(disabled) {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        if (chatInput) chatInput.disabled = disabled;
        if (chatSend) chatSend.disabled = disabled;
    },

    reset() {
        this.sessionId = null;
        this.history = [];
        this.activeMessageId = null;
        this.isStreaming = false;

        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        if (chatInput) {
            chatInput.disabled = true;
            chatInput.value = '';
        }
        if (chatSend) chatSend.disabled = true;

        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Upload a dataset to start chatting</p>
                </div>
            `;
        }
    }
};
