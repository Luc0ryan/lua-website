import { projectSchema } from "./project";
import { locationSchema } from "./location";
import { homepageSchema } from "./homepage";
import { instagramPostSchema } from "./instagramPost";
import { siteSettingsSchema } from "./siteSettings";
import { staffMemberSchema } from "./staffMember";

export const schemaTypes = [
  projectSchema,
  locationSchema,
  homepageSchema,
  instagramPostSchema,
  siteSettingsSchema,
  staffMemberSchema,
];
