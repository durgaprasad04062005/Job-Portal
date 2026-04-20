package com.jobportal.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Object errors;
    // Use String instead of LocalDateTime to avoid Jackson serialization issues
    private String timestamp;

    public ApiResponse() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    private ApiResponse(boolean success, String message, T data, Object errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message, Object errors) {
        return new ApiResponse<>(false, message, null, errors);
    }

    // Getters
    public boolean isSuccess()    { return success; }
    public String getMessage()    { return message; }
    public T getData()            { return data; }
    public Object getErrors()     { return errors; }
    public String getTimestamp()  { return timestamp; }

    // Setters (needed for Jackson deserialization)
    public void setSuccess(boolean success)    { this.success = success; }
    public void setMessage(String message)     { this.message = message; }
    public void setData(T data)                { this.data = data; }
    public void setErrors(Object errors)       { this.errors = errors; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
