import csv
import json
import zipfile
import io
import os
import re
import datetime

DOWNLOADS = "/Users/gavri/Downloads"
OUTPUT = "/Users/gavri/MyProject/whabatna-busan/data/processed"

os.makedirs(OUTPUT, exist_ok=True)


def json_default(obj):
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=json_default)


def safe_float(val):
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def safe_int(val):
    if val is None:
        return None
    s = str(val).strip().replace(",", "").replace("명", "")
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


def clean_price(val):
    if val is None:
        return None
    s = str(val).strip().replace(",", "").replace("원", "").replace(" ", "")
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


# ── 1. SHP → JSON ──────────────────────────────────────────────────────────────

def convert_shp_zip(zip_path, field_map, output_path):
    import shapefile
    import six

    records = []
    with zipfile.ZipFile(zip_path) as zf:
        names = zf.namelist()
        shp_name = next(n for n in names if n.lower().endswith(".shp"))
        base = shp_name[:-4]

        shp_data = zf.read(base + ".shp")
        dbf_data = zf.read(base + ".dbf")

        sf = shapefile.Reader(
            shp=io.BytesIO(shp_data),
            dbf=io.BytesIO(dbf_data),
        )

        field_names = [f[0] for f in sf.fields[1:]]

        for sr in sf.shapeRecords():
            raw = dict(zip(field_names, sr.record))
            record = {}
            for src_key, dst_key in field_map.items():
                val = raw.get(src_key)
                if isinstance(val, bytes):
                    try:
                        val = val.decode("cp949").strip()
                    except Exception:
                        val = val.decode("utf-8", errors="replace").strip()
                elif isinstance(val, str):
                    val = val.strip()
                record[dst_key] = val if val != "" else None
            records.append(record)

    save_json(output_path, records)
    print(f"[1] {os.path.basename(output_path)}: {len(records)}건")
    return records


nursing_field_map = {
    "연번": "id",
    "시도": "sido",
    "시군구": "district",
    "기관명": "name",
    "주소": "address",
    "구분": "category",
    "용도": "usage",
    "상태": "status",
    "위도": "lat",
    "경도": "lng",
}

kids_cafe_field_map = {
    "gugun": "district",
    "cafe_nm": "name",
    "road_nm": "address",
    "tel_no": "phone",
    "lat": "lat",
    "lng": "lng",
    "data_date": "data_date",
}

convert_shp_zip(
    f"{DOWNLOADS}/부산광역시_수유실 보유시설 현황(SHP)_20260116.zip",
    nursing_field_map,
    f"{OUTPUT}/nursing_rooms.json",
)

convert_shp_zip(
    f"{DOWNLOADS}/부산광역시_키즈카페 현황(SHP)_20250925.zip",
    kids_cafe_field_map,
    f"{OUTPUT}/kids_cafes.json",
)


# ── 2. 산후조리원 통합 ─────────────────────────────────────────────────────────

def load_postpartum():
    results = []

    # 해운대 (순번,신고번호,...영업소명,영업소소재지(도로명),...임산부정원수,영유아정원수,...)
    with open(f"{DOWNLOADS}/부산광역시 해운대구_산후조리원 현황_20250410.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("영업소명", "").strip(),
                "district": "해운대구",
                "address": row.get("영업소소재지(도로명)", "").strip(),
                "phone": None,
                "lat": None,
                "lng": None,
                "capacity": safe_int(row.get("임산부정원수(명)")),
                "price_regular": None,
                "price_special": None,
            })

    # 북구 (업소구분,영업소명,영업소소재지(도로명),영업소우편번호(도로명),영업소전화번호)
    with open(f"{DOWNLOADS}/부산광역시 북구_산후조리원 현황_20250723.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("영업소명", "").strip(),
                "district": "북구",
                "address": row.get("영업소소재지(도로명)", "").strip(),
                "phone": row.get("영업소전화번호", "").strip() or None,
                "lat": None,
                "lng": None,
                "capacity": None,
                "price_regular": None,
                "price_special": None,
            })

    # 남구 (연번,명칭,...주소,...연락처,위도,경도,...일반실 가격(1주),특실 가격(1주))
    with open(f"{DOWNLOADS}/부산광역시_남구_산후조리원_현황 20250811.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            cap = safe_int(row.get("임산부실 정원") or row.get("임산부실정원"))
            results.append({
                "name": row.get("명칭", "").strip(),
                "district": "남구",
                "address": row.get("주소", "").strip(),
                "phone": row.get("연락처", "").strip() or None,
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "capacity": cap,
                "price_regular": safe_int(row.get("일반실 가격(1주)")),
                "price_special": safe_int(row.get("특실 가격(1주)")),
            })

    # 연제 (연번,구군명,산후조리원,도로명주소,전화번호,위도,경도)
    with open(f"{DOWNLOADS}/부산광역시_연제구_산후조리원 현황_20231115.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("산후조리원", "").strip(),
                "district": "연제구",
                "address": row.get("도로명주소", "").strip(),
                "phone": row.get("전화번호", "").strip() or None,
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "capacity": None,
                "price_regular": None,
                "price_special": None,
            })

    # 기장 (시도명,구군명,구분,원명,도로명주소,지번주소,...전화번호,...위도,경도)
    with open(f"{DOWNLOADS}/부산광역시_기장군_산후조리원 현황_20240816.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("원명", "").strip(),
                "district": "기장군",
                "address": row.get("도로명주소", "").strip(),
                "phone": row.get("전화번호", "").strip() or None,
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "capacity": None,
                "price_regular": None,
                "price_special": None,
            })

    # 사하 (시군구,산후조리원명,도로명주소,연락처,...일반실이용요금(2주),특실이용요금(2주))
    with open(f"{DOWNLOADS}/부산광역시_사하구_산후조리원현황_20250101.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            pr = clean_price(row.get("일반실이용요금(2주)"))
            ps = clean_price(row.get("특실이용요금(2주)"))
            results.append({
                "name": row.get("산후조리원명", "").strip(),
                "district": "사하구",
                "address": row.get("도로명주소", "").strip(),
                "phone": row.get("연락처", "").strip() or None,
                "lat": None,
                "lng": None,
                "capacity": safe_int(row.get("인원")),
                "price_regular": pr // 2 if pr else None,
                "price_special": ps // 2 if ps else None,
            })

    results = [r for r in results if r["name"]]
    save_json(f"{OUTPUT}/postpartum_centers.json", results)
    print(f"[2] postpartum_centers.json: {len(results)}건")


load_postpartum()


# ── 3. 어린이집 통합 ─────────────────────────────────────────────────────────

def load_daycares():
    results = []

    # 기장 (어린이집명,시도명,시군구명,어린이집 유형,정원,보육교직원 현원,주소,전화번호,팩스번호,보육실수,놀이터수,차량운영)
    with open(f"{DOWNLOADS}/부산광역시_기장군_어린이집 현황_20260116.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("어린이집명", "").strip(),
                "district": row.get("시군구명", "기장군").strip(),
                "type": row.get("어린이집 유형", "").strip(),
                "address": row.get("주소", "").strip(),
                "phone": row.get("전화번호", "").strip() or None,
                "capacity": safe_int(row.get("정원")),
                "staff": safe_int(row.get("보육교직원 현원")),
                "lat": None,
                "lng": None,
                "vehicle": row.get("차량운영", "").strip() or None,
            })

    # 남구 (시도명,시군구명,어린이집코드,어린이집명,어린이집유형구분,운영현황,우편번호,상세주소,어린이집전화번호,
    #        보육실수,보육실 면적,놀이터수,...보육교직원수,정원수,현원수,위도,경도,통학차량운영여부,...)
    with open(f"{DOWNLOADS}/부산광역시_남구_어린이집 현황_20250616.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("어린이집명", "").strip(),
                "district": row.get("시군구명", "남구").strip(),
                "type": row.get("어린이집유형구분", "").strip(),
                "address": row.get("상세주소", "").strip(),
                "phone": row.get("어린이집전화번호", "").strip() or None,
                "capacity": safe_int(row.get("정원수")),
                "staff": safe_int(row.get("보육교직원수")),
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "vehicle": row.get("통학차량운영여부", "").strip() or None,
            })

    # 동래 (시도명,시군구명,어린이집명,어린이집유형,우편번호,도로명주소,전화번호,팩스번호,홈페이지주소,
    #        보육실수,보육실면적,놀이터수,CCTV설치수,보육교직원수,정원수,현원수,통학차량운영,인가일,어린이집특성,위도,경도,...)
    with open(f"{DOWNLOADS}/부산광역시_동래구_어린이집 현황_20250721.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("어린이집명", "").strip(),
                "district": row.get("시군구명", "동래구").strip(),
                "type": row.get("어린이집유형", "").strip(),
                "address": row.get("도로명주소", "").strip(),
                "phone": row.get("전화번호", "").strip() or None,
                "capacity": safe_int(row.get("정원수")),
                "staff": safe_int(row.get("보육교직원수")),
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "vehicle": row.get("통학차량운영", "").strip() or None,
            })

    results = [r for r in results if r["name"]]
    save_json(f"{OUTPUT}/daycares.json", results)
    print(f"[3] daycares.json: {len(results)}건")


load_daycares()


# ── 4. 도시철도 편의시설 ───────────────────────────────────────────────────────

def load_metro():
    results = []
    with open(f"{DOWNLOADS}/부산도시철도 역사 편의시설현황(2024년).csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "line": row.get("구분", "").strip(),
                "station": row.get("역명", "").strip(),
                "meeting_place": safe_int(row.get("만남의장소")),
                "locker": safe_int(row.get("물품보관함")),
                "photo_booth": safe_int(row.get("자동사진기")),
                "kiosk": safe_int(row.get("무인민원발급기")),
                "nursing_room": safe_int(row.get("유아수유실")),
                "wheelchair_lift": safe_int(row.get("휠체어리프트")),
                "elevator_internal": safe_int(row.get("엘리베이터(내부)")),
                "elevator_external": safe_int(row.get("엘리베이터(외부)")),
                "escalator": safe_int(row.get("에스컬레이터")),
                "guide_path": safe_int(row.get("시각장애인 유도로")),
                "external_ramp": safe_int(row.get("외부경사로")),
            })
    results = [r for r in results if r["station"]]
    save_json(f"{OUTPUT}/metro_accessibility.json", results)
    print(f"[4] metro_accessibility.json: {len(results)}건")


load_metro()


# ── 5. 보행자우선도로 통합 ─────────────────────────────────────────────────────

def load_pedestrian_roads():
    ped_files = [
        "부산광역시_동구_보행자우선도로_20260320.csv",
        "부산광역시_부산진구_보행자우선도로_20260306.csv",
        "부산광역시_사하구_보행자우선도로_20260113.csv",
        "부산광역시_수영구_보행자우선도로_20250813.csv",
        "부산광역시_연제구_보행자우선도로_20260113.csv",
        "부산광역시_해운대구_보행자우선도로_20260305.csv",
    ]
    results = []
    for fname in ped_files:
        with open(f"{DOWNLOADS}/{fname}", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                results.append({
                    "name": row.get("보행자우선도로명", "").strip(),
                    "district": row.get("시군구명", "").strip(),
                    "start_lat": safe_float(row.get("보행자우선도로시작점위도")),
                    "start_lng": safe_float(row.get("보행자우선도로시작점경도")),
                    "end_lat": safe_float(row.get("보행자우선도로종료점위도")),
                    "end_lng": safe_float(row.get("보행자우선도로종료점경도")),
                    "designated_date": row.get("보행자우선도로지정일자", "").strip() or None,
                    "length_m": safe_int(row.get("연장거리")),
                    "width_m": safe_float(row.get("도로폭")),
                    "speed_limit": safe_int(row.get("자동차운행속도제한속도")),
                    "school_zone": row.get("보호구역지정여부", "").strip() or None,
                    "purpose": row.get("보행자우선도로지정목적", "").strip() or None,
                })
    results = [r for r in results if r["name"]]
    save_json(f"{OUTPUT}/pedestrian_roads.json", results)
    print(f"[5] pedestrian_roads.json: {len(results)}건")


load_pedestrian_roads()


# ── 6. 아동급식카드 가맹점 ──────────────────────────────────────────────────────

def load_meal_card_stores():
    results = []
    with open(f"{DOWNLOADS}/부산_아동급식카드_가맹점 v2(수정).csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("가맹점명칭", "").strip(),
                "business_no": row.get("사업자번호", "").strip() or None,
                "address": row.get("도로명주소", "").strip(),
                "phone": row.get("전화번호", "").strip() or None,
                "category": row.get("업종", "").strip() or None,
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
                "base_date": row.get("가맹점기준일자", "").strip() or None,
            })
    results = [r for r in results if r["name"]]
    save_json(f"{OUTPUT}/meal_card_stores.json", results)
    print(f"[6] meal_card_stores.json: {len(results)}건")


load_meal_card_stores()


# ── 7. 아토피천식 안심학교 ─────────────────────────────────────────────────────

def load_atopy_safe_schools():
    results = []
    with open(f"{DOWNLOADS}/부산광역시 아토피천식 안심학교 현황(2025)공공데이터.csv", encoding="cp949") as f:
        for row in csv.DictReader(f):
            results.append({
                "name": row.get("안심학교명", "").strip(),
                "health_center": row.get("보건소명", "").strip() or None,
                "address": row.get("도로명주소", "").strip(),
                "lat": safe_float(row.get("위도")),
                "lng": safe_float(row.get("경도")),
            })
    results = [r for r in results if r["name"]]
    save_json(f"{OUTPUT}/atopy_safe_schools.json", results)
    print(f"[7] atopy_safe_schools.json: {len(results)}건")


load_atopy_safe_schools()

print("\n전처리 완료.")
