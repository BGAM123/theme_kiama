package com.docuai.category.service;

import com.docuai.category.dto.CategoryDto;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.Category;
import com.docuai.core.repository.CategoryRepository;
import com.docuai.core.repository.DocumentTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DocumentTypeRepository documentTypeRepository;

    public CategoryService(CategoryRepository categoryRepository, DocumentTypeRepository documentTypeRepository) {
        this.categoryRepository = categoryRepository;
        this.documentTypeRepository = documentTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto.Response> listCategories() {
        return categoryRepository.findAll().stream()
                .map(categoria -> new CategoryDto.Response(categoria.getId(), categoria.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto.Response createCategory(CategoryDto.CreateRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .build();
        category = categoryRepository.save(category);
        return new CategoryDto.Response(category.getId(), category.getName());
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND, "Category not found");
        }
        
        long docCount = documentTypeRepository.findAll().stream().filter(d -> d.getCategory().getId().equals(id)).count();
        if (docCount > 0) {
            throw new AppException(ErrorCode.CATEGORY_REFERENCED, "Category is still referenced by Document Types");
        }
        
        categoryRepository.deleteById(id);
    }
}
