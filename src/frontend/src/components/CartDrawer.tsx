import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, total } =
    useCart();
  const { actor } = useActor();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    specialInstructions: "",
  });

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.customerPhone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!actor) {
      toast.error("Connection error. Please try again.");
      return;
    }
    setPlacing(true);
    try {
      const id = await actor.placeOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: form.address,
        specialInstructions: form.specialInstructions,
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
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {orderId
                  ? "Order Confirmed!"
                  : step === "cart"
                    ? "Your Cart"
                    : "Place Order"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setStep("cart");
                  setOrderId("");
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {orderId ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-10"
                  data-ocid="cart.success_state"
                >
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-display font-bold text-primary">
                    Order Placed!
                  </h3>
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
                    Save this ID to track your order
                  </p>
                </motion.div>
              ) : step === "cart" ? (
                cartItems.length === 0 ? (
                  <div
                    className="text-center py-16 space-y-3"
                    data-ocid="cart.empty_state"
                  >
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground/60">
                      Add dishes from our menu
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item, idx) => (
                      <motion.div
                        key={`${item.dish.id}-${item.isHalf}`}
                        className="bg-secondary rounded-2xl p-4 flex gap-3 items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        data-ocid={`cart.item.${idx + 1}`}
                      >
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/assets/generated/thali.dim_400x300.jpg";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.dish.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.isHalf ? "Half" : "Full"} · ₹
                            {item.isHalf
                              ? (item.dish.halfPrice ?? item.dish.price)
                              : item.dish.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.dish.id,
                                item.isHalf,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.dish.id,
                                item.isHalf,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.dish.id, item.isHalf)
                          }
                          className="text-destructive/70 hover:text-destructive p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePlaceOrder();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="cname">Full Name *</Label>
                    <Input
                      id="cname"
                      placeholder="Your name"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      data-ocid="cart.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cphone">Phone Number *</Label>
                    <Input
                      id="cphone"
                      placeholder="+91 XXXXXXXXXX"
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                      data-ocid="cart.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caddress">Delivery Address *</Label>
                    <Textarea
                      id="caddress"
                      placeholder="Full address with landmark"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      rows={3}
                      data-ocid="cart.textarea"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cspecial">Special Instructions</Label>
                    <Textarea
                      id="cspecial"
                      placeholder="Allergies, preferences..."
                      value={form.specialInstructions}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          specialInstructions: e.target.value,
                        })
                      }
                      rows={2}
                      data-ocid="cart.textarea"
                    />
                  </div>

                  <div className="bg-secondary rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{total}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={placing}
                    data-ocid="cart.submit_button"
                  >
                    {placing ? "Placing Order..." : "Confirm Order"}
                  </Button>
                </form>
              )}
            </div>

            {/* Footer */}
            {!orderId && step === "cart" && cartItems.length > 0 && (
              <div className="p-5 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{total}
                  </span>
                </div>
                <Button
                  className="w-full h-12"
                  onClick={() => setStep("form")}
                  data-ocid="cart.primary_button"
                >
                  Proceed to Order
                </Button>
              </div>
            )}
            {!orderId && step === "form" && (
              <div className="p-5 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-ocid="cart.button"
                >
                  ← Back to Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
