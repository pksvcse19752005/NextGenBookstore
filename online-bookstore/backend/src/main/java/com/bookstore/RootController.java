package com.bookstore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/")
    public String root() {
        return "Welcome to Bookstore API - Visit /api/orders to see orders";
    }
}
