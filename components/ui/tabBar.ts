import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { warna, font } from '../../constants/theme';

/** Bottom nav dipakai kedua persona — bentuk sama, isinya beda. */
export const opsiTab: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: warna.biru,
  tabBarInactiveTintColor: warna.muted,
  tabBarStyle: {
    height: 78,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: warna.putih,
    borderTopWidth: 1,
    borderTopColor: warna.border,
  },
  tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 },
  tabBarItemStyle: { gap: 3 },
};
