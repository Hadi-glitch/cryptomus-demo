if (payment.status === "paid") {
  console.log("✅ Payment confirmed:", payment.order_id);
} else {
  console.log("❌ Payment not completed:", payment.status);
}
