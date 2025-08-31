package com.email.smart_writer;


import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
