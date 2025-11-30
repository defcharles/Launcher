import React, { useState } from "react";
import { motion } from "framer-motion";
import { SettingsTopBar } from "@/components/Settings/Sidebar";

import { AppearancePage } from "@/components/Settings/pages/AppearancePage";
import { AccountPage } from "@/components/Settings/pages/AccountPage";
import { OptionsPage } from "@/components/Settings/pages/OptionsPage";
import { DeveloperPage } from "@/components/Settings/pages/DeveloperPage";
import GlassContainer from "@/components/Global/GlassContainer";

const Settings: React.FC = () => {
  const [view, setView] = useState("Appearance");

  const renderView = () => {
    switch (view) {
      case "Appearance":
        return <AppearancePage />;
      case "Account":
        return <AccountPage />;
      case "Options":
        return <OptionsPage />;
      case "Developer":
        return <DeveloperPage />;
      default:
        return <AppearancePage />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "tween", duration: 0.3 }}
      className="w-[calc(100vw-64px)] ml-16 h-screen flex flex-col gap-2 px-5 py-5"
    >
      <div className="pt-4">
        <SettingsTopBar onSelect={(v) => setView(v)} />
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 p-4"
      >
        <GlassContainer className="p-4 rounded-xl">
          {renderView()}
        </GlassContainer>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
