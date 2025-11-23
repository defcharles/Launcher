import React from "react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="w-[calc(100vw-64px)] ml-16 h-screen flex flex-col px-7 pt-7 justify-start items-start"
    ></motion.div>
  );
};

export default Home;
