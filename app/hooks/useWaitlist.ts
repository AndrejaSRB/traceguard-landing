import { useState } from "react";
import { toast } from "sonner";
import { ChangeEvent } from "react";

export interface UseWaitlistReturn {
  email: string;
  loading: boolean;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
}

export function useWaitlist(): UseWaitlistReturn {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please provide your email to join the waitlist");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format. Please enter a valid email address");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // Insert into Notion
        const notionResponse = await fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!notionResponse.ok) {
          if (notionResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Notion insertion failed");
          }
        } else {
          resolve({ email });
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Connecting to the blockchain network...",
      success: () => {
        setEmail("");
        return "Transaction confirmed. Your address has been added to the whitelist";
      },
      error: (error) => {
        if (error === "Rate limited") {
          return "Transaction throttled. Please wait for the next block to attempt again";
        } else if (error === "Notion insertion failed") {
          return "Smart contract execution failed. Please try again";
        }
        return "Unexpected network error during transaction. Please try again";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return {
    email,
    loading,
    handleEmailChange,
    handleSubmit,
  };
}
