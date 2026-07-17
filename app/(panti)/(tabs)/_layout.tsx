import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { opsiTab } from '../../../components/ui/tabBar';
import { useBahasa } from '../../../lib/i18n';

export default function TabPanti() {
  const { t } = useBahasa();

  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dash.judul'),
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="katalog"
        options={{
          title: t('tab.ajukan'),
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="penerimaan"
        options={{
          title: t('terima.judul'),
          tabBarIcon: ({ color }) => <Feather name="inbox" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil-panti"
        options={{
          title: t('profil.judul'),
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
