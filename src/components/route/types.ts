// types.ts
import type { ReactNode } from "react";

export interface SubItem {
  label: string;
  path?: string;
}

export interface NavigationItem {
  icon: ReactNode; // Using string for emojis/simple characters
  label: string;
  path?: string;
  subItems?: SubItem[]; // Optional array of sub-items
}

// Props for the SidebarItem component
export interface SidebarItemProps extends NavigationItem {}
