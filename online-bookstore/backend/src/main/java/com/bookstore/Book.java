book.java
package com.bookstore.model;

import java.util.List;

public class Book {
    private int id;
    private String title;
    private String author;
    private double price;
    private double rating;
    private String imageUrl;
    private List<String> categories;   // <-- add this

    public Book() {}

    public Book(int id, String title, String author,
                double price, double rating,
                String imageUrl, List<String> categories) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.categories = categories;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }
}
wait for reply
