export type UserProfiles = {
  accountData: AccountDataDTO;
  hasClientProfile: boolean;
  hasCaretakerProfile: boolean;
};

export type AccountDataDTO = {
  email: string;
  name: string;
  surname: string;
  profilePicture: Photo;
};

export type Photo = {
  blob: string;
  url: string;
}
