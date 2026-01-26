export const Errors = {
  upload: {
    network: {
      title: "Network error",
      body: "The upload request failed. Check your connection and try again.",
      recovery: "If this persists, try refreshing the page or using a different network.",
    },
    invalidType: {
      title: "Invalid file type",
      body: "Please upload a PDF, DOCX, or TXT file.",
      recovery: "Convert your file to one of the supported formats and try again.",
    },
    failed: {
      title: "Upload failed",
      body: "The file could not be uploaded. Nothing was saved.",
      recovery: "Try again. If it keeps failing, export a PDF and retry.",
    },
    retry: {
      title: "Upload incomplete",
      body: "The upload did not complete successfully.",
      recovery: "Try again. If it keeps failing, export a PDF and retry.",
    },
    missingFields: {
      title: "Missing information",
      body: "Required information is missing. Please check your input.",
      recovery: "Fill in all required fields and try again.",
    },
  },
  commit: {
    failed: {
      title: "Commit failed",
      body: "We could not verify the upload yet. Your file is still private.",
      recovery: "Try again. The file is saved but not yet committed.",
    },
    notReady: {
      title: "Version not ready",
      body: "This version is not finalized yet. Commit the upload first.",
      recovery: "Complete the upload process before generating the evidence pack.",
    },
  },
  packet: {
    failed: {
      title: "Packet generation failed",
      body: "Packet generation failed. Your draft is still saved.",
      recovery: "Retry in a moment. Your data is safe.",
    },
    missingUrl: {
      title: "Download unavailable",
      body: "The download link was not returned by the server.",
      recovery: "Try generating the evidence pack again.",
    },
  },
  share: {
    failed: {
      title: "Share link creation failed",
      body: "We could not create the share link. Try again.",
      recovery: "The draft is still accessible. Try creating the link again.",
    },
    unavailable: {
      title: "Link unavailable",
      body: "This share link may be invalid, expired, or revoked.",
      recovery: "Contact the sender if you need access to this content.",
    },
    expired: {
      title: "Link expired",
      body: "This share link has expired. Ask the sender to generate a new link.",
      recovery: "Contact the owner if you need access to this content.",
    },
    revoked: {
      title: "Link revoked",
      body: "Access to this shared view has been revoked by the owner.",
      recovery: "Contact the owner if you need access to this content.",
    },
    loadFailed: {
      title: "Unable to load share",
      body: "Something went wrong while loading the shared view.",
      recovery: "Try again later or contact the sender if the problem persists.",
    },
  },
  auth: {
    required: {
      title: "Authentication required",
      body: "Please sign in to protect a draft.",
      recovery: "Sign in or create an account to continue.",
    },
    signupFailed: {
      title: "Sign up failed",
      body: "We could not create your account. Please try again.",
      recovery: "Check your information and try again. If this persists, contact support.",
    },
    loginFailed: {
      title: "Sign in failed",
      body: "We could not sign you in. Please check your credentials.",
      recovery: "Verify your email and password, then try again.",
    },
  },
  general: {
    unexpected: {
      title: "Something went wrong",
      body: "An unexpected error occurred. Try again.",
      recovery: "If this persists, refresh the page or contact support.",
    },
    network: {
      title: "Network issue",
      body: "Network issue. Check your connection and retry.",
      recovery: "Verify your internet connection and try again.",
    },
    loadFailed: {
      title: "Failed to load",
      body: "We could not load the requested information.",
      recovery: "Try refreshing the page or contact support if the problem persists.",
    },
  },
} as const;
