package com.bookstore.model;

public class Book {
    private int id;
    private String title;
    private String author;
    private double price;
    private double rating;
    private String imageUrl;

    public Book() {}

    public Book(int id, String title, String author, double price, double rating, String imageUrl) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    // Getters and setters...

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
