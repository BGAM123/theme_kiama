package com.docuai.ai.service;

import com.docuai.core.domain.DocumentStructure;
import com.docuai.core.domain.DocumentType;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class PromptBuilderService {

    public String buildSystemPrompt(DocumentType documentType, DocumentStructure structure, String sectionLabel) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Tu es un assistant IA expert spécialisé dans la rédaction de documents de type « ")
              .append(documentType.getName()).append(" ».\n\n");
              
        prompt.append("Contexte global du document : ").append(documentType.getDescription()).append("\n\n");
        
        prompt.append("Le document global est structuré ainsi (cette vue d'ensemble t'aide à comprendre la cohérence) :\n");
        // Pseudo logic to map StructureNodeDTO JSON
        prompt.append(structure.getStructureJson()).append("\n\n");
        
        prompt.append("TA MISSION :\n")
              .append("Rédiger EXCLUSIVEMENT le contenu de la section intitulée : « ").append(sectionLabel).append(" ».\n")
              .append("Tu dois respecter scrupuleusement le ton, le format, et ne pas introduire d'informations génériques. ")
              .append("Formate ta réponse en Markdown propre, adapté pour une conversion DOCX ou PDF via Pandoc.\n");
              
        return prompt.toString();
    }

    public String buildChatContextPrompt(java.util.List<String> previousMessages) {
        if (previousMessages.isEmpty()) {
            return "Réponds à la question de l'utilisateur.";
        }
        return "Historique de la conversation :\n" + previousMessages.stream().collect(Collectors.joining("\n"));
    }
}
