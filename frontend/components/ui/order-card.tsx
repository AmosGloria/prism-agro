import { CheckCircle, ChevronRight, Download, MapPin, Package } from "lucide-react";
import { ShippingProgress } from "./shipping-progress";
import { StatusBadge } from "./getStatusBadge";
import { useRouter } from "next/navigation";
import { Order } from "@/types";

export function OrderCard({
  order,
  onConfirmDelivery,
}: {
  order: Order;
  onConfirmDelivery?: (order: Order) => void;
}) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-2xl border border-[#E6FEE7] p-4 card-hover cursor-pointer animate-fade-up"
      onClick={() => router.push(`/buyer/orders/${order.id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-[#023103] text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            {order.id}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={order.status} pulse />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#E6FEE7] flex items-center justify-center text-xl">
          <Package size={20} className="text-[#08C40E]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#023103]">{order.cropType}</p>
          <p className="text-xs text-gray-400">{order.quantity}kg · {order.farmerName}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-base font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
            ₦{order.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <MapPin size={11} />
        <span>{order.deliveryAddress}</span>
      </div>

      {/* Stepper for in-progress orders */}
      {['PAYMENT_HELD', 'IN_TRANSIT', 'SHIPPED'].includes(order.status) && (
        <ShippingProgress status={order.status} />
      )}

      {/* Confirm delivery CTA */}
      {order.status === 'SHIPPED' && onConfirmDelivery && (
        <button
          onClick={e => { e.stopPropagation(); onConfirmDelivery(order); }}
          className="w-full mt-3 py-2.5 rounded-xl bg-[#08C40E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#06930A] transition-all shadow-md shadow-green-200 animate-pulse-glow"
        >
          <CheckCircle size={16} />
          Confirm Delivery — Release Funds
        </button>
      )}

      {/* Download receipt for completed */}
      {order.status === 'COMPLETED' && (
        <button
          onClick={e => { e.stopPropagation(); alert('Receipt download coming soon'); }}
          className="w-full mt-3 py-2 rounded-xl border border-[#CEFDCF] text-[#046207] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#F0FEF1] transition-colors"
        >
          <Download size={14} />
          Download Receipt
        </button>
      )}

      <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
        View Details <ChevronRight size={14} className="ml-0.5" />
      </div>
    </div>
  );
}