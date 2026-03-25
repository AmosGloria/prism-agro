import { OrdersView } from '@/components/buyer/order-view';

export default function TrackShipmentsPage() {
  return (
    <OrdersView
      filterStatus="IN_TRANSIT"
      title="Track Shipments"
      subtitle="Orders currently on the road to your doorstep."
      emptyTitle="Nothing in transit"
      emptyDesc="When your orders are picked up by a driver, they'll appear here with live tracking."
    />
  );
}