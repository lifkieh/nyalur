import { Redirect } from 'expo-router';

// A1 Onboarding menyusul. Sementara langsung ke etalase donatur.
export default function Index() {
  return <Redirect href="/etalase" />;
}
