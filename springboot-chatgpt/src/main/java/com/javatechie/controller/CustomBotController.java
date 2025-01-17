package com.javatechie.controller;

import com.javatechie.dto.ChatGPTRequest;
import com.javatechie.dto.ChatGptResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/bot")
public class CustomBotController {

    @Value("${openai.model}")
    private String model;

    @Value(("${openai.api.url}"))
    private String apiURL;

    @Autowired
    private RestTemplate template;

    @GetMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam("prompt") String prompt){
        try {
            ChatGPTRequest request = new ChatGPTRequest(model, prompt);
            ChatGptResponse chatGptResponse = template.postForObject(apiURL, request, ChatGptResponse.class);
            return ResponseEntity.ok(chatGptResponse.getChoices().get(0).getMessage().getContent());
        } catch (Exception e) {
            // Log the exception and return a meaningful error message
            e.printStackTrace();  // Log the exception to the console or a file
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

}
