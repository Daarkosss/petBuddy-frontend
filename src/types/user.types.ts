export type UserProfiles = {
  accountData: {
    email: string;
    name: string;
    surname: string,
    profilePicture: {
      blob: string;
      url: string;
    };
  };
  hasClientProfile: boolean;
  hasCaretakerProfile: boolean;
};
