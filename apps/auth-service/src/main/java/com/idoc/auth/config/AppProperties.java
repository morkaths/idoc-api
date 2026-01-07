package com.idoc.auth.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Google google = new Google();
    private Cors cors = new Cors();
    private Service service = new Service();

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public Google getGoogle() {
        return google;
    }

    public void setGoogle(Google google) {
        this.google = google;
    }

    public Cors getCors() {
        return cors;
    }

    public void setCors(Cors cors) {
        this.cors = cors;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public static class Jwt {
        private String issuer;
        private String audience;
        private long expiredDuration;
        private long refreshableDuration;
        private String privateKey;
        private String publicKey;

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public String getAudience() {
            return audience;
        }

        public void setAudience(String audience) {
            this.audience = audience;
        }

        public long getExpiredDuration() {
            return expiredDuration;
        }

        public void setExpiredDuration(long expiredDuration) {
            this.expiredDuration = expiredDuration;
        }

        public long getRefreshableDuration() {
            return refreshableDuration;
        }

        public void setRefreshableDuration(long refreshableDuration) {
            this.refreshableDuration = refreshableDuration;
        }

        public String getPrivateKey() {
            return privateKey;
        }

        public void setPrivateKey(String privateKey) {
            this.privateKey = privateKey;
        }

        public String getPublicKey() {
            return publicKey;
        }

        public void setPublicKey(String publicKey) {
            this.publicKey = publicKey;
        }
    }

    public static class Google {
        private Client client = new Client();

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public static class Client {
            private String id;
            private String secret;

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }

            public String getSecret() {
                return secret;
            }

            public void setSecret(String secret) {
                this.secret = secret;
            }
        }
    }

    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();

        public List<String> getAllowedOrigins() {
            return allowedOrigins;
        }

        public void setAllowedOrigins(List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }

    public static class Service {
        private String key;
        private String url;
        private String name;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
