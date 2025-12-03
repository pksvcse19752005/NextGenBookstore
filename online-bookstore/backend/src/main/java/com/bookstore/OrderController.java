package com.bookstore.controller;

import com.bookstore.model.Order;
import com.bookstore.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OrderController {

    private List<Order> orders = new ArrayList<>();

    @Autowired
    private PaymentService paymentService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @GetMapping("/")
    public String home() {
        return "Welcome to Bookstore API";
    }

    @PostMapping("/orders/create")
    public Map<String, Object> createOrder(@RequestBody Order order) throws Exception {
        // your internal order
        String orderId = "ORD-" + System.currentTimeMillis();
        order.setOrderId(orderId);
        order.setPaymentStatus("PENDING");
        orders.add(order);

        // create Razorpay order
        JSONObject rzpOrder = paymentService.createRazorpayOrder(order.getTotalAmount());

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", orderId);                         // your id
        res.put("amount", order.getTotalAmount());           // in rupees
        res.put("razorpayOrderId", rzpOrder.getString("id"));// rzp_order_id
        res.put("key", razorpayKeyId);                       // to use in JS
        res.put("message", "Order created successfully");
        System.out.println("✅ Order created: " + orderId);
        return res;
    }

    @PostMapping("/orders/verify-payment")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> body) throws Exception {
        String razorpayOrderId = body.get("razorpayOrderId");
        String razorpayPaymentId = body.get("razorpayPaymentId");
        String razorpaySignature = body.get("razorpaySignature");

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);

        // adjust method call to the exact Utils.verifyPaymentSignature signature from SDK
        boolean valid = com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);

        Map<String, Object> res = new HashMap<>();

        if (valid) {
            String orderId = body.get("orderId");
            Order order = orders.stream()
                    .filter(o -> o.getOrderId().equals(orderId))
                    .findFirst()
                    .orElse(null);

            if (order != null) {
                order.setRazorpayPaymentId(razorpayPaymentId);
                order.setPaymentStatus("COMPLETED");
            }

            res.put("status", "SUCCESS");
            res.put("message", "Payment verified and order completed");
            res.put("orderId", orderId);
            System.out.println("✅ Payment verified for order: " + orderId);
        } else {
            res.put("status", "FAILED");
            res.put("message", "Payment verification failed");
            System.out.println("❌ Payment verification failed");
        }

        return res;
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

