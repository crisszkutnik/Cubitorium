import { UserInfo } from '../types/userInfo.interface';

export function getName(userInfo: UserInfo | undefined) {
  if (!userInfo || (!userInfo.name && !userInfo.surname)) {
    return 'Unknown';
  }

  return (userInfo.name || '') + ' ' + (userInfo.surname || '');
}
