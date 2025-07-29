package com.figmine.backend.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SettingsLayoutDto {
    private String screen;
    private List<LayoutItem> layout;

    @Data
    public static class LayoutItem {
        private String type;
        private String title;
        private Map<String, Object> style;
        private List<ChildItem> children;
        private String key;
        private String label;
        private String icon;
        private String value;
        private List<String> options;
        private Object defaultValue;
    }

    @Data
    public static class ChildItem {
        private String type;
        private String key;
        private String label;
        private String icon;
        private Map<String, Object> style;
        private Object defaultValue;
        private String value;
        private List<String> options;
    }
}
