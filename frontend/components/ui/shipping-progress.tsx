import React from 'react'
import { OrderStatus } from "@/types";

export function ShippingProgress({ status }: { status: OrderStatus }) {
  const steps = ['PAYMENT_HELD', 'IN_TRANSIT', 'SHIPPED', 'COMPLETED'];
  const currentIdx = steps.indexOf(status);

  const stepLabels: Record<string, string> = {
    PAYMENT_HELD: 'Payment Held',
    IN_TRANSIT: 'In Transit',
    SHIPPED: 'Out for Delivery',
    COMPLETED: 'Delivered',
  };

  return (
    <div className="flex items-center gap-0 mt-3 mb-2">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-[#08C40E] text-white' : 'bg-[#E6FEE7] text-[#9DFBA0]'
                  } ${active ? 'ring-2 ring-[#0AF511] ring-offset-2 animate-pulse-glow' : ''}`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-1 text-center w-14 ${done ? 'text-[#046207] font-medium' : 'text-gray-400'}`}>
                {stepLabels[step]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-4 transition-all"
                style={{ backgroundColor: i < currentIdx ? '#08C40E' : '#E6FEE7' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}