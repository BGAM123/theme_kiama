package com.docuai.infrastructure.storage;

import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
public class MinioStorageAdapter implements StoragePort {

    private final MinioClient minioClient;
    
    @Value("${minio.presigned-url-expiry-minutes}")
    private int expiryMinutes;

    public MinioStorageAdapter(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(String bucketName, String objectName, InputStream inputStream, String contentType, long size) {
        try {
            ensureBucketExists(bucketName);
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build()
            );
            return objectName;
        } catch (Exception e) {
            throw new AppException(ErrorCode.STORAGE_ERROR, "Failed to upload file to MinIO", e);
        }
    }

    @Override
    public InputStream getFile(String bucketName, String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.STORAGE_ERROR, "Failed to retrieve file from MinIO", e);
        }
    }

    @Override
    public String getPresignedUrl(String bucketName, String objectName) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expiryMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.STORAGE_ERROR, "Failed to generate presigned URL", e);
        }
    }

    @Override
    public String getPresignedUploadUrl(String bucketName, String objectName, String contentType) {
        try {
            ensureBucketExists(bucketName);
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expiryMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.STORAGE_ERROR, "Failed to generate presigned upload URL", e);
        }
    }

    private void ensureBucketExists(String bucketName) throws Exception {
        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }
}
