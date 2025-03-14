import React from "react";
import Button from "../Button/Button";
import { FiBell, FiMail } from "react-icons/fi";
import { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Notification Setttings */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiBell className="mr-3 text-blue-600" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle("pushNotifications")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Email Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiMail className="mr-3 text-blue-600" />
            Email Preferences
          </h2>
          <div className="flex items-center justify-between">
            <span>Monthly Newsletter</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.newsletter}
                onChange={() => handleToggle("newsletter")}
              />
              <span className="silder"></span>
            </label>
          </div>
        </div>

        <div className="pt-6">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
