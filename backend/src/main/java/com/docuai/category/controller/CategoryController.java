package com.docuai.category.controller;

import com.docuai.category.dto.CategoryDto;
import com.docuai.category.service.CategoryService;
import com.docuai.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto.Response>>> listCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.listCategories()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('DOCTYPE_CREATE')")
    public ResponseEntity<ApiResponse<CategoryDto.Response>> createCategory(@Valid @RequestBody CategoryDto.CreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.createCategory(request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DOCTYPE_DELETE')")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
