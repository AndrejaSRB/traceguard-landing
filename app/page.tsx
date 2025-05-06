"use client";

import CTA from "@/components/cta";
import Form from "@/components/form";
import { useWaitlist } from "./hooks/useWaitlist";
import { BackgroundAnimation } from "@/components/ui/background-animation";
export default function Home() {
  const { email, loading, handleEmailChange, handleSubmit } = useWaitlist();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip relative">
      <section className="px-4 lg:px-0flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        <CTA />

        <Form
          email={email}
          handleEmailChange={handleEmailChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>
      <BackgroundAnimation
        primaryColor="#6b4f8e"
        particleCount={380}
        baseSpeed={0.1}
        rangeSpeed={0.8}
        baseRadius={0.8}
        rangeRadius={1.0}
      />
    </main>
  );
}
