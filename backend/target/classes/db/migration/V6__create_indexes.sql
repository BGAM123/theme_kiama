-- Index on messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- Index on conversations
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Index on document_types
CREATE INDEX idx_document_types_status ON document_types(status);
CREATE INDEX idx_document_types_category ON document_types(category_id);

-- Index on audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Index on notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = false;

-- Index on generated_documents
CREATE INDEX idx_generated_documents_conv ON generated_documents(conversation_id);
