import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { opsiTab } from '../../../components/ui/tabBar';
import { useBahasa } from '../../../lib/i18n';

export default function TabDonatur() {
  const { t } = useBahasa();

  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen
        name="etalase"
        options={{
          title: t('beranda.judul'),
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: t('riwayat.judul'),
          tabBarIcon: ({ color }) => <Feather name="clock" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('profil.judul'),
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
