// Simple toast event system – no external deps needed
export const toast = {
  success: (msg) => window.dispatchEvent(new CustomEvent("app-toast", { detail: { msg, type: "success" } })),
  error:   (msg) => window.dispatchEvent(new CustomEvent("app-toast", { detail: { msg, type: "error"   } })),
  info:    (msg) => window.dispatchEvent(new CustomEvent("app-toast", { detail: { msg, type: "info"    } })),
};
