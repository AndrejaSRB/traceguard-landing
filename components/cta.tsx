import { motion } from "framer-motion";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full mx-auto max-w-90 md:max-w-3xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="text-xs sm:text-sm md:text-base px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-sm sm:text-base md:text-lg italic text-zinc-400 text-center"
          text="Debug smart contracts with clarity and speed."
          duration={0.8}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-5xl sm:text-7xl md:text-8xl tracking-tighter text-center font-bold bg-gradient-to-r from-[#cca7f9] to-[#cca7f9]/60 bg-clip-text text-transparent pb-1.5 leading-[1.1]"
          text="Traceguard"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="pt-1.5 max-w-80 mx-auto md:max-w-full text-center text-sm text-zinc-400 sm:text-lg"
          text="Real-time debugging, human-readable on-chain errors, powerful insights, and dev-friendly APIs — all in one powerful tool."
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}
