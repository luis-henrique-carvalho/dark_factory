import {
  LayoutDashboard,
  Settings,
  UserCog,
  Palette,
  Bell,
  Wrench,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import type {SidebarData} from '../types';

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@darkfactory.ai',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  },
  teams: [
    {
      name: 'Dark Factory',
      logo: Command,
      plan: 'Production',
    },
    {
      name: 'Vids Space',
      logo: GalleryVerticalEnd,
      plan: 'Workspace',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
          ],
        },
      ],
    },
  ],
}
