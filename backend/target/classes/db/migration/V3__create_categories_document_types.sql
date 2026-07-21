-- Table categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Table document_types
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id),
    status VARCHAR(30) NOT NULL DEFAULT 'IMPORTED' CHECK (status IN ('IMPORTED', 'EXTRACTING', 'EXTRACTED', 'ACTIVE', 'ARCHIVED')),
    source_file_key VARCHAR(500),
    source_file_name VARCHAR(255),
    source_mime_type VARCHAR(100),
    sections_count INT DEFAULT 0,
    documents_count INT DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Table document_structures
CREATE TABLE document_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type_id UUID UNIQUE NOT NULL REFERENCES document_types(id),
    structure_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    extracted_at TIMESTAMPTZ,
    validated_at TIMESTAMPTZ,
    validated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Table extraction_jobs
CREATE TABLE extraction_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
    progress INT DEFAULT 0,
    current_step VARCHAR(200),
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
