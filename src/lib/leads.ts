export type LeadPayload = {
  type: "angler" | "owner";
  name?: string;
  phone?: string;
  pondName?: string;
  date?: string;
  comment?: string;
  source?: string;
  website?: string;
};

export async function submitLead(payload: LeadPayload) {
  console.log("Lead is ready for backend integration:", payload);

  return {
    ok: true,
    payload
  };
}
