import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { opsiTab } from '../../../components/ui/tabBar';

export default function TabDonatur() {
  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen
        name="etalase"
        options={{
          title: 'Etalase',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color }) => <Feather name="clock" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
