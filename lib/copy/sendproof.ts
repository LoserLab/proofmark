export const sendProofCopy = {
  name: "SendProof",

  shortDescription:
    "Generate durable proof that something was sent or submitted at a specific moment.",

  helper:
    "Creates a timestamped record of an action. Does not verify receipt or outcomes.",

  actionClarifier:
    "Records actions, not outcomes. It does not verify receipt or responses.",

  howItWorks: {
    title: "Proof beyond creation",
    body:
      "ProofMark creates durable proof when a draft is created and archived. " +
      "SendProof extends that record to moments when a draft is sent, submitted, or delivered.",
    disclaimer: "SendProof records actions, not outcomes.",
  },
};
