import { UploadFile } from "antd";
import { PageableDTO, SortDTO } from "./pagination.types";

export type UserProfiles = {
  accountData: AccountDataDTO;
  hasClientProfile: boolean;
  hasCaretakerProfile: boolean;
};

export type AccountDataDTO = {
  email: string;
  name: string;
  surname: string;
  profilePicture: Photo | null;
};

export type Photo = {
  blob: string;
  url: string;
};

export type UploadFileWithBlob = {
  file: UploadFile;
  blob: string;
};

export type RelatedUsers = {
  content: [
    {
      email: string;
      name: string;
      surname: string;
    }
  ];
  pageable: PageableDTO;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: SortDTO[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type UserBlockInfo = {
  isBlocked: boolean;
  whichUserBlocked?: { 
    name: string;
    surname: string;
    email: string;
  };
};
