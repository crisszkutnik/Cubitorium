export interface UserInfo {
  name?: string;
  surname?: string;
  wcaId?: string;
  location?: string;
  birthdate?: string;
  likesReceived: number;
  submittedSolutions: number;
  joinTimestamp: number;
  profileImgSrc?: string;
}

export interface UserInfoWithPk extends UserInfo {
  publicKey: string;
}
