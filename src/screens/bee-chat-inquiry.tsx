import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Modal,
  Alert,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// ── 색상 팔레트 ──────────────────────────────────────
const C = {
  primary: "#3182F6",
  bg: "#F4F5F7",
  white: "#FFFFFF",
  Text: "#191F28",
  sec: "#8B95A1",
  ter: "#B0B8C1",
  border: "#E5E8EB",
};

// ── Props ─────────────────────────────────────────────
interface InquiryModalProps {
  visible: boolean;
  onClose: () => void;
}

// ── 컴포넌트 ──────────────────────────────────────────
export default function InquiryModal({ visible, onClose }: InquiryModalProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [work, setWork] = useState("");
  const [interest, setInterest] = useState("");
  const [extra, seTextra] = useState("");
  const [consent, setConsent] = useState(false);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && consent;

  const handleClose = () => {
    setName("");
    setEmail("");
    setWork("");
    setInterest("");
    seTextra("");
    setConsent(false);
    onClose();
  };

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      "접수 완료",
      "문의가 접수되었습니다.\n확인 후 빠르게 답변드리겠습니다.",
    );
    handleClose();
  }, [canSubmit]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
        {/* 배경 탭 → 닫기 */}
        <Pressable className="flex-1" onPress={handleClose} />

        <View
          className="bg-white"
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "90%",
          }}
        >
          {/* 핸들 + 닫기 버튼 */}
          <View
            className="flex-row items-center justify-between"
            style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 4 }}
          >
            {/* 핸들 (중앙 고정) */}
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#DDE0E4",
                position: "absolute",
                left: "50%",
                top: 10,
                transform: [{ translateX: -18 }],
              }}
            />
            {/* 왼쪽 spacer */}
            <View style={{ width: 32 }} />
            {/* 닫기 */}
            <Pressable
              onPress={handleClose}
              className="items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: C.bg,
              }}
              data-testid="button-close-inquiry"
            >
              <Feather name="x" size={18} color={C.sec} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 24),
            }}
          >
            {/* 타이틀 */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: C.Text,
                lineHeight: 30,
                marginBottom: 6,
              }}
            >
              Webee가 궁금하신가요?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: C.sec,
                lineHeight: 21,
                marginBottom: 28,
              }}
            >
              도입 문의나 궁금한 점을 남겨주시면,{"\n"}확인 후 빠르게
              답변드릴게요.
            </Text>

            {/* 이름 */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.sec,
                marginBottom: 8,
                letterSpacing: 0.2,
              }}
            >
              이름
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="홍길동"
              placeholderTextColor="#CDD1D6"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.Text,
                marginBottom: 18,
                backgroundColor: C.white,
              }}
              data-testid="input-inquiry-name"
            />

            {/* 이메일 */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.sec,
                marginBottom: 8,
                letterSpacing: 0.2,
              }}
            >
              이메일
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#CDD1D6"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.Text,
                marginBottom: 18,
                backgroundColor: C.white,
              }}
              data-testid="input-inquiry-email"
            />

            {/* 하고 계신 일 */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.sec,
                marginBottom: 8,
                letterSpacing: 0.2,
              }}
            >
              하고 계신 일은 무엇인가요?
            </Text>
            <TextInput
              value={work}
              onChangeText={setWork}
              placeholder="예: 딸기 농장 운영"
              placeholderTextColor="#CDD1D6"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.Text,
                marginBottom: 18,
                backgroundColor: C.white,
              }}
              data-testid="input-inquiry-work"
            />

            {/* 관심 활용 방안 */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.sec,
                marginBottom: 8,
                letterSpacing: 0.2,
              }}
            >
              관심 있는 활용 방안이 있다면 적어주세요
            </Text>
            <TextInput
              value={interest}
              onChangeText={setInterest}
              placeholder="예: 스마트벌통 모니터링, 수정벌 추천"
              placeholderTextColor="#CDD1D6"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.Text,
                marginBottom: 18,
                backgroundColor: C.white,
              }}
              data-testid="input-inquiry-interest"
            />

            {/* 추가 내용 */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.sec,
                marginBottom: 8,
                letterSpacing: 0.2,
              }}
            >
              추가로 남기고 싶은 내용
            </Text>
            <TextInput
              value={extra}
              onChangeText={seTextra}
              placeholder="도입 배경, 궁금한 점 등을 자유롭게 남겨주세요"
              placeholderTextColor="#CDD1D6"
              multiline
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.Text,
                minHeight: 100,
                marginBottom: 24,
                backgroundColor: C.white,
              }}
              data-testid="input-inquiry-extra"
            />

            {/* 동의 체크박스 */}
            <Pressable
              onPress={() => setConsent((v) => !v)}
              className="flex-row items-start"
              style={{ gap: 10, marginBottom: 24 }}
              data-testid="button-inquiry-consent"
            >
              <View
                className="items-center justify-center"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: consent ? 0 : 1.5,
                  borderColor: "#CDD1D6",
                  backgroundColor: consent ? C.Text : C.white,
                  marginTop: 1,
                }}
              >
                {consent && <Feather name="check" size={14} color={C.white} />}
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 13, color: C.Text, lineHeight: 19 }}>
                  (필수) 문의 답변 및 관련 안내 수신에 동의합니다.
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: C.ter,
                    lineHeight: 17,
                    marginTop: 2,
                  }}
                >
                  동의해주셔야 문의 접수가 가능합니다.
                </Text>
              </View>
            </Pressable>

            {/* 제출 버튼 */}
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              className="items-center"
              style={{
                backgroundColor: canSubmit ? C.Text : "#E5E8EB",
                borderRadius: 12,
                paddingVertical: 16,
              }}
              data-testid="button-submit-inquiry"
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: canSubmit ? C.white : C.ter,
                }}
              >
                문의 보내기
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
