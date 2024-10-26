import { UploadFile } from "antd";

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

export type UploadFileWithBlob = {
  file: UploadFile;
  blob: string;
}
