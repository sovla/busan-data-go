export const dynamic = "force-dynamic";

type AirStatus = "good" | "normal" | "bad" | "verybad";

function getStatusFromPm10(pm10: number): AirStatus {
  if (pm10 <= 30) return "good";
  if (pm10 <= 80) return "normal";
  if (pm10 <= 150) return "bad";
  return "verybad";
}

function getMockData() {
  const hour = new Date().getHours();
  // 새벽(0-5): 좋음, 출퇴근(7-9, 17-19): 나쁨, 낮: 보통, 저녁: 보통
  let pm10: number;
  let pm25: number;
  let o3: number;

  if (hour >= 0 && hour < 6) {
    pm10 = 15 + Math.floor(Math.random() * 15); // 15-29 good
    pm25 = 8 + Math.floor(Math.random() * 7);
    o3 = 0.01 + Math.random() * 0.02;
  } else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    pm10 = 81 + Math.floor(Math.random() * 40); // 81-120 bad
    pm25 = 35 + Math.floor(Math.random() * 20);
    o3 = 0.05 + Math.random() * 0.03;
  } else if (hour >= 10 && hour <= 16) {
    pm10 = 31 + Math.floor(Math.random() * 50); // 31-80 normal
    pm25 = 15 + Math.floor(Math.random() * 20);
    o3 = 0.03 + Math.random() * 0.04;
  } else {
    pm10 = 25 + Math.floor(Math.random() * 30); // 25-54 normal/good
    pm25 = 12 + Math.floor(Math.random() * 15);
    o3 = 0.02 + Math.random() * 0.03;
  }

  return { pm10, pm25, o3: parseFloat(o3.toFixed(3)) };
}

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (apiKey) {
    try {
      const url =
        `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` +
        `?serviceKey=${apiKey}&returnType=json&numOfRows=1&pageNo=1&sidoName=%EB%B6%80%EC%82%B0&ver=1.0`;

      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const json = await res.json();
        const item = json?.response?.body?.items?.[0];
        if (item) {
          const pm10 = Number(item.pm10Value) || 0;
          const pm25 = Number(item.pm25Value) || 0;
          const o3 = Number(item.o3Value) || 0;
          return Response.json({
            pm10,
            pm25,
            o3,
            status: getStatusFromPm10(pm10),
            timestamp: new Date().toISOString(),
            station: item.stationName || "부산",
            source: "live",
          });
        }
      }
    } catch {
      // fall through to mock
    }
  }

  // API key 없거나 오류 시 모의값
  const { pm10, pm25, o3 } = getMockData();
  return Response.json({
    pm10,
    pm25,
    o3,
    status: getStatusFromPm10(pm10),
    timestamp: new Date().toISOString(),
    station: "부산",
    source: "mock",
  });
}
