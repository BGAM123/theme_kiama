-- Fix the ip_address column type from INET to VARCHAR(45)
-- This is needed because Hibernate expects VARCHAR for String fields
-- and the INET type causes schema validation errors

ALTER TABLE audit_logs 
ALTER COLUMN ip_address TYPE VARCHAR(45) USING ip_address::TEXT;
