export const onboardingCopy = {
  upload: {
    title: "Upload your draft",
    helper: "This version will be fingerprinted and timestamped."
  },

  basics: {
    title: "Draft details",
    titleLabel: "Title of work",
    titlePlaceholder: "Untitled draft",
    titleHelper: "Use the title you currently work under.",
    labelLabel: "Draft label",
    labelOptions: [
      "First draft",
      "Revised draft",
      "Final draft",
      "Working copy",
      "Other"
    ],
    labelHelper: "Labels help track version history."
  },

  authorship: {
    authorsLabel: "How many authors are credited?",
    authorsOptions: ["One", "Two", "Three or more"],
    authorsHelper: "Use the authorship you would publicly claim.",
    wfhLabel: "Is this a work made for hire?",
    wfhOptions: ["No", "Yes", "Not sure"],
    wfhHelper: "If unsure, select Not sure."
  },

  publication: {
    label: "Has this draft been published?",
    options: ["Unpublished", "Published", "Not sure"],
    helper: "Most drafts are unpublished."
  },

  preexisting: {
    label: "Does this draft include preexisting material?",
    options: ["No", "Yes", "Not sure"],
    helper: "For adaptations or incorporated prior material."
  },

  path: {
    label: "Choose your protection path",
    options: [
      "Evidence Pack only",
      "Evidence Pack plus guided U.S. copyright filing",
      "Evidence Pack plus guided filing and optional WGA assistance"
    ],
    helper: "Registration is completed by you, with guidance."
  },

  confirm: {
    title: "Generate your Evidence Pack",
    includes: [
      "Timestamped authorship receipt",
      "File fingerprint",
      "Metadata summary",
      "Guided filing worksheet"
    ]
  }
};
