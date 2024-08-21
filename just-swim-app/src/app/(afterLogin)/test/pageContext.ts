import React from "react";

export const PageContext = React.createContext<{
  showToast: () => void
}>({
  showToast: () => {}
});