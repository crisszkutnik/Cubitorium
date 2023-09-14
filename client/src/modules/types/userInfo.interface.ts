export interface UserInfo {
  name?: string;
  surname?: string;
  wcaId?: string;
  location?: string;
}

export interface UserInfoWithPk extends UserInfo {
  publicKey: string;
}
