/** The pictures `ChallengeArt` can draw — four per case study. */
export type ArtKind =
  | "files"
  | "status"
  | "followups"
  | "pipeline"
  | "tabs"
  | "approvals"
  | "insights"
  | "capacity"
  | "stock"
  | "listing"
  | "reach"
  | "channels";

export interface ChallengeCard {
  art: ArtKind;
  title: string;
  /** What the challenge cost the team — our copy, from the page's story. */
  body: string;
}
