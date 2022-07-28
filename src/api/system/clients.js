import http from '@/http';

// 客户端管理（接口聚合，无管理界面）

// 客户端静态配置
const CLIENTS_PRESET = {
  applet: '神鹰轨迹',
  manage: '神鹰风控运营平台',
  merchant_pc: '神鹰风控',
  mini_service: '神鹰助手'
};

// 获取客户端列表
export const GetClients = async () => {
  const res = await http.get('/api/manage/client/simple/list');
  return (res.data || []).reverse().map(row => {
    return {
      ...row,
      name: CLIENTS_PRESET[row.clientId] || row.name
    };
  });
};

// 信息获取
export const GetClientAccount = async (account, clientId) => {
  const res = await http.get(
    `/api/manage/accounts/account/${account}/clients/${clientId}/token`
  );
  if (!res || !res.data) throw '没有找到匹配的账号';
  return res.data;
};
