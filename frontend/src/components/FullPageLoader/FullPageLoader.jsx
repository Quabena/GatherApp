import React from "react";
import { Loader2 } from "lucide-react";

const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
  </div>
);

export default FullPageLoader;
