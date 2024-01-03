import React from "react";
import { toast } from "react-toastify";

function Toast({ error = "Erreur", info }: { error: string; info?: string }) {
  return (
    <div>
      <p>{error}</p>
      {info && <p className="text-gray-500">{info?.toString()}</p>}
    </div>
  );
}

export default Toast;
