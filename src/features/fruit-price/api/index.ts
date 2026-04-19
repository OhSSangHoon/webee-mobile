/**
 * 도매시장 시세 + 관심시장 API 레이어
 *
 * [구성]
 * - apiFetch()         : 공공데이터포털 도매시장 시세 조회 (기존)
 * - getInterestMarkets : GET  /api/v1/interest-markets       → 저장된 바로가기 목록
 * - addInterestMarket  : POST /api/v1/interest-markets       → 바로가기 저장
 * - deleteInterestMarket: DELETE /api/v1/interest-markets/:id → 바로가기 삭제
 *
 * [타입]
 * InterestMarket.cropMajorCode = 화면의 largeCode(gds_lclsf_cd)와 동일한 값
 */



import axios from "axios";
import type { Row } from "@/types";
import qs from "qs";
import { api } from "@/lib/api";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;
export const SERVICE_KEY = process.env.EXPO_PUBLIC_SERVICE_KEY!;

// ── 공공 API ─────────────────────────────────────────────────────────────────

export function parseRows(data: any): { rows: Row[]; totalCount: number } {
  const resultCode = data?.response?.header?.resultCode;
  if (resultCode !== "0")
    throw new Error(data?.response?.header?.resultMsg ?? "API 오류");
  const raw = data?.response?.body?.items?.item;
  return {
    rows: !raw ? [] : Array.isArray(raw) ? raw : [raw],
    totalCount: data?.response?.body?.totalCount ?? 0,
  };
}

export async function apiFetch(params: Record<string, string>) {
  try {
    const { data, config } = await axios.get(BASE_URL, {
      timeout: 15_000,
      params: {
        serviceKey: SERVICE_KEY,
        returnType: "json",
        numOfRows: "300",
        pageNo: "1",
        ...params,
      },
      paramsSerializer: (p) => {
        const { serviceKey, ...rest } = p;
        return `serviceKey=${encodeURIComponent(serviceKey)}&${qs.stringify(rest, { encode: false })}`;
      },
    });
    
 console.log(
      "실제 URL:",
      config.url +
        "?" +
        qs.stringify(config.params, { encode: true, encodeValuesOnly: true }),
    );

    return parseRows(data);
  } catch (e: any) {
    const msg = e?.response?.data?.resultMsg ?? e?.message ?? "네트워크 오류";
    throw new Error(msg);
  }
}/*https://apis.data.go.kr/B552845/katRealTime2/trades2?serviceKey=xNPW3bBwt8j3dOB9niigELSJ6hRgpxaeIun8XdyUN93%2FDJTyc%2BvpMpAcoCjcesOF96l0wsLx65PrA9fHgZYzMQ%3D%3D&pageNo=1&numOfRows=10&returnType=json&cond[whsl_mrkt_cd::EQ]=110001&cond[trd_clcln_ymd::EQ]=2026-03-21 */


// ── 관심 시장 API ─────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface InterestMarket {
  interestMarketId: number;
  marketCode: string;
  cropMajorCode: string;   // = gds_lclsf_cd
  cropMidName: string;     // 중분류명
  cropMinorName: string;   // 소분류명
}

// GET /api/v1/interest-markets
export async function getInterestMarkets(): Promise<InterestMarket[]> {
  const res = await api.get<ApiResponse<InterestMarket[]>>(
    "/api/v1/interest-markets"
  );
  return res.data.data;
}

// POST /api/v1/interest-markets
export async function addInterestMarket(
  body: Omit<InterestMarket, "interestMarketId">
): Promise<{ interestMarketId: number }> {
  const res = await api.post<ApiResponse<{ interestMarketId: number }>>(
    "/api/v1/interest-markets",
    body
  );
  return res.data.data;
}

// DELETE /api/v1/interest-markets/{interestMarketId}
export async function deleteInterestMarket(id: number): Promise<void> {
  await api.delete(`/api/v1/interest-markets/${id}`);
}
