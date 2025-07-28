package com.figmine.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {
    
    @Value("${stable.diffusion.url:http://127.0.0.1:7860}")
    private String stableDiffusionUrl;
    
    @Value("${server.port:8081}")
    private String serverPort;
    
    public String getStableDiffusionUrl() {
        return stableDiffusionUrl;
    }
    
    public String getServerPort() {
        return serverPort;
    }
    
    public String getStableDiffusionApiUrl() {
        return stableDiffusionUrl + "/sdapi/v1/txt2img";
    }
} 