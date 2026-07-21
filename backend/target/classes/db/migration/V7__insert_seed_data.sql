-- Insert permissions
INSERT INTO permissions (id, name, label) VALUES
    (uuid_generate_v4(), 'DOCTYPE_CREATE', 'Créer un type de document'),
    (uuid_generate_v4(), 'DOCTYPE_DELETE', 'Supprimer un type de document'),
    (uuid_generate_v4(), 'DOCTYPE_VIEW', 'Voir un type de document'),
    (uuid_generate_v4(), 'USER_MANAGE', 'Gérer les utilisateurs'),
    (uuid_generate_v4(), 'AI_CONFIG_MANAGE', 'Gérer les configurations IA'),
    (uuid_generate_v4(), 'AUDIT_READ', 'Lire les logs d''audit'),
    (uuid_generate_v4(), 'GENERATION_RUN', 'Générer des documents'),
    (uuid_generate_v4(), 'EXPORT_RUN', 'Exporter des documents');

-- Insert roles
INSERT INTO roles (id, name, label, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'ADMIN', 'Administrateur', NOW(), NOW()),
    (uuid_generate_v4(), 'USER', 'Utilisateur standard', NOW(), NOW());

-- Bind all permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- Bind DOCTYPE_VIEW, GENERATION_RUN, EXPORT_RUN to USER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'USER' AND p.name IN ('DOCTYPE_VIEW', 'GENERATION_RUN', 'EXPORT_RUN');

-- Insert default admin user (password: admin_test)
-- Used bcrypt for hashing
INSERT INTO users (id, first_name, last_name, email, password_hash, status, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Admin', 'Root', 'admin@docuai.com', '$2a$10$oY7b//f1iM4sS6YVfQ.9oOGuL8rZp/3E/J7j.8u.oB90J.vX.Hlq6', 'ACTIVE', NOW(), NOW());

-- Assign ADMIN role to the default admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@docuai.com' AND r.name = 'ADMIN';

-- Insert default category
INSERT INTO categories (id, name, created_at, updated_at) VALUES
    (uuid_generate_v4(), 'Général', NOW(), NOW());
