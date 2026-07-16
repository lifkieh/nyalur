import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { opsiTab } from '../../../components/ui/tabBar';

export default function TabPanti() {
  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="katalog"
        options={{
          title: 'Ajukan',
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="penerimaan"
        options={{
          title: 'Penerimaan',
          tabBarIcon: ({ color }) => <Feather name="inbox" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil-panti"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
