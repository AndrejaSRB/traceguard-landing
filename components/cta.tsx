import { motion } from "framer-motion";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      {/* <motion.img
        src="/traceguard-logo.png"
        alt="logo"
        className="mx-auto h-20 w-20 mt-4"
        variants={itemVariants}
      /> */}

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-base text-zinc-400 text-center mb-1"
          text="Smart contract debugging made simple."
          duration={0.8}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold bg-gradient-to-r from-[#cca7f9] to-[#cca7f9]/60 bg-clip-text text-transparent leading-normal pb-1"
          text="Traceguard"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-3xl pt-1.5 text-center text-base text-zinc-400 sm:text-lg"
          text="Catch failed transactions and cryptic errors fast. API-ready tools built for speed, clarity, and confidence."
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}
