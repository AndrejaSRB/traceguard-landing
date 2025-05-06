"use client";

import CTA from "@/components/cta";
import Form from "@/components/form";
import Particles from "@/components/ui/particles";
import { useWaitlist } from "./hooks/useWaitlist";

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

      <Particles
        quantityDesktop={700}
        quantityMobile={100}
        ease={80}
        color={"#cfaaff"}
        refresh
      />
    </main>
  );
}
