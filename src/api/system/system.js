import http from '@/http';

// 系统设置

// 获取车辆停留时长
export const GetCarStayTime = async () => {
  const res = await http.get('/api/manage/sys-set/car-stay');
  if (!res || !res.data) return 0;
  return res.data;
};

// 更新车辆停留时长
export const SetCarStayTime = async time => {
  if (!/\d+/g.test(time)) throw '请设置一个有效的时间';
  await http.patch(`/api/manage/sys-set/car-stay/${time}`);
};
