import http from '@/http';

// 获取商户策略列表
export const getStrategy = async (merchantNo) => {
  const res = await http.get(`/api/manage/equipment-strategy/${merchantNo}`);
  if (!res || !res.data) return [];
  return res.data;
};

// 增加商户策略
export const postStrategy = async (merchantNo, data) => {
  try {
    const res = await http.post(`/api/manage/equipment-strategy/${merchantNo}`, data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 修改商户策略
export const putStrategy = async (merchantNo, strategyNo, data) => {
  try {
    const res = await http.put(`/api/manage/equipment-strategy/${merchantNo}/${strategyNo}`, data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 删除商户策略
export const delStrategy = async (merchantNo, strategyNo) => {
  try {
    const res = await http.delete(`/api/manage/equipment-strategy/${merchantNo}/${strategyNo}`);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};
