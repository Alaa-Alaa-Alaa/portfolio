 // Emoji data
 const emojiCategories = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭']
  };

  // Initialize the chat interface
  class ChatUI {
    constructor() {
      this.contacts = [];
      this.conversations = {};
      this.selectedContact = null;
      this.editingContactId = null;
      this.filesToSend = [];
      this.typingTimeout = null;
      this.isTyping = false;
      
      // Load data from localStorage if available
      this.loadFromLocalStorage();
      
      // Initialize UI components
      this.initElements();
      this.initEventListeners();
      this.initEmojiPicker();
      
      // Render initial state
      this.renderContacts();
      this.renderMessages();
      
      // If no contacts, show empty state
      if (this.contacts.length === 0) {
        this.loadSampleData();
      }
    }
    
    initElements() {
      // Cache DOM elements
      this.elements = {
        contactList: document.getElementById('contactList'),
        chatMessages: document.getElementById('chatMessages'),
        chatHeader: document.getElementById('chatHeader'),
        chatContactName: document.getElementById('chatContactName'),
        chatContactStatus: document.getElementById('chatContactStatus'),
        chatContactAvatar: document.getElementById('chatContactAvatar'),
        messageInput: document.getElementById('messageInput'),
        sendButton: document.getElementById('sendButton'),
        inputContainer: document.getElementById('inputContainer'),
        previewContainer: document.getElementById('previewContainer'),
        fileInput: document.getElementById('fileInput'),
        attachFile: document.getElementById('attachFile'),
        emojiPickerBtn: document.getElementById('emojiPickerBtn'),
        emojiPicker: document.getElementById('emojiPicker'),
        emojiPickerBody: document.getElementById('emojiPickerBody'),
        searchInput: document.getElementById('searchInput'),
        contactModal: document.getElementById('contactModal'),
        modalTitle: document.getElementById('modalTitle'),
        contactNameInput: document.getElementById('contactNameInput'),
        contactStatusInput: document.getElementById('contactStatusInput'),
        saveContact: document.getElementById('saveContact'),
        closeModal: document.getElementById('closeModal'),
        cancelModal: document.getElementById('cancelModal'),
        confirmModal: document.getElementById('confirmModal'),
        confirmMessage: document.getElementById('confirmMessage'),
        confirmAction: document.getElementById('confirmAction'),
        cancelConfirm: document.getElementById('cancelConfirm'),
        closeConfirmModal: document.getElementById('closeConfirmModal'),
        notification: document.getElementById('notification'),
        notificationTitle: document.getElementById('notificationTitle'),
        notificationMessage: document.getElementById('notificationMessage'),
        closeNotification: document.getElementById('closeNotification'),
        menuToggle: document.querySelector('.menu-toggle'),
        sidebar: document.querySelector('.sidebar'),
        newChat: document.querySelector('.new-chat')
      };
    }
    
    initEventListeners() {
      // Toggle sidebar on mobile
      this.elements.menuToggle.addEventListener('click', () => {
        this.elements.sidebar.classList.toggle('active');
      });
      
      // Send message on button click or Enter key
      this.elements.sendButton.addEventListener('click', () => this.sendMessage());
      this.elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      
      // Handle typing indicator
      this.elements.messageInput.addEventListener('input', () => {
        this.handleTyping();
        this.adjustTextareaHeight();
        this.toggleSendButton();
      });
      
      // File attachment
      this.elements.attachFile.addEventListener('click', () => this.elements.fileInput.click());
      this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
      
      // Emoji picker
      this.elements.emojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.elements.emojiPicker.classList.toggle('active');
      });
      
      // Close emoji picker when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.elements.emojiPicker.contains(e.target)) {
          this.elements.emojiPicker.classList.remove('active');
        }
      });
      
      // Search functionality
      this.elements.searchInput.addEventListener('input', () => this.filterContacts());
      
      // Modal actions
      this.elements.newChat.addEventListener('click', () => this.openContactModal());
      this.elements.closeModal.addEventListener('click', () => this.closeContactModal());
      this.elements.cancelModal.addEventListener('click', () => this.closeContactModal());
      this.elements.saveContact.addEventListener('click', () => this.saveContact());
      
      // Confirmation modal
      this.elements.closeConfirmModal.addEventListener('click', () => this.closeConfirmModal());
      this.elements.cancelConfirm.addEventListener('click', () => this.closeConfirmModal());
      
      // Notification
      this.elements.closeNotification.addEventListener('click', () => this.hideNotification());
      
      // Click outside modal to close
      this.elements.contactModal.addEventListener('click', (e) => {
        if (e.target === this.elements.contactModal) {
          this.closeContactModal();
        }
      });
      
      this.elements.confirmModal.addEventListener('click', (e) => {
        if (e.target === this.elements.confirmModal) {
          this.closeConfirmModal();
        }
      });
    }
    
    initEmojiPicker() {
      // Load emojis into the picker
      let emojiHTML = '';
      for (const [category, emojis] of Object.entries(emojiCategories)) {
        emojis.forEach(emoji => {
          emojiHTML += `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`;
        });
      }
      this.elements.emojiPickerBody.innerHTML = emojiHTML;
      
      // Emoji tab switching
      document.querySelectorAll('.emoji-picker-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.emoji-picker-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          const category = tab.dataset.category;
          let filteredEmojis = '';
          emojiCategories[category].forEach(emoji => {
            filteredEmojis += `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`;
          });
          this.elements.emojiPickerBody.innerHTML = filteredEmojis;
          
          // Add emoji selection handler
          this.addEmojiSelectionHandlers();
        });
      });
      
      // Initial emoji selection handlers
      this.addEmojiSelectionHandlers();
    }
    
    addEmojiSelectionHandlers() {
      document.querySelectorAll('.emoji-item').forEach(item => {
        item.addEventListener('click', () => {
          const emoji = item.dataset.emoji;
          this.elements.messageInput.value += emoji;
          this.elements.messageInput.focus();
          this.adjustTextareaHeight();
          this.toggleSendButton();
        });
      });
    }
    
    loadFromLocalStorage() {
      const savedContacts = localStorage.getItem('chatContacts');
      const savedConversations = localStorage.getItem('chatConversations');
      
      if (savedContacts) {
        this.contacts = JSON.parse(savedContacts);
      }
      
      if (savedConversations) {
        this.conversations = JSON.parse(savedConversations);
      }
    }
    
    saveToLocalStorage() {
      localStorage.setItem('chatContacts', JSON.stringify(this.contacts));
      localStorage.setItem('chatConversations', JSON.stringify(this.conversations));
    }
    
    loadSampleData() {
      // Sample contacts
      this.contacts = [
        { id: 1, name: 'Support Team', status: 'online', unread: 2 },
        { id: 2, name: 'Marketing Dept', status: 'offline', unread: 0 },
        { id: 3, name: 'Sales Team', status: 'online', unread: 5 },
        { id: 4, name: 'Tech Team', status: 'online', unread: 0 },
        { id: 5, name: 'HR Department', status: 'offline', unread: 1 }
      ];
      
      // Sample conversations
      this.conversations = {
        1: [
          { 
            sender: 'bot', 
            text: 'Hello from Support Team! How can we assist you today?', 
            timestamp: this.formatTime(new Date(Date.now() - 3600000)),
            reactions: { '👍': 1 }
          },
          { 
            sender: 'user', 
            text: 'I need help with my account login', 
            timestamp: this.formatTime(new Date(Date.now() - 3500000)) 
          },
          { 
            sender: 'bot', 
            text: 'Sure, I can help with that. Have you tried resetting your password?', 
            timestamp: this.formatTime(new Date(Date.now() - 3400000)) 
          }
        ],
        2: [
          { 
            sender: 'bot', 
            text: 'Welcome to Marketing Dept. We have a new campaign launching next week!', 
            timestamp: this.formatTime(new Date(Date.now() - 86400000)) 
          }
        ],
        3: [
          { 
            sender: 'bot', 
            text: 'Sales inquiry received. Our team will contact you shortly.', 
            timestamp: this.formatTime(new Date(Date.now() - 7200000)) 
          },
          { 
            sender: 'user', 
            text: 'Thanks, looking forward to hearing from you!', 
            timestamp: this.formatTime(new Date(Date.now() - 7000000)) 
          }
        ],
        4: [
          { 
            sender: 'bot', 
            text: 'Tech Team here. Your recent ticket has been resolved.', 
            timestamp: this.formatTime(new Date(Date.now() - 28800000)) 
          }
        ],
        5: [
          { 
            sender: 'bot', 
            text: 'Reminder: Please submit your timesheets by Friday.', 
            timestamp: this.formatTime(new Date(Date.now() - 172800000)) 
          }
        ]
      };
      
      this.saveToLocalStorage();
    }
    
    renderContacts(filteredContacts = null) {
      const contactsToRender = filteredContacts || this.contacts;
      this.elements.contactList.innerHTML = contactsToRender.map(contact => `
        <li class="contact-item ${this.selectedContact?.id === contact.id ? 'active' : ''}" data-id="${contact.id}">
          <div class="contact-avatar">${contact.name.charAt(0)}</div>
          <div class="contact-info">
            <h3 class="contact-name">${contact.name}</h3>
            <div class="contact-status">
              ${contact.status === 'online' ? '<span class="online-dot"></span>' : ''}
              ${contact.status}
              ${contact.unread > 0 ? `<span class="unread-count">${contact.unread}</span>` : ''}
            </div>
            ${this.conversations[contact.id]?.length ? 
              `<div class="last-message">${this.getLastMessagePreview(contact.id)}</div>` : ''}
          </div>
          <div class="action-buttons">
            <button class="edit-contact" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="delete-contact" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </li>
      `).join('');
      
      // Add event listeners for each contact item
      document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.action-buttons')) return;
          const contactId = parseInt(item.getAttribute('data-id'));
          this.selectContact(contactId);
          if (window.innerWidth <= 768) {
            this.elements.sidebar.classList.remove('active');
          }
        });
      });
      
      // Event listeners for edit and delete buttons
      document.querySelectorAll('.edit-contact').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const contactId = parseInt(e.target.closest('.contact-item').getAttribute('data-id'));
          this.openContactModal(contactId);
        });
      });
      
      document.querySelectorAll('.delete-contact').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const contactId = parseInt(e.target.closest('.contact-item').getAttribute('data-id'));
          this.showConfirmModal(
            'Delete Contact',
            `Are you sure you want to delete ${this.contacts.find(c => c.id === contactId)?.name}?`,
            () => this.deleteContact(contactId)
          );
        });
      });
    }
    
    getLastMessagePreview(contactId) {
      const messages = this.conversations[contactId];
      if (!messages || messages.length === 0) return '';
      
      const lastMessage = messages[messages.length - 1];
      let preview = lastMessage.text;
      
      // Truncate long messages
      if (preview.length > 30) {
        preview = preview.substring(0, 30) + '...';
      }
      
      // Add indicator for attachments
      if (lastMessage.attachments && lastMessage.attachments.length > 0) {
        preview = '📎 ' + (lastMessage.text || 'Attachment');
      }
      
      return preview;
    }
    
    filterContacts() {
      const searchTerm = this.elements.searchInput.value.toLowerCase();
      if (!searchTerm) {
        this.renderContacts();
        return;
      }
      
      const filtered = this.contacts.filter(contact => 
contact.name.toLowerCase().includes(searchTerm) ||
(this.conversations[contact.id]?.some(msg => 
  msg.text?.toLowerCase().includes(searchTerm))
)
);
      
      this.renderContacts(filtered);
    }
    
    selectContact(contactId) {
      this.selectedContact = this.contacts.find(c => c.id === contactId);
      
      // Reset unread count
      if (this.selectedContact) {
        this.selectedContact.unread = 0;
        this.saveToLocalStorage();
      }
      
      // Update chat header
      this.elements.chatContactName.textContent = this.selectedContact?.name || 'Select a Contact';
      this.elements.chatContactAvatar.textContent = this.selectedContact?.name.charAt(0) || '?';
      
      if (this.selectedContact) {
        this.elements.chatContactStatus.innerHTML = this.selectedContact.status === 'online' 
          ? '<span class="online-dot"></span> Online' 
          : 'Offline';
      } else {
        this.elements.chatContactStatus.textContent = '';
      }
      
      // Render messages
      this.renderMessages();
      this.renderContacts();
      
      // Focus input if contact is selected
      if (this.selectedContact) {
        this.elements.messageInput.focus();
      }
    }
    
    renderMessages() {
      const messagesContainer = this.elements.chatMessages;
      messagesContainer.innerHTML = '';
      
      if (!this.selectedContact) {
        messagesContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-comment-dots"></i>
            <h3>No conversation selected</h3>
            <p>Select a contact from the sidebar to start chatting or create a new conversation</p>
          </div>
        `;
        return;
      }
      
      const messages = this.conversations[this.selectedContact.id] || [];
      
      if (messages.length === 0) {
        messagesContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-comments"></i>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message</p>
          </div>
        `;
        return;
      }
      
      messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.sender);
        
        let messageHTML = `
          <div class="message-text">${msg.text || ''}</div>
        `;
        
        // Add attachments if they exist
        if (msg.attachments && msg.attachments.length > 0) {
          msg.attachments.forEach(attachment => {
            messageHTML += `
              <div class="attachment">
                <div class="attachment-icon">
                  <i class="fas ${this.getFileIcon(attachment.type)}"></i>
                </div>
                <div class="attachment-info">
                  <div class="attachment-name">${attachment.name}</div>
                  <div class="attachment-size">${this.formatFileSize(attachment.size)}</div>
                </div>
              </div>
            `;
          });
        }
        
        // Add timestamp and status
        messageHTML += `
          <div class="message-timestamp">
            ${msg.timestamp}
            ${msg.sender === 'user' ? '<span class="message-status">✓✓</span>' : ''}
          </div>
        `;
        
        // Add reactions if they exist
        if (msg.reactions && Object.keys(msg.reactions).length > 0) {
          messageHTML += '<div class="message-reactions">';
          for (const [emoji, count] of Object.entries(msg.reactions)) {
            messageHTML += `<div class="reaction">${emoji} ${count}</div>`;
          }
          messageHTML += '</div>';
        }
        
        // Add message actions (only for user messages)
        if (msg.sender === 'user') {
          messageHTML += `
            <div class="message-actions">
              <button class="message-action" title="Add reaction"><i class="far fa-smile"></i></button>
              <button class="message-action" title="Edit"><i class="far fa-edit"></i></button>
              <button class="message-action" title="Delete"><i class="far fa-trash-alt"></i></button>
            </div>
          `;
        }
        
        msgDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(msgDiv);
      });
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    getFileIcon(fileType) {
      if (!fileType) return 'fa-file';
      
      const type = fileType.split('/')[0];
      const subtypes = {
        pdf: 'fa-file-pdf',
        zip: 'fa-file-archive',
        audio: 'fa-file-audio',
        video: 'fa-file-video',
        image: 'fa-file-image',
        text: 'fa-file-alt',
        application: 'fa-file-code'
      };
      
      if (subtypes[fileType.split('/')[1]]) {
        return subtypes[fileType.split('/')[1]];
      }
      
      return subtypes[type] || 'fa-file';
    }
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    sendMessage() {
      const text = this.elements.messageInput.value.trim();
      if ((!text && this.filesToSend.length === 0) || !this.selectedContact) return;
      
      // Create new message object
      const newMessage = {
        sender: 'user',
        text: text,
        timestamp: this.formatTime(new Date()),
        reactions: {}
      };
      
      // Add attachments if any
      if (this.filesToSend.length > 0) {
        newMessage.attachments = this.filesToSend.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }));
      }
      
      // Initialize conversation array if it doesn't exist
      if (!this.conversations[this.selectedContact.id]) {
        this.conversations[this.selectedContact.id] = [];
      }
      
      // Add message to conversation
      this.conversations[this.selectedContact.id].push(newMessage);
      this.saveToLocalStorage();
      
      // Clear input and files
      this.elements.messageInput.value = '';
      this.filesToSend = [];
      this.elements.previewContainer.classList.add('hidden');
      this.elements.previewContainer.innerHTML = '';
      this.adjustTextareaHeight();
      this.toggleSendButton();
      
      // Render updated messages
      this.renderMessages();
      
      // Simulate typing indicator
      this.showTypingIndicator();
      
      // Simulate bot response after a delay
      setTimeout(() => {
        this.hideTypingIndicator();
        
        const botMessage = {
          sender: 'bot',
          text: this.generateBotResponse(text),
          timestamp: this.formatTime(new Date())
        };
        
        this.conversations[this.selectedContact.id].push(botMessage);
        this.saveToLocalStorage();
        this.renderMessages();
        
        // Show notification for new message if chat is not active
        if (document.hidden || !this.elements.sidebar.classList.contains('active')) {
          this.showNotification('New Message', `${this.selectedContact.name}: ${botMessage.text}`);
        }
      }, 1500 + Math.random() * 2000);
    }
    
    generateBotResponse(userMessage) {
      const responses = [
        "Thanks for your message. We'll get back to you soon.",
        "I've noted your request. Our team will follow up.",
        "That's a great question! Let me check on that for you.",
        "I understand your concern. Here's what I can tell you...",
        "We appreciate your feedback!",
        "Let me help you with that.",
        "I'm checking the details for you now.",
        "Thanks for reaching out. How can I assist you further?"
      ];
      
      // Simple keyword matching for more contextual responses
      if (userMessage.toLowerCase().includes('help')) {
        return "I'd be happy to help. What specifically do you need assistance with?";
      }
      
      if (userMessage.toLowerCase().includes('thank')) {
        return "You're welcome! Is there anything else I can help with?";
      }
      
      if (userMessage.toLowerCase().includes('problem') || userMessage.toLowerCase().includes('issue')) {
        return "I'm sorry to hear you're experiencing an issue. Let me help resolve that.";
      }
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      this.filesToSend = [...this.filesToSend, ...files];
      this.renderFilePreviews();
      this.toggleSendButton();
    }
    
    renderFilePreviews() {
      if (this.filesToSend.length === 0) {
        this.elements.previewContainer.classList.add('hidden');
        return;
      }
      
      this.elements.previewContainer.classList.remove('hidden');
      this.elements.previewContainer.innerHTML = this.filesToSend.map((file, index) => `
        <div class="file-preview">
          <i class="fas ${this.getFileIcon(file.type)}"></i>
          <span>${file.name}</span>
          <button class="remove-file" data-index="${index}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-file').forEach(button => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.currentTarget.getAttribute('data-index'));
          this.filesToSend.splice(index, 1);
          this.renderFilePreviews();
          this.toggleSendButton();
        });
      });
    }
    
    adjustTextareaHeight() {
      const textarea = this.elements.messageInput;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
    
    toggleSendButton() {
      const hasText = this.elements.messageInput.value.trim().length > 0;
      const hasFiles = this.filesToSend.length > 0;
      this.elements.sendButton.disabled = !(hasText || hasFiles);
    }
    
    handleTyping() {
      if (!this.selectedContact) return;
      
      // Show typing indicator
      if (!this.isTyping) {
        this.isTyping = true;
        this.showTypingIndicator();
      }
      
      // Reset typing timeout
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.isTyping = false;
        this.hideTypingIndicator();
      }, 2000);
    }
    
    showTypingIndicator() {
      if (!this.selectedContact) return;
      
      const messagesContainer = this.elements.chatMessages;
      const existingIndicator = document.querySelector('.typing-indicator');
      if (existingIndicator) return;
      
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <span>${this.selectedContact.name} is typing...</span>
      `;
      
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
      const indicator = document.querySelector('.typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
    
    openContactModal(contactId = null) {
      this.editingContactId = contactId;
      const modal = this.elements.contactModal;
      modal.classList.add('active');
      const title = this.elements.modalTitle;
      const nameInput = this.elements.contactNameInput;
      const statusInput = this.elements.contactStatusInput;
      
      if (contactId) {
        title.textContent = 'Edit Contact';
        const contact = this.contacts.find(c => c.id === contactId);
        nameInput.value = contact.name;
        statusInput.value = contact.status;
      } else {
        title.textContent = 'New Contact';
        nameInput.value = '';
        statusInput.value = 'online';
      }
    }
    
    closeContactModal() {
      this.elements.contactModal.classList.remove('active');
      this.editingContactId = null;
    }
    
    saveContact() {
      const nameInput = this.elements.contactNameInput;
      const statusInput = this.elements.contactStatusInput;
      const name = nameInput.value.trim();
      const status = statusInput.value;
      
      if (!name) {
        this.showNotification('Error', 'Please enter a contact name', 'error');
        return;
      }
      
      if (this.editingContactId) {
        // Edit existing contact
        const contact = this.contacts.find(c => c.id === this.editingContactId);
        contact.name = name;
        contact.status = status;
        this.showNotification('Success', 'Contact updated successfully');
      } else {
        // Add new contact
        const newId = this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
        this.contacts.push({ 
          id: newId, 
          name: name, 
          status: status, 
          unread: 0 
        });
        this.conversations[newId] = [];
        this.showNotification('Success', 'Contact added successfully');
      }
      
      this.saveToLocalStorage();
      this.closeContactModal();
      this.renderContacts();
    }
    
    deleteContact(contactId) {
      this.contacts = this.contacts.filter(c => c.id !== contactId);
      delete this.conversations[contactId];
      
      // If the deleted contact was selected, clear the chat area
      if (this.selectedContact && this.selectedContact.id === contactId) {
        this.selectedContact = null;
        this.renderMessages();
      }
      
      this.saveToLocalStorage();
      this.renderContacts();
      this.closeConfirmModal();
      this.showNotification('Success', 'Contact deleted successfully');
    }
    
    showConfirmModal(title, message, confirmCallback) {
      this.elements.confirmMessage.textContent = message;
      this.elements.confirmModal.classList.add('active');
      
      // Store the confirm callback
      this.currentConfirmCallback = confirmCallback;
      
      // Set up confirm button
      this.elements.confirmAction.onclick = () => {
        if (this.currentConfirmCallback) {
          this.currentConfirmCallback();
        }
      };
    }
    
    closeConfirmModal() {
      this.elements.confirmModal.classList.remove('active');
      this.currentConfirmCallback = null;
    }
    
    showNotification(title, message, type = 'success') {
      const notification = this.elements.notification;
      notification.className = `notification notification-${type}`;
      this.elements.notificationTitle.textContent = title;
      this.elements.notificationMessage.textContent = message;
      
      // Set appropriate icon
      const icon = notification.querySelector('.notification-icon i');
      icon.className = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation';
      
      notification.classList.add('active');
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.hideNotification();
      }, 5000);
    }
    
    hideNotification() {
      this.elements.notification.classList.remove('active');
    }
  }

  // Initialize the chat interface when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const chat = new ChatUI();
    
    // Handle browser tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab - you could mark messages as read here
      }
    });
    
    // Handle beforeunload to save data
    window.addEventListener('beforeunload', () => {
      // Additional cleanup if needed
    });
  });
