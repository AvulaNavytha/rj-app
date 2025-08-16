/* eslint-disable @typescript-eslint/no-explicit-any */
import create from "zustand";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface PaymentState {
  loading: boolean;
  error: string | null;
  createOrder: (amount: number, receipt: string) => Promise<any>;
  verifyPayment: (
    orderId: string,
    paymentId: string,
    signature: string
  ) => Promise<boolean>;
  updateTransactionStatus: (
    transactionId: string,
    status: string,
    verificationDetails: any
  ) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,

  fetchPaymentDetails: async (paymentId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`https://api-pcim2i7oxq-uc.a.run.app/fetch-payment/${paymentId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch payment details: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payment details");
      }

      return data.payment; // Modify this based on your data structure
    } catch (error:any) {
      console.error("Error fetching payment details:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // New method to check payment status
  checkPaymentStatus: async (orderId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`https://api-pcim2i7oxq-uc.a.run.app/check-payment/${orderId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch payment status: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payment status");
      }

      return data.payment; // Modify this based on your data structure
    } catch (error:any) {
      console.error("Error checking payment status:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (amount: number, receipt: string) => {
    try {
      set({ loading: true, error: null });

      // Call the backend to create an order
      const response = await fetch("https://api-pcim2i7oxq-uc.a.run.app/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, receipt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      return order;
    } catch (error:any) {
      console.error("Error creating order:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    try {
      set({ loading: true, error: null });

      // Call the backend to verify the payment
      const response = await fetch("https://api-pcim2i7oxq-uc.a.run.app/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, paymentId, signature }),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const result = await response.json();
      return result.valid;
    } catch (error:any) {
      console.error("Error verifying payment:", error);
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateTransactionStatus: async (
    transactionId: string,
    status: string,
    verificationDetails: any
  ) => {
    try {
      set({ loading: true, error: null });

      const transactionRef = doc(db, "transactions", transactionId);
      await updateDoc(transactionRef, {
        status,
        verificationDetails,
        updatedAt: new Date().toISOString(),
      });
    } catch (error:any) {
      console.error("Error updating transaction:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
