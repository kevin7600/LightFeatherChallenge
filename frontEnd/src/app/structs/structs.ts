export enum ContactType {
    Email,
    Phone
  }

export const Regex = {
  phoneRegex: '^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$',
  nameRegex: "^[a-zA-Z]+$",

}

export interface BackendResponse {
  msg: string
} 