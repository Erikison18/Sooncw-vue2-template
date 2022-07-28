import http from '@/http';

// 操作日志

// 操作日志查询参数
export const GetOperateLogsParams = {
  clientId: null,
  description: null,
  endTime: null,
  logType: null,
  operator: null,
  startTime: null
};

// 分页查询操作日志
export const GetOperateLogs = async (data, query) => {
  const _data = {
    ...GetOperateLogsParams,
    ...data
  };
  const res = await http.post('/api/sys-operate-log/page', _data, {
    params: {
      pageNumber: query.pageNumber || http.paging.pageNumber,
      pageSize: query.pageSize || http.paging.pageSize
    }
  });
  if (!res || !res.data) return { records: [], total: 0 };
  return res.data;
};
