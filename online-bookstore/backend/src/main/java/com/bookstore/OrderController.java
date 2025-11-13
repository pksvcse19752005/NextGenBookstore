package com.bookstore.controller;
package com.bookstore.model;

import com.bookstore.model.Order;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OrderController {

    private List<Order> orders = new ArrayList<>();

    @PostMapping("/orders/create")
    public Map<String, Object> createOrder(@RequestBody Order order) {
        String orderId = "ORD-" + System.currentTimeMillis();
        order.setOrderId(orderId);
        order.setPaymentStatus("PENDING");
        orders.add(order);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", order.getTotalAmount());
        response.put("message", "Order created successfully");

        System.out.println("✅ Order created: " + orderId);
        return response;
    }

    @PostMapping("/orders/verify-payment")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> paymentData) {
        String orderId = paymentData.get("orderId");
        String razorpayPaymentId = paymentData.get("razorpayPaymentId");

        Order order = orders.stream()
                .filter(o -> o.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);

        Map<String, Object> response = new HashMap<>();

        if (order != null) {
            order.setRazorpayPaymentId(razorpayPaymentId);
            order.setPaymentStatus("COMPLETED");
            response.put("status", "SUCCESS");
            response.put("message", "Payment verified and order completed");
            response.put("orderId", orderId);
            System.out.println("✅ Payment verified for order: " + orderId);
        } else {
            response.put("status", "FAILED");
            response.put("message", "Order not found");
        }

        return response;
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orders;
    }

    @GetMapping("/orders/{orderId}")
    public Order getOrderById(@PathVariable String orderId) {
        return orders.stream()
                .filter(o -> o.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);
    }
}
