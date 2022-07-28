import http from '@/http';

// 登录日志

// 登录日志查询参数
export const GetSignLogsParams = {
  clientId: 'manage',
  endTime: null,
  startTime: null,
  username: null
};

// 分页查询登录日志
export const GetSignLogs = async (data, query) => {
  const _data = {
    ...GetSignLogsParams,
    ...data
  };
  const res = await http.post('/api/manage/login-log/page', _data, {
    params: {
      pageNumber: query.pageNumber || http.paging.pageNumber,
      pageSize: query.pageSize || http.paging.pageSize
    }
  });
  if (!res || !res.data) return { records: [], total: 0 };
  return res.data;
};
