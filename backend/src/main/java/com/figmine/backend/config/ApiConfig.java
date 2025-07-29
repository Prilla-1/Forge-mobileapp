package com.figmine.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "api")
public class ApiConfig {

    private String deepaiToken;
    private String stableDiffusionUrl = "http://127.0.0.1:7860";
    private String serverPort = "8081";

    public String getDeepaiToken() {
        return deepaiToken;
    }

    public void setDeepaiToken(String deepaiToken) {
        this.deepaiToken = deepaiToken;
    }

    public String getStableDiffusionUrl() {
        return stableDiffusionUrl;
    }

    public void setStableDiffusionUrl(String stableDiffusionUrl) {
        this.stableDiffusionUrl = stableDiffusionUrl;
    }

    public String getServerPort() {
        return serverPort;
    }

    public void setServerPort(String serverPort) {
        this.serverPort = serverPort;
    }

    public String getStableDiffusionApiUrl() {
        return stableDiffusionUrl + "/sdapi/v1/txt2img";
    }
}
