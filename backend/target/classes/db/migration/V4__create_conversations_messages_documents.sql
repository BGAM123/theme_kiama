-- Table ai_model_configs
CREATE TABLE ai_model_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('OPENAI', 'ANTHROPIC', 'GOOGLE', 'MISTRAL', 'OLLAMA', 'DEEPSEEK')),
    model_name VARCHAR(100) NOT NULL,
    api_key_encrypted VARCHAR(1000),
    base_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    is_default BOOLEAN NOT NULL DEFAULT false,
    max_tokens INT DEFAULT 4096,
    temperature NUMERIC(3,2) DEFAULT 0.70,
    total_requests BIGINT DEFAULT 0,
    total_tokens_used BIGINT DEFAULT 0,
    avg_response_ms INT DEFAULT 0,
    cost_per_1k_tokens NUMERIC(10,6) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Table conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    ai_model_config_id UUID REFERENCES ai_model_configs(id),
    language VARCHAR(50) NOT NULL DEFAULT 'fr',
    tone VARCHAR(20) NOT NULL DEFAULT 'FORMAL' CHECK (tone IN ('FORMAL', 'NEUTRAL', 'DIRECT')),
    target_length VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (target_length IN ('SHORT', 'MEDIUM', 'LONG')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Table reference_documents
CREATE TABLE reference_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    original_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

-- Table generated_documents
CREATE TABLE generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    message_id UUID, -- circular reference set after message creation
    title VARCHAR(500) NOT NULL,
    content_html TEXT NOT NULL,
    content_pivot JSONB NOT NULL,
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    conformity_score INT NOT NULL DEFAULT 0,
    conformity_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'EXPORTED')),
    export_docx_key VARCHAR(500),
    export_pdf_key VARCHAR(500),
    export_md_key VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Table messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    role VARCHAR(10) NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
    content TEXT NOT NULL,
    is_complete BOOLEAN NOT NULL DEFAULT false,
    conformity_score INT,
    generated_document_id UUID REFERENCES generated_documents(id),
    created_at TIMESTAMPTZ NOT NULL
);

-- Add foreign key constraint for message_id in generated_documents
ALTER TABLE generated_documents
ADD CONSTRAINT fk_generated_documents_messages
FOREIGN KEY (message_id) REFERENCES messages(id);
