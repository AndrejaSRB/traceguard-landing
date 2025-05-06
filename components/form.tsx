import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { FaArrowRightLong } from "react-icons/fa6";
import { EnhancedButton } from "@/components/ui/enhanced-btn";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import TextBlur from "./ui/text-blur";

interface FormProps {
  email: string;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Form({
  email,
  handleEmailChange,
  handleSubmit,
  loading,
}: FormProps) {
  return (
    <motion.div
      className="mt-6 lg:mt-10 flex w-full max-w-80 md:max-w-md mx-auto flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-sm text-zinc-300 sm:text-lg"
          text="Be first in line — join the waitlist. 🚀"
          duration={0.8}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="text-base"
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <EnhancedButton
          variant="expandIcon"
          Icon={FaArrowRightLong}
          onClick={handleSubmit}
          iconPlacement="right"
          className="mt-2 p-4 md:p-6 w-full bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#cba6f7]/80 hover:text-[#1e1e2e] text-base"
          disabled={loading}
        >
          {loading ? "Loading..." : "Join Waitlist!"}
        </EnhancedButton>
      </motion.div>

      <motion.div variants={itemVariants} className="text-xs text-center mt-2">
        <span className="text-zinc-400">
          Crafted with gas & love by{" "}
          <a
            href="https://x.com/IAmDivic"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-300 hover:text-zinc-400 transition cursor-pointer"
          >
            Nikola
          </a>{" "}
          and{" "}
          <a
            href="https://x.com/0xAndreja"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-300 hover:text-zinc-400 transition cursor-pointer"
          >
            Andreja
          </a>
        </span>
      </motion.div>
    </motion.div>
  );
}
