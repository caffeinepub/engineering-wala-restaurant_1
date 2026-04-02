import { OrderStatus } from "@/backend";
import type { Order } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useCart } from "@/hooks/useCart";
import {
  CheckCircle,
  ChefHat,
  CreditCard,
  Loader2,
  Package,
  Search,
  Smartphone,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_STEPS = [
  { key: OrderStatus.pending, label: "Pending", icon: Package },
  { key: OrderStatus.confirmed, label: "Confirmed", icon: CheckCircle },
  { key: OrderStatus.preparing, label: "Preparing", icon: ChefHat },
  { key: OrderStatus.ready, label: "Ready", icon: CheckCircle },
  { key: OrderStatus.delivered, label: "Delivered", icon: Truck },
];

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.pending]:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [OrderStatus.confirmed]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [OrderStatus.preparing]:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [OrderStatus.ready]: "bg-green-500/20 text-green-400 border-green-500/30",
  [OrderStatus.delivered]:
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [OrderStatus.cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
};

type PaymentMode = "cod" | "upi" | "card";

const PAYMENT_OPTIONS: {
  id: PaymentMode;
  icon: typeof Wallet;
  label: string;
  subtitle: string;
}[] = [
  {
    id: "cod",
    icon: Wallet,
    label: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
  },
  {
    id: "upi",
    icon: Smartphone,
    label: "UPI Payment",
    subtitle: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "card",
    icon: CreditCard,
    label: "Credit / Debit Card",
    subtitle: "Card collected at delivery",
  },
];

function PaymentModeSelector({
  value,
  onChange,
}: {
  value: PaymentMode;
  onChange: (v: PaymentMode) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Payment Method</Label>
      <div className="grid grid-cols-1 gap-3">
        {PAYMENT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left w-full"
              style={{
                borderColor: selected
                  ? "oklch(0.76 0.19 75)"
                  : "oklch(0.25 0.03 255)",
                background: selected
                  ? "oklch(0.76 0.19 75 / 0.08)"
                  : "oklch(0.15 0.025 255)",
                boxShadow: selected
                  ? "0 0 16px oklch(0.76 0.19 75 / 0.25), inset 0 0 12px oklch(0.76 0.19 75 / 0.05)"
                  : "none",
              }}
              data-ocid={`payment.${opt.id}.toggle`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: selected
                    ? "oklch(0.76 0.19 75 / 0.2)"
                    : "oklch(0.2 0.03 255)",
                  color: selected
                    ? "oklch(0.76 0.19 75)"
                    : "oklch(0.6 0.015 255)",
                  boxShadow: selected
                    ? "0 0 10px oklch(0.76 0.19 75 / 0.4)"
                    : "none",
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold text-sm"
                  style={{
                    color: selected
                      ? "oklch(0.76 0.19 75)"
                      : "oklch(0.92 0.01 240)",
                    textShadow: selected
                      ? "0 0 10px oklch(0.76 0.19 75 / 0.5)"
                      : "none",
                  }}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.subtitle}
                </p>
              </div>
              {selected && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "oklch(0.76 0.19 75)",
                    boxShadow: "0 0 10px oklch(0.76 0.19 75 / 0.7)",
                  }}
                >
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Contextual info */}
      {value === "upi" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm rounded-xl p-3 border"
          style={{
            background: "oklch(0.68 0.20 195 / 0.08)",
            borderColor: "oklch(0.68 0.20 195 / 0.3)",
            color: "oklch(0.68 0.20 195)",
          }}
        >
          📱 UPI ID: <strong>engineeringwala@upi</strong> — or scan QR at
          delivery
        </motion.div>
      )}
      {value === "card" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm rounded-xl p-3 border"
          style={{
            background: "oklch(0.5 0.1 255 / 0.08)",
            borderColor: "oklch(0.5 0.1 255 / 0.3)",
            color: "oklch(0.7 0.1 255)",
          }}
        >
          💳 Card payment collected at delivery by our partner
        </motion.div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onCancel,
}: { order: Order; onCancel: () => void }) {
  const canCancel =
    order.status === OrderStatus.pending ||
    order.status === OrderStatus.confirmed;
  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const date = new Date(Number(order.timestamp) / 1_000_000).toLocaleString();

  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 space-y-4"
      data-ocid="orders.card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{order.customerName}</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {order.orderId}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        </div>
        <div className="text-right space-y-1">
          <Badge className={`border ${STATUS_COLORS[order.status] ?? ""}`}>
            {order.status}
          </Badge>
          <p className="text-primary font-bold">\u20B9{order.totalAmount}</p>
        </div>
      </div>

      {order.status !== OrderStatus.cancelled && (
        <div className="flex items-center gap-1">
          {STATUS_STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center gap-1 flex-1">
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-secondary"
                }`}
              />
              {i === STATUS_STEPS.length - 1 && (
                <div
                  className={`w-3 h-3 rounded-full ${
                    i <= currentStep ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {order.cart.map((item, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: cart items have no unique id
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.dishName} x{Number(item.quantity)}
            </span>
            <span>\u20B9{item.price * Number(item.quantity)}</span>
          </div>
        ))}
      </div>

      {order.specialInstructions && (
        <p className="text-xs text-muted-foreground bg-secondary rounded-xl p-3">
          Note: {order.specialInstructions}
        </p>
      )}

      {canCancel && (
        <Button
          variant="outline"
          size="sm"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={onCancel}
          data-ocid="orders.delete_button"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Cancel Order
        </Button>
      )}
    </div>
  );
}

export default function Orders() {
  const { cartItems, total, clearCart } = useCart();
  const { actor } = useActor();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cod");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    specialInstructions: "",
  });

  const fetchOrders = async () => {
    if (!phone || !actor) return;
    setLoading(true);
    try {
      const data = await actor.getOrdersByPhone(phone);
      setOrders(data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async () => {
    if (!trackOrderId || !phone || !actor) return;
    setLoading(true);
    try {
      const data = await actor.getOrderById(trackOrderId, phone);
      setTrackedOrder(data);
      if (!data) toast.error("Order not found");
    } catch {
      toast.error("Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (oid: string) => {
    if (!phone || !actor) return;
    try {
      await actor.cancelOrder(oid, phone);
      toast.success("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const placeOrder = async () => {
    if (!form.customerName || !form.customerPhone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!actor) {
      toast.error("Connection error");
      return;
    }
    setPlacing(true);

    const paymentLabels: Record<PaymentMode, string> = {
      cod: "Cash on Delivery",
      upi: "UPI Payment",
      card: "Credit/Debit Card",
    };
    const paymentPrefix = `[Payment: ${paymentLabels[paymentMode]}] `;
    const specialInstructions = paymentPrefix + form.specialInstructions;

    try {
      const id = await actor.placeOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: form.address,
        specialInstructions,
        totalAmount: total,
        cart: cartItems.map((i) => ({
          dishName: i.dish.name + (i.isHalf ? " (Half)" : ""),
          quantity: BigInt(i.quantity),
          price: i.isHalf ? (i.dish.halfPrice ?? i.dish.price) : i.dish.price,
        })),
      });
      setOrderId(id);
      clearCart();
      toast.success(`Order placed! ID: ${id}`);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Place, track, and manage your orders
        </p>
      </motion.div>

      <Tabs defaultValue="place" data-ocid="orders.tab">
        <TabsList className="w-full mb-6 grid grid-cols-3">
          <TabsTrigger value="place" data-ocid="orders.tab">
            Place Order
          </TabsTrigger>
          <TabsTrigger value="track" data-ocid="orders.tab">
            Track Order
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="orders.tab">
            My Orders
          </TabsTrigger>
        </TabsList>

        {/* Place Order */}
        <TabsContent value="place" className="space-y-6">
          {orderId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-12"
              data-ocid="orders.success_state"
            >
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-display font-bold text-primary">
                Order Placed!
              </h2>
              <p className="text-muted-foreground">
                Your order has been received.
              </p>
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-bold text-primary mt-1">
                  {orderId}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this ID to track your order
              </p>
              <Button onClick={() => setOrderId("")}>
                Place Another Order
              </Button>
            </motion.div>
          ) : (
            <>
              {cartItems.length > 0 && (
                <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Your Cart ({cartItems.length} items)
                  </h3>
                  {cartItems.map((item) => (
                    <div
                      key={item.dish.id + String(item.isHalf)}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.dish.name} {item.isHalf ? "(Half)" : ""} x
                        {item.quantity}
                      </span>
                      <span className="font-medium">
                        \u20B9
                        {(item.isHalf
                          ? (item.dish.halfPrice ?? item.dish.price)
                          : item.dish.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">\u20B9{total}</span>
                  </div>
                </div>
              )}
              {cartItems.length === 0 && (
                <div
                  className="text-center py-6 text-muted-foreground text-sm bg-secondary rounded-2xl"
                  data-ocid="orders.empty_state"
                >
                  Cart is empty. Add dishes from the{" "}
                  <a href="/menu" className="text-primary hover:underline">
                    Menu page
                  </a>
                  .
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold">Delivery Details</h3>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Your name"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    data-ocid="orders.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="+91 XXXXXXXXXX"
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                    data-ocid="orders.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Address *</Label>
                  <Textarea
                    placeholder="Full address with landmark"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    rows={3}
                    data-ocid="orders.textarea"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Textarea
                    placeholder="Allergies, preferences..."
                    value={form.specialInstructions}
                    onChange={(e) =>
                      setForm({ ...form, specialInstructions: e.target.value })
                    }
                    rows={2}
                    data-ocid="orders.textarea"
                  />
                </div>

                {/* Payment Mode */}
                <PaymentModeSelector
                  value={paymentMode}
                  onChange={setPaymentMode}
                />

                <Button
                  className="w-full h-12"
                  onClick={placeOrder}
                  disabled={placing || cartItems.length === 0}
                  data-ocid="orders.submit_button"
                >
                  {placing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing
                      Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Track Order */}
        <TabsContent value="track" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <Input
                placeholder="Enter your order ID"
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                data-ocid="track.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+91 XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-ocid="track.input"
              />
            </div>
            <Button
              className="w-full"
              onClick={trackOrder}
              disabled={loading}
              data-ocid="track.primary_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Track Order
            </Button>
          </div>

          {trackedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <OrderCard
                order={trackedOrder}
                onCancel={() => {
                  cancelOrder(trackedOrder.orderId).then(() =>
                    setTrackedOrder(null),
                  );
                }}
              />
            </motion.div>
          )}
          {trackedOrder === null && trackOrderId && !loading && (
            <p className="text-center text-muted-foreground text-sm">
              Order not found. Check your ID and phone.
            </p>
          )}
        </TabsContent>

        {/* My Orders */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
              data-ocid="history.input"
            />
            <Button
              onClick={fetchOrders}
              disabled={loading}
              data-ocid="history.primary_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <OrderCard
                    order={order}
                    onCancel={() => cancelOrder(order.orderId)}
                  />
                </motion.div>
              ))}
            </div>
          ) : phone && !loading ? (
            <p
              className="text-center text-muted-foreground text-sm py-8"
              data-ocid="history.empty_state"
            >
              No orders found for this phone number.
            </p>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
