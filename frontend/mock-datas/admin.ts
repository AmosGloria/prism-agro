import { DisputeCase } from "@/types";

export const MOCK_DISPUTES: DisputeCase[] = [
  {
    id: "DIS-001",
    orderId: "ORD-005",
    buyerName: "Chukwuemeka Obi",
    farmerName: "Ngozi Greens",
    cropType: "Cabbage",
    amount: 12000,
    reason: "Produce arrived spoiled or rotten",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "OPEN",
  },
  {
    id: "DIS-002",
    orderId: "ORD-008",
    buyerName: "Fatima Aliyu",
    farmerName: "Kola Roots",
    cropType: "Cassava",
    amount: 8400,
    reason: "Quantity was less than ordered",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "OPEN",
  },
];
