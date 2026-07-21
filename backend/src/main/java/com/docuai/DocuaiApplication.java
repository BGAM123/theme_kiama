package com.docuai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DocuaiApplication {
    public static void main(String[] args) {
        SpringApplication.run(DocuaiApplication.class, args);
    }
}
