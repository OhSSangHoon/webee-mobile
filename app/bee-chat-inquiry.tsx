import { useRouter } from "expo-router";
import InquiryModal from "@/screens/bee-chat-inquiry";

export default function InquiryScreen() {
  const router = useRouter();
  return <InquiryModal visible onClose={() => router.back()} />;
}
