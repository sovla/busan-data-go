# Design System — 맘편한 부산

## 원칙

1. **앱 퍼스트**: 웹사이트가 아닌 모바일 앱처럼 보이고 느껴져야 한다
2. **토스 스타일**: 넓은 여백, 낮은 정보밀도, 한 화면에 하나의 메시지
3. **따뜻함 + 신뢰**: 임산부/부모 대상 — 파스텔이 아닌, 따뜻하되 전문적인 톤
4. **AI는 뒤에**: AI 기능이 핵심이지만, "AI" 단어를 전면에 내세우지 않는다

---

## 색상 (Color Tokens)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `primary` | `#FF6B6B` | 주요 액션, 활성 상태, CTA 버튼 |
| `primary-light` | `#FFF0F0` | 주요 색 배경 (아이콘 배경, 뱃지) |
| `accent` | `#4ECDC4` | 보조 강조 (민트, 시설 관련) |
| `accent-light` | `#F0FDFB` | 보조 색 배경 |
| `surface` | `#FFFFFF` | 카드, 시트, 모달 배경 |
| `background` | `#F8F8F8` | 페이지 배경 |
| `warm-bg` | `#FFF8F0` | 따뜻한 섹션 배경 (통계, 배너) |
| `text-primary` | `#1A1A1A` | 제목, 핵심 텍스트 |
| `text-secondary` | `#6B7280` | 본문, 설명 |
| `text-tertiary` | `#9CA3AF` | 캡션, 보조 텍스트 |
| `border` | `#F3F4F6` | 카드/구분선 테두리 |
| `naver-green` | `#03C75A` | 네이버 지도 길찾기 버튼 |

### 시설 유형별 색상

| 유형 | 색상 | 배경 |
|------|------|------|
| 수유실 | `#FF6B6B` | `#FFF0F0` |
| 키즈카페 | `#4ECDC4` | `#F0FDFB` |
| 산후조리원 | `#9B59B6` | `#F8F0FF` |
| 어린이집 | `#2ECC71` | `#F0FFF4` |
| 병원 | `#F39C12` | `#FFF8E7` |

---

## 타이포그래피

폰트: Pretendard (시스템 폴백: -apple-system, sans-serif)

| 레벨 | 크기 | 행간 | 굵기 | Tailwind |
|------|------|------|------|----------|
| H1 (페이지 제목) | 26px | 34px | Bold (700) | `text-[26px] leading-[34px] font-bold` |
| H2 (섹션 제목) | 20px | 28px | Bold (700) | `text-xl leading-7 font-bold` |
| H3 (카드 제목) | 16px | 24px | Semibold (600) | `text-base font-semibold` |
| Body | 14px | 22px | Regular (400) | `text-sm leading-[22px]` |
| Caption | 12px | 18px | Regular (400) | `text-xs leading-[18px]` |
| Micro | 10px | 14px | Medium (500) | `text-[10px] leading-[14px] font-medium` |

---

## 간격 (Spacing)

4px 기반 스케일:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `xs` | 4px | 아이콘-텍스트 간격 |
| `sm` | 8px | 요소 내부 간격 |
| `md` | 12px | 카드 내부 패딩 (compact) |
| `base` | 16px | 카드 내부 패딩, 페이지 좌우 패딩 |
| `lg` | 20px | 섹션 내 간격 |
| `xl` | 24px | 섹션 간 간격 |
| `2xl` | 32px | 큰 섹션 간 간격 |
| `3xl` | 48px | 페이지 상단 여백 |

**페이지 좌우 패딩**: 항상 `px-4` (16px)
**섹션 간 간격**: `py-6` (24px) 또는 `gap-6`
**카드 내부 패딩**: `p-4` (16px)

---

## 컴포넌트

### 카드

```
radius: 16px (rounded-2xl)
padding: 16px (p-4)
border: 1px solid #F3F4F6 (border border-gray-100)
shadow: 0 1px 3px rgba(0,0,0,0.05) (shadow-sm)
hover: shadow-md, translateY(-1px)
active: scale(0.98)
```

### 버튼

```
높이: 48px (h-12)
radius: 12px (rounded-xl)
폰트: 14px semibold
primary: bg-[#FF6B6B] text-white
secondary: bg-gray-100 text-gray-700
active: scale(0.95)
최소 터치 영역: 44x44px
```

### 리스트 아이템

```
높이: 최소 56px, 일반 72px
padding: 12px 16px
separator: 0.5px border-gray-100
아이콘 영역: 40x40px rounded-xl
터치 타겟: 전체 영역
active 피드백: bg-gray-50 scale(0.98)
```

### 하단 탭바

```
높이: 56px + safe-area-inset-bottom
배경: white/80 backdrop-blur-md
border-top: 1px #F3F4F6
아이콘: 20px
라벨: 10px
활성: primary(#FF6B6B)
비활성: #9CA3AF
```

### 상단 헤더

```
높이: 56px
배경: white
border-bottom: 1px #F3F4F6
제목: 18px bold (왼쪽 정렬)
우측: 뱃지 또는 아이콘 버튼
```

### Sheet (바텀시트)

```
radius: 상단 20px (rounded-t-[20px])
handle: 4px높이 36px너비 gray-300 (상단 중앙)
max-height: 85vh
transition: spring (0.3s, bounce)
```

### 채팅 말풍선

```
사용자: 오른쪽, bg-[#FF6B6B] text-white, rounded-2xl rounded-br-sm
AI: 왼쪽, bg-white border border-gray-100, rounded-2xl rounded-bl-sm
max-width: 80%
padding: 12px 16px
```

---

## 애니메이션

| 종류 | duration | easing | 용도 |
|------|----------|--------|------|
| 페이지 진입 | 300ms | ease-out | fade + slideY(8px) |
| 카드 stagger | 각 80ms | ease-out | 리스트 아이템 순차 진입 |
| 버튼 press | 100ms | ease-in-out | scale(0.95) |
| Sheet 열림 | 350ms | spring(0.34,1.56,0.64,1) | translateY |
| 탭 인디케이터 | layout | spring | 좌우 슬라이드 |
| 숫자 카운트업 | 1000ms | ease-out | 0→목표값 |

---

## 레이아웃

### App Shell 구조

```
┌─────────────────────────┐
│    상단 헤더 (56px)       │  ← 고정
├─────────────────────────┤
│                         │
│    스크롤 콘텐츠          │  ← flex-1 overflow-y-auto
│                         │
├─────────────────────────┤
│   입력창 (채팅 시)        │  ← 고정 (조건부)
├─────────────────────────┤
│   하단 탭바 (56px+safe)  │  ← 고정
└─────────────────────────┘
```

전체 높이: `h-[100dvh]` (동적 뷰포트)
콘텐츠 하단 여백: `pb-[calc(56px+env(safe-area-inset-bottom))]`
max-width: 제한 없음 (모바일 기기 전체 폭 사용)

---

## 금지 사항

- 보라/핑크 그라디언트 배경
- 이모지를 아이콘 대신 사용 (lucide-react만)
- "AI"를 제목/헤더에 노출
- 3열 이상 카드 그리드 (모바일에서 비좁음)
- 12px 미만 텍스트 (가독성)
- 44px 미만 터치 타겟
- 장식용 blur/glow 효과
