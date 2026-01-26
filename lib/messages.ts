export const messages = {
  upload: {
    invalidType: "Please upload a PDF or a supported draft file.",
    failed: "Upload did not complete. Nothing was filed. Try again.",
    retry: "Try again. If it keeps failing, export a PDF and retry."
  },
  commit: {
    failed: "We could not verify the upload yet. Your file is still private. Try again.",
    notReady: "This version is not finalized yet. Commit the upload first."
  },
  packet: {
    failed: "Packet generation failed. Your draft is still saved. Retry in a moment."
  },
  share: {
    failed: "We could not create the share link. Try again.",
    unavailable: "Link unavailable."
  },
  auth: {
    required: "Please sign in to protect a draft."
  },
  general: {
    unexpected: "Something went wrong. Try again.",
    network: "Network issue. Check your connection and retry."
  }
};
