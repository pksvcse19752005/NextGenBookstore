package com.bookstore;

import com.bookstore.model.Book;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class BookController {

    private List<Book> books;

    public BookController() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/books.json");
            books = mapper.readValue(is, new TypeReference<List<Book>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            books = List.of();
        }
    }

    @GetMapping("/books")
    public List<Book> getBooks() {
        return books;
    }
}

