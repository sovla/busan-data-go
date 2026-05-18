import { NextRequest, NextResponse } from 'next/server';
import { Facility } from '@/types/facility';

const MOCK_FACILITIES: Facility[] = [
  // 수유실
  {
    id: 1,
    type: 'nursing_room',
    name: '부산시청 수유실',
    address: '부산광역시 연제구 중앙대로 1001',
    road_address: '부산광역시 연제구 중앙대로 1001',
    phone: '051-888-0000',
    district: '연제구',
    lat: 35.1798,
    lng: 129.0750,
    metadata: { floor: '2층', hours: '09:00-18:00', facilities: ['수유침대', '기저귀교환대', '냉장고'] },
  },
  {
    id: 2,
    type: 'nursing_room',
    name: '롯데백화점 광복점 수유실',
    address: '부산광역시 중구 중앙대로 2',
    road_address: '부산광역시 중구 중앙대로 2',
    phone: '051-678-3000',
    district: '중구',
    lat: 35.1002,
    lng: 129.0322,
    metadata: { floor: '5층', hours: '10:30-20:00', facilities: ['수유침대', '기저귀교환대', '전자레인지'] },
  },
  {
    id: 3,
    type: 'nursing_room',
    name: '센텀시티몰 수유실',
    address: '부산광역시 해운대구 센텀남대로 35',
    road_address: '부산광역시 해운대구 센텀남대로 35',
    phone: '051-731-3500',
    district: '해운대구',
    lat: 35.1694,
    lng: 129.1317,
    metadata: { floor: '4층', hours: '10:00-22:00', facilities: ['수유침대', '기저귀교환대', '소파'] },
  },
  // 키즈카페
  {
    id: 4,
    type: 'kids_cafe',
    name: '키즈파크 해운대점',
    address: '부산광역시 해운대구 해운대로 772',
    road_address: '부산광역시 해운대구 해운대로 772',
    phone: '051-742-1234',
    district: '해운대구',
    lat: 35.1623,
    lng: 129.1603,
    metadata: { capacity: 50, age_range: '0-7세', price: '시간당 8,000원', cctv: true },
  },
  {
    id: 5,
    type: 'kids_cafe',
    name: '아이사랑 키즈카페 서면점',
    address: '부산광역시 부산진구 서면문화로 27',
    road_address: '부산광역시 부산진구 서면문화로 27',
    phone: '051-803-5678',
    district: '부산진구',
    lat: 35.1578,
    lng: 129.0590,
    metadata: { capacity: 40, age_range: '0-10세', price: '시간당 7,000원', cctv: true },
  },
  {
    id: 6,
    type: 'kids_cafe',
    name: '꼬마숲 키즈카페 동래점',
    address: '부산광역시 동래구 중앙대로 1393',
    road_address: '부산광역시 동래구 중앙대로 1393',
    phone: '051-555-9012',
    district: '동래구',
    lat: 35.2047,
    lng: 129.0838,
    metadata: { capacity: 35, age_range: '0-8세', price: '시간당 7,500원', cctv: true },
  },
  // 산후조리원
  {
    id: 7,
    type: 'postpartum',
    name: '해운대 행복산후조리원',
    address: '부산광역시 해운대구 좌동순환로 99',
    road_address: '부산광역시 해운대구 좌동순환로 99',
    phone: '051-701-2345',
    district: '해운대구',
    lat: 35.1757,
    lng: 129.1456,
    metadata: { capacity: 20, price_range: '200-300만원/2주', cctv: true, rating: 4.5 },
  },
  {
    id: 8,
    type: 'postpartum',
    name: '사랑둥이 산후조리원',
    address: '부산광역시 연제구 과정로 151',
    road_address: '부산광역시 연제구 과정로 151',
    phone: '051-867-3456',
    district: '연제구',
    lat: 35.1834,
    lng: 129.0812,
    metadata: { capacity: 15, price_range: '180-250만원/2주', cctv: true, rating: 4.2 },
  },
  {
    id: 9,
    type: 'postpartum',
    name: '엄마품 산후조리원 서구점',
    address: '부산광역시 서구 대티로 99',
    road_address: '부산광역시 서구 대티로 99',
    phone: '051-240-4567',
    district: '서구',
    lat: 35.1052,
    lng: 129.0120,
    metadata: { capacity: 12, price_range: '170-220만원/2주', cctv: true, rating: 4.0 },
  },
  // 어린이집
  {
    id: 10,
    type: 'daycare',
    name: '해운대구립 어린이집',
    address: '부산광역시 해운대구 해운대로 570',
    road_address: '부산광역시 해운대구 해운대로 570',
    phone: '051-749-5678',
    district: '해운대구',
    lat: 35.1632,
    lng: 129.1525,
    metadata: { capacity: 60, age_range: '0-5세', type: '국공립', cctv: true },
  },
  {
    id: 11,
    type: 'daycare',
    name: '연제구립 꿈나무 어린이집',
    address: '부산광역시 연제구 연제로 2',
    road_address: '부산광역시 연제구 연제로 2',
    phone: '051-866-6789',
    district: '연제구',
    lat: 35.1769,
    lng: 129.0793,
    metadata: { capacity: 45, age_range: '0-5세', type: '국공립', cctv: true },
  },
  {
    id: 12,
    type: 'daycare',
    name: '금정구 별빛 어린이집',
    address: '부산광역시 금정구 금정로 20',
    road_address: '부산광역시 금정구 금정로 20',
    phone: '051-518-7890',
    district: '금정구',
    lat: 35.2420,
    lng: 129.0923,
    metadata: { capacity: 30, age_range: '0-5세', type: '민간', cctv: true },
  },
  // 병원
  {
    id: 13,
    type: 'hospital',
    name: '부산대학교병원 소아청소년과',
    address: '부산광역시 서구 구덕로 179',
    road_address: '부산광역시 서구 구덕로 179',
    phone: '051-240-7000',
    district: '서구',
    lat: 35.1042,
    lng: 129.0155,
    metadata: { specialty: '소아청소년과', emergency: true, rating: 4.7 },
  },
  {
    id: 14,
    type: 'hospital',
    name: '해운대백병원 소아과',
    address: '부산광역시 해운대구 해운대로 875',
    road_address: '부산광역시 해운대구 해운대로 875',
    phone: '051-797-3000',
    district: '해운대구',
    lat: 35.1793,
    lng: 129.1678,
    metadata: { specialty: '소아청소년과', emergency: true, rating: 4.5 },
  },
  {
    id: 15,
    type: 'hospital',
    name: '동아대학교병원 소아과',
    address: '부산광역시 서구 대신공원로 26',
    road_address: '부산광역시 서구 대신공원로 26',
    phone: '051-240-2400',
    district: '서구',
    lat: 35.1123,
    lng: 129.0089,
    metadata: { specialty: '소아청소년과', emergency: true, rating: 4.3 },
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '35.1796');
  const lng = parseFloat(searchParams.get('lng') || '129.0756');
  const radius = parseFloat(searchParams.get('radius') || '5000');
  const typesParam = searchParams.get('types');
  const types = typesParam ? typesParam.split(',') : null;

  let facilities = MOCK_FACILITIES;

  if (types && types.length > 0) {
    facilities = facilities.filter((f) => types.includes(f.type));
  }

  if (lat && lng && radius) {
    facilities = facilities.filter((f) => {
      const dLat = (f.lat - lat) * 111000;
      const dLng = (f.lng - lng) * 111000 * Math.cos((lat * Math.PI) / 180);
      const distance = Math.sqrt(dLat * dLat + dLng * dLng);
      return distance <= radius;
    });
  }

  return NextResponse.json({ facilities, total: facilities.length });
}
