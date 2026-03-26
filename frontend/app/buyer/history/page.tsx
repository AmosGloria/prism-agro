import { OrdersView } from '@/components/buyer/order-view';

export default function OrderHistoryPage() {
  return (
    <OrdersView
      filterStatus="COMPLETED"
      title="Order History"
      subtitle="Successfully delivered orders — funds released to farmers."
      emptyTitle="No completed orders"
      emptyDesc="Your completed deliveries will appear here. Confirm your next delivery to see it here!"
    />
  );
}