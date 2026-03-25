import { OrdersView } from "@/components/buyer/order-view";


export default function MyOrdersPage() {
  return (
    <OrdersView
      title="My Orders"
      subtitle="All your orders across every status — from payment to delivery."
      emptyTitle="No orders yet"
      emptyDesc="You haven't placed any orders. Start shopping in the Marketplace!"
    />
  );
}