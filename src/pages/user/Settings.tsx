import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import {
  FiUser,
  FiShield,
  FiCreditCard,
  FiSettings as FiSettingsIcon,
  FiDatabase,
} from "react-icons/fi";
import { AccountTab } from "./SettingsSections/AccountTab";
import { SecurityTab } from "./SettingsSections/SecurityTab";
import { BillingTab } from "./SettingsSections/BillingTab";
// import { PreferencesTab } from "./SettingsSections/PreferencesTab";
import { DataPrivacyTab } from "./SettingsSections/DataPrivacyTab";

interface SettingsPageProps {
  userData: any;
  fetchProfileDetails: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userData,
  fetchProfileDetails,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedTab]);

  if (!userData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      name: "Account",
      icon: <FiUser />,
      component: (
        <AccountTab userData={userData} fetchProfileDetails={fetchProfileDetails} />
      ),
    },
    {
      name: "Security",
      icon: <FiShield />,
      component: (
        <SecurityTab userData={userData} fetchProfileDetails={fetchProfileDetails} />
      ),
    },
    {
      name: "Billing",
      icon: <FiCreditCard />,
      component: <BillingTab />,
    },
    // ✅ COMMENTED OUT - Coming soon
    // {
    //   name: "Preferences",
    //   icon: <FiSettingsIcon />,
    //   component: <PreferencesTab />,
    // },
    {
      name: "Danger Zone", // ✅ RENAMED from "Data & Privacy"
      icon: <FiDatabase />,
      component: <DataPrivacyTab userData={userData} />,
    },
  ];

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        layout
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-pink-50 opacity-60" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiSettingsIcon className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Settings
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage your account configuration and preferences
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        {/* Tab List - Horizontal scroll on mobile */}
        <Tab.List className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max md:min-w-0">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </Tab>
            ))}
          </div>
        </Tab.List>

        {/* Tab Panels */}
        <Tab.Panels>
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className="focus:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {tab.component}
              </motion.div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  );
};