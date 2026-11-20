import mongoose from 'mongoose';

// All valid standard statuses in lifecycle order
export const ORDER_STATUSES = [
  'Order Placed',
  'Order Confirmed',
  'Food Processing',
  'Out for Delivery',
  'Delivered',
];

export const TERMINAL_STATUSES = ['Delivered', 'Cancelled'];

// Allowed forward transitions
export const ALLOWED_TRANSITIONS = {
  'Order Placed':     ['Order Confirmed', 'Cancelled'],
  'Order Confirmed':  ['Food Processing', 'Cancelled'],
  'Food Processing':  ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  'Delivered':        [],
  'Cancelled':        [],
};

// Normalize legacy statuses (e.g. 'Out for delivery') to standard title-case
export const normalizeStatus = (status) => {
  if (!status) return 'Order Placed';
  const s = status.trim().toLowerCase();
  if (s === 'order placed') return 'Order Placed';
  if (s === 'order confirmed') return 'Order Confirmed';
  if (s === 'food processing' || s === 'processing') return 'Food Processing';
  if (s === 'out for delivery' || s === 'on the way') return 'Out for Delivery';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return status;
};

const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note:      { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:              { type: String, required: true },
  items:               { type: Array, required: true },
  amount:              { type: Number, required: true },
  address:             { type: Object, required: true },
  status:              { type: String, default: 'Order Placed' },
  statusHistory:       { type: [statusHistorySchema], default: [] },
  date:                { type: Date, default: Date.now },
  payment:             { type: Boolean, default: false },
  estimatedDelivery:   { type: Date, default: null },
});

// When saving a brand-new document, seed the history if empty
orderSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{ status: this.status, timestamp: new Date(), note: 'Order created' }];
  }
  next();
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
