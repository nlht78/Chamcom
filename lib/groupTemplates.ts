export type GroupId = 'dqtt' | 'can-bo' | 'can-bo-xa' | 'nguoi-ngoai';

export interface GroupTemplate {
  id: GroupId;
  label: string;
  members: string[];
}

export const GROUP_TEMPLATES: GroupTemplate[] = [
  {
    id: 'dqtt',
    label: 'DQTT',
    members: [
      'Trần Long Hải',
      'Lê Kỳ Hoàng',
      'Lê Hà Hải Quân',
      'Nguyễn Thành Đô',
      'Nguyễn Lê Hiếu Thịnh',
      'Lê Nguyễn Đức Tâm',
    ],
  },
  {
    id: 'can-bo',
    label: 'Cán bộ',
    members: [
      'Võ Văn Linh',
      'Trần Cao Thi',
      'Nguyễn Thành Kính',
      'Đinh Kiều Anh Phụng',
      'Huỳnh Văn May',
      'Võ Đức Phát',
    ],
  },
  {
    id: 'can-bo-xa',
    label: 'Cán bộ xã',
    members: ['Cô Nương', 'Chú Chánh', 'Chú Thoại'],
  },
  { id: 'nguoi-ngoai', label: 'Người ngoài', members: [] },
];
