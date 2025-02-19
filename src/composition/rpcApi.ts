/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * @Author: Aven
 * @Date: 2021-04-08 12:16:20
 * @LastEditors: Aven
 * @LastEditTime: 2021-04-16 23:34:39
 * @Description:
 */
import { useConfig } from './baseConfig';
import { RpcResponse } from './interface';
import { Address } from '@lay2/pw-core';

const prcPost = async (params: Record<string, unknown>, url?: string) =>
  post(params);
const post = async (params: Record<string, unknown>, url?: string) => {
  const body = JSON.stringify(params, null, '  ');
  if (!url) url = useConfig().indexer_rpc;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    body,
    mode: 'cors'
  });
  const res = (await response.json()) as RpcResponse;
  return res;
};

// Returns the live cells collection by the lock or type script.
export async function getLiveCell(address: Address) {
  const params = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: address.toLockScript().serializeJson(),
        script_type: 'lock'
      },
      'asc',
      '0x64'
    ]
  };
  const res = await prcPost(params);
  // todo  根据cells更新后台的数据
  return res.result.objects;
}
// Returns the transactions collection by the lock or type script.
export async function getTransaction(): Promise<RpcResponse> {
  const params = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_transactions',
    params: [
      {
        script: {
          code_hash:
            '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hash_type: 'type',
          args: '0x8211f1b938a107cd53b6302cc752a6fc3965638d'
        },
        script_type: 'lock'
      },
      'asc',
      '0x64'
    ]
  };
  const res = await prcPost(params);
  return res;
}
//Returns the indexed tip block
export async function getTip(): Promise<RpcResponse> {
  const params = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_tip'
  };
  const res = await prcPost(params);
  return res;
}
