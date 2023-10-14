import { UserInfo } from '../types/userInfo.interface';

export function getName(userInfo: UserInfo | undefined) {
  if (!userInfo || (!userInfo.name && !userInfo.surname)) {
    return 'Unknown';
  }

  const str = (userInfo.name || '') + ' ' + (userInfo.surname || '');

  if (str.length >= 20) {
    return str.slice(0, 17).trim() + '...';
  }

  return str;
}
