import orderModel, { 
  ORDER_STATUSES, 
  TERMINAL_STATUSES, 
  ALLOWED_TRANSITIONS, 
  normalizeStatus 
} from './../models/orderModel.js';
import userModel from './../models/userModel.js';
import Stripe from 'stripe';

// Safe Stripe instance resolver
const getStripeInstance = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === 'sk_test_placeholder' || key.startsWith('your_')) {
    return null;
  }
  try {
    return new Stripe(key);
  } catch (err) {
    console.warn("⚠️ Stripe initialization warning:", err.message);
    return null;
  }
};

// Dynamically resolve frontend URL from env or request headers
const getFrontendUrl = (req) => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.replace(/\/+$/, '');
  }
  if (req && req.headers) {
    if (req.headers.origin) {
      return req.headers.origin.replace(/\/+$/, '');
    }
    if (req.headers.referer) {
      try {
        const parsed = new URL(req.headers.referer);
        return `${parsed.protocol}//${parsed.host}`;
      } catch (e) {
        // invalid referer url, fall through
      }
    }
  }
  return 'http://localhost:5173';
};

// Calculate estimated delivery time (e.g., 35-45 min from confirmation or dispatch)
const calcEstimatedDelivery = (status) => {
  const norm = normalizeStatus(status);
  const now = new Date();
  if (norm === 'Out for Delivery') {
    now.setMinutes(now.getMinutes() + 25);
    return now;
  }
  if (norm === 'Food Processing') {
    now.setMinutes(now.getMinutes() + 45);
    return now;
  }
  if (norm === 'Order Confirmed' || norm === 'Order Placed') {
    now.setMinutes(now.getMinutes() + 50);
    return now;
  }
  return null;
};

// ─── Place Order ─────────────────────────────────────────────────────────────

const placeOrder = async (req, res) => {
  const frontend_url = getFrontendUrl(req);
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: 'Order Placed',
      estimatedDelivery: calcEstimatedDelivery('Order Placed'),
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: 'Order submitted by customer',
        },
      ],
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: 'lkr',
        product_data: { name: item.name },
        unit_amount: item.price * 100 * 300,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'lkr',
        product_data: { name: 'Delivery Charges' },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const stripe = getStripeInstance();
    if (!stripe) {
      console.log('Using Mock Payment Gateway (Stripe Key not configured)');
      const mockSessionUrl = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
      return res.json({ success: true, session_url: mockSessionUrl });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.json({ success: false, message: 'Error placing order' });
  }
};

// ─── Verify Payment ──────────────────────────────────────────────────────────

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === 'true' || success === true) {
      const updatedOrder = await orderModel.findById(orderId);
      if (updatedOrder) {
        updatedOrder.payment = true;
        updatedOrder.status = 'Order Confirmed';
        if (!updatedOrder.statusHistory) updatedOrder.statusHistory = [];
        updatedOrder.statusHistory.push({
          status: 'Order Confirmed',
          timestamp: new Date(),
          note: 'Payment verified via Stripe',
        });
        updatedOrder.estimatedDelivery = calcEstimatedDelivery('Order Confirmed');
        await updatedOrder.save();
      }
      res.json({ success: true, message: 'Paid' });
    } else {
      // Instead of completely deleting, mark Cancelled
      await orderModel.findByIdAndUpdate(orderId, {
        status: 'Cancelled',
        payment: false,
        $push: {
          statusHistory: {
            status: 'Cancelled',
            timestamp: new Date(),
            note: 'Payment failed or cancelled during checkout',
          },
        },
      });
      res.json({ success: false, message: 'Not Paid' });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.json({ success: false, message: 'Error verifying payment' });
  }
};

// ─── Customer: list their orders ─────────────────────────────────────────────

const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId || req.userId;
    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 });

    // Normalize legacy records in response
    const normalizedOrders = orders.map((order) => {
      const obj = order.toObject();
      obj.status = normalizeStatus(obj.status);
      if (!obj.statusHistory || obj.statusHistory.length === 0) {
        obj.statusHistory = [{ status: obj.status, timestamp: obj.date || new Date() }];
      }
      return obj;
    });

    res.json({ success: true, data: normalizedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.json({ success: false, message: 'Error fetching orders' });
  }
};

// ─── Customer: track a single order ─────────────────────────────────────────

const trackOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentUserId = req.body.userId || req.userId;
    // Ownership check — customer can only view their own orders
    if (String(order.userId) !== String(currentUserId)) {
      return res.status(403).json({ success: false, message: 'Access denied: You can only track your own orders' });
    }

    // Auto-migrate legacy orders without history
    let needsSave = false;
    const norm = normalizeStatus(order.status);
    if (order.status !== norm) {
      order.status = norm;
      needsSave = true;
    }
    if (!order.statusHistory || order.statusHistory.length === 0) {
      order.statusHistory = [{ status: norm, timestamp: order.date || new Date(), note: 'Order initialized' }];
      needsSave = true;
    }
    if (!order.estimatedDelivery && norm !== 'Delivered' && norm !== 'Cancelled') {
      order.estimatedDelivery = calcEstimatedDelivery(norm);
      needsSave = true;
    }
    if (needsSave) {
      await order.save();
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error tracking order:", error.message);
    res.json({ success: false, message: 'Error fetching order' });
  }
};

// ─── Admin: list all orders ──────────────────────────────────────────────────

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    const normalizedOrders = orders.map((order) => {
      const obj = order.toObject();
      obj.status = normalizeStatus(obj.status);
      return obj;
    });
    res.json({ success: true, data: normalizedOrders });
  } catch (error) {
    console.error("Error listing orders for admin:", error.message);
    res.json({ success: false, message: 'Error fetching order list' });
  }
};

// ─── Admin: update order status ──────────────────────────────────────────────

const updateStatus = async (req, res) => {
  const { orderId, status, note } = req.body;
  const targetStatus = normalizeStatus(status);

  if (!ORDER_STATUSES.concat(['Cancelled']).includes(targetStatus)) {
    return res.json({ success: false, message: `Invalid status: "${status}"` });
  }

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }

    const currentStatus = normalizeStatus(order.status);

    // If status is already terminal, no further transitions allowed
    if (TERMINAL_STATUSES.includes(currentStatus)) {
      return res.json({
        success: false,
        message: `Order is already ${currentStatus}. Status cannot be altered.`,
      });
    }

    // If setting to same status, return early
    if (currentStatus === targetStatus) {
      return res.json({ success: true, message: `Status is already ${targetStatus}` });
    }

    // Validate transition
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      return res.json({
        success: false,
        message: `Cannot change status from "${currentStatus}" to "${targetStatus}". Permitted: [${allowed.join(', ') || 'none'}]`,
      });
    }

    const updateData = {
      status: targetStatus,
      $push: {
        statusHistory: {
          status: targetStatus,
          timestamp: new Date(),
          note: note || `Updated to ${targetStatus} by admin`,
        },
      },
    };

    const eta = calcEstimatedDelivery(targetStatus);
    if (eta) updateData.estimatedDelivery = eta;

    const updated = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
    res.json({ 
      success: true, 
      message: `Status updated to "${targetStatus}"`,
      data: updated 
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.json({ success: false, message: 'Error updating status' });
  }
};

// ─── Admin: get allowed next statuses for an order ───────────────────────────

const getAllowedStatuses = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }
    const current = normalizeStatus(order.status);
    const allowed = ALLOWED_TRANSITIONS[current] || [];
    res.json({ success: true, currentStatus: current, allowedNext: allowed });
  } catch (error) {
    console.error("Error fetching allowed statuses:", error.message);
    res.json({ success: false, message: 'Error' });
  }
};

export { 
  placeOrder, 
  verifyOrder, 
  userOrders, 
  trackOrder, 
  listOrders, 
  updateStatus, 
  getAllowedStatuses 
};
