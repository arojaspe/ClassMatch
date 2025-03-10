export interface UsuarioClassmatch {
  [x: string]: any;
  user: any;
  matches: any;
  USER_ID: string; // UUID format
  USER_FIRSTNAME: string | null; // Can be null if not mandatory
  USER_LASTNAME: string | null; // Can be null if not mandatory
  USER_EMAIL: string | null; // Email should ideally have a stricter pattern validation
  USER_COLLEGE_ID: string | null; // UUID format
  USER_GENDER: "M" | "F" | "NB" | null; // ENUM values
  USER_BIRTHDATE: string | null; // ISO format date as string
  USER_BIO: string | null;
  USER_STATUS: boolean | null; // Active status
  USER_LAST_LOG: string | null; // Time in string format (HH:mm:ss)
  USER_RATING: number | null; // Float value
  USER_FILTER_AGE: string | null; // Example "18-25"
  USER_SUPERMATCHES: number | null; // Integer value
  USER_FILTER_GENDER: "M" | "F" | "NB" | null; // ENUM values
  USER_IMAGES: Array<{
    IMAGE_LINK: string;
    IMAGE_ORDER: number;
  }> | null;
}

export type UserImageGalleryProps = UserImage[] | null;

export interface UserImage {
  IMAGE_LINK: string | null;
  IMAGE_ORDER: number | null;
}

export interface Interest {
  INTEREST_ID: string;
  INTEREST_NAME: string;
}
export type ScheduleType = {
  [key in
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"]: boolean[];
};
