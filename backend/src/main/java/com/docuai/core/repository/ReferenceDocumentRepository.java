package com.docuai.core.repository;
import com.docuai.core.domain.ReferenceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ReferenceDocumentRepository extends JpaRepository<ReferenceDocument, UUID> {
}
