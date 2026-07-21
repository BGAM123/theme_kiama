package com.docuai.infrastructure.storage;

import java.io.InputStream;

public interface StoragePort {
    
    /**
     * Upload an input stream to a bucket
     */
    String uploadFile(String bucketName, String objectName, InputStream inputStream, String contentType, long size);
    
    /**
     * Get an input stream for an object
     */
    InputStream getFile(String bucketName, String objectName);
    
    /**
     * Generate a presigned GET URL for an object
     */
    String getPresignedUrl(String bucketName, String objectName);

    /**
     * Generate a presigned PUT URL for direct client uploads
     */
    String getPresignedUploadUrl(String bucketName, String objectName, String contentType);
}
