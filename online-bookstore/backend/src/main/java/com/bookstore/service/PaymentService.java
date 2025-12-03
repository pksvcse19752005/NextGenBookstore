package com.bookstore.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;

    public PaymentService(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }
public JSONObject createRazorpayOrder(double amount) throws Exception {
    JSONObject req = new JSONObject();
    req.put("amount", (int) (amount * 100)); // in paise
    req.put("currency", "INR");
    req.put("receipt", "order_rcpt_" + System.currentTimeMillis());
    req.put("payment_capture", 1);

    Order order = razorpayClient.orders.create(req);  // <-- lowercase 'orders'
    return order.toJson();
} // contains razorpay order_id
    }

