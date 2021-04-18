/*
 * @Author: Aven
 * @Date: 2021-04-06 10:19:36
 * @LastEditors: Aven
 * @LastEditTime: 2021-04-18 16:31:34
 * @Description:
 */

import {
  getToken,
  createUserInfo,
  CAT_DATA,
  getStorage,
  getNameUsed
} from './apiBase';
import { NameUsed } from './interface';
export function isLogin(): boolean {
  const token = getToken();
  if (token) return true;
  return false;
}
export async function login(ethAddress: string, address: string) {
  // 后台服务器绑定地址
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await createUserInfo({
    ethAddress,
    address
  });
  console.log(data);
  return data;
}

export async function getNameIsUsed(name: string): Promise<boolean> {
  const data = await getNameUsed(name);
  const used = (data.data as NameUsed).used;
  return used;
}

export function getUserInfo() {
  let data = getStorage(CAT_DATA);
  const cat = getStorage('cell');
  data = Object.assign(data, { cat });
  return data;
}
