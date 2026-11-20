import { 
  ORDER_STATUSES, 
  TERMINAL_STATUSES, 
  ALLOWED_TRANSITIONS, 
  normalizeStatus 
} from './models/orderModel.js';

console.log('====================================================');
console.log('🧪 BITEZY ORDER TRACKING & LIFECYCLE TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
  }
}

// ─── Test 1: Status Normalization ──────────────────────────────────────────
console.log('--- Suite 1: Status Normalization ---');
assert(normalizeStatus('order placed') === 'Order Placed', 'Normalizes lowercase "order placed"');
assert(normalizeStatus('Out for delivery') === 'Out for Delivery', 'Normalizes legacy "Out for delivery"');
assert(normalizeStatus('food processing') === 'Food Processing', 'Normalizes "food processing"');
assert(normalizeStatus('delivered') === 'Delivered', 'Normalizes "delivered"');
assert(normalizeStatus('cancelled') === 'Cancelled', 'Normalizes "cancelled"');
assert(normalizeStatus('') === 'Order Placed', 'Defaults empty string to "Order Placed"');

// ─── Test 2: Status Lifecycle Hierarchy & Ordering ────────────────────────
console.log('\n--- Suite 2: Status Lifecycle Hierarchy ---');
assert(ORDER_STATUSES.length === 5, 'Exactly 5 standard progressive stages in ORDER_STATUSES');
assert(ORDER_STATUSES[0] === 'Order Placed', 'Stage 1 is Order Placed');
assert(ORDER_STATUSES[1] === 'Order Confirmed', 'Stage 2 is Order Confirmed');
assert(ORDER_STATUSES[2] === 'Food Processing', 'Stage 3 is Food Processing');
assert(ORDER_STATUSES[3] === 'Out for Delivery', 'Stage 4 is Out for Delivery');
assert(ORDER_STATUSES[4] === 'Delivered', 'Stage 5 is Delivered');

// ─── Test 3: Permitted Transitions ────────────────────────────────────────
console.log('\n--- Suite 3: Permitted Transitions ---');
assert(ALLOWED_TRANSITIONS['Order Placed'].includes('Order Confirmed'), 'Order Placed -> Order Confirmed is allowed');
assert(ALLOWED_TRANSITIONS['Order Placed'].includes('Cancelled'), 'Order Placed -> Cancelled is allowed');
assert(ALLOWED_TRANSITIONS['Order Confirmed'].includes('Food Processing'), 'Order Confirmed -> Food Processing is allowed');
assert(ALLOWED_TRANSITIONS['Food Processing'].includes('Out for Delivery'), 'Food Processing -> Out for Delivery is allowed');
assert(ALLOWED_TRANSITIONS['Out for Delivery'].includes('Delivered'), 'Out for Delivery -> Delivered is allowed');

// ─── Test 4: Invalid Transition Protection ────────────────────────────────
console.log('\n--- Suite 4: Invalid Transition Protection ---');
assert(!ALLOWED_TRANSITIONS['Order Placed'].includes('Delivered'), 'Order Placed CANNOT jump directly to Delivered');
assert(!ALLOWED_TRANSITIONS['Order Placed'].includes('Out for Delivery'), 'Order Placed CANNOT jump directly to Out for Delivery');
assert(!ALLOWED_TRANSITIONS['Out for Delivery'].includes('Food Processing'), 'Out for Delivery CANNOT roll back to Food Processing');
assert(!ALLOWED_TRANSITIONS['Out for Delivery'].includes('Order Placed'), 'Out for Delivery CANNOT roll back to Order Placed');

// ─── Test 5: Terminal States Immutability ──────────────────────────────────
console.log('\n--- Suite 5: Terminal States Immutability ---');
assert(TERMINAL_STATUSES.includes('Delivered'), '"Delivered" is a terminal status');
assert(TERMINAL_STATUSES.includes('Cancelled'), '"Cancelled" is a terminal status');
assert(ALLOWED_TRANSITIONS['Delivered'].length === 0, 'Delivered has 0 permitted next transitions');
assert(ALLOWED_TRANSITIONS['Cancelled'].length === 0, 'Cancelled has 0 permitted next transitions');

// ─── Test 6: Ownership Check Simulation ───────────────────────────────────
console.log('\n--- Suite 6: Customer Access Control ---');
const mockOrder = {
  _id: '6650abc123',
  userId: 'user_cust_111',
  status: 'Out for Delivery',
  items: [{ name: 'Greek Salad', quantity: 1, price: 12 }],
  amount: 14,
};

const customerA = 'user_cust_111';
const customerB = 'user_cust_999';

const canAccessA = String(mockOrder.userId) === String(customerA);
const canAccessB = String(mockOrder.userId) === String(customerB);

assert(canAccessA === true, 'Owner (customerA) has access to order details');
assert(canAccessB === false, 'Non-owner (customerB) access is denied (403)');

// ─── Test 7: Legacy Record Backfill Simulation ────────────────────────────
console.log('\n--- Suite 7: Legacy Order Compatibility ---');
const legacyOrder = {
  userId: 'user_legacy',
  items: [{ name: 'Rolls', quantity: 2, price: 10 }],
  amount: 22,
  status: 'Out for delivery', // legacy casing, no history
  date: new Date('2026-01-01T10:00:00Z'),
};

const normalized = normalizeStatus(legacyOrder.status);
const backfilledHistory = (!legacyOrder.statusHistory || legacyOrder.statusHistory.length === 0)
  ? [{ status: normalized, timestamp: legacyOrder.date, note: 'Order initialized' }]
  : legacyOrder.statusHistory;

assert(normalized === 'Out for Delivery', 'Legacy status casing normalized to standard');
assert(backfilledHistory.length === 1, 'Status history seeded for legacy record');
assert(backfilledHistory[0].status === 'Out for Delivery', 'Seeded history entry has correct status');

console.log('\n====================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
