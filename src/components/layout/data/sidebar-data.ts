import {
  LayoutDashboard,
  Settings,
  UserCog,
  Palette,
  Bell,
  Wrench,
  Command,
  GalleryVerticalEnd,
  Users,
  ListTodo,
  BadgeCheck,
} from 'lucide-react'
import type { SidebarData } from '../types'

type SidebarUser = {
  name?: string | null
  email: string
  image?: string | null
}

const navigationData = {
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
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Brands',
          url: '/brands',
          icon: BadgeCheck,
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
} satisfies Omit<SidebarData, 'user'>

export const sidebarData: SidebarData = {
  user: {
    name: 'User',
    email: '',
    avatar: null,
  },
  ...navigationData,
}

export function createSidebarData(user: SidebarUser): SidebarData {
  return {
    user: {
      name: user.name || user.email,
      email: user.email,
      avatar: user.image,
    },
    ...navigationData,
  }
}
