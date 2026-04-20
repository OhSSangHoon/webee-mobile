import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInterestKeywords, addInterestKeyword } from "../api";

// ── 관심 키워드 목록
export function useInterestKeywords() {
  return useQuery({
    queryKey: ["interest-keywords"],
    queryFn: getInterestKeywords,
    staleTime: 1000 * 60 * 5,
  });
}

// ── 관심 키워드 추가
export function useAddInterestKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addInterestKeyword,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interest-keywords"] });
    },
  });
}
