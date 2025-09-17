import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Company",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Company",
          url: "/companies",
        },
        {
          title: "Department",
          url: "/departments",
        },
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
    {
      title: "Stores",
      url: "",
      icon: Bot,
      items: [
        {
          title: "Stores",
          url: "/stores",
        },
        {
          title: "Categories",
          url: "/categories",
        },
        {
          title: "Ingredients",
          url: "/ingredients",
        },
        {
          title: "Allergens",
          url: "/allergens",
        },
        {
          title: "Products",
          url: "/products",
        },
        {
          title: "Orders",
          url: "/orders",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {open && (
          <>
            <NavMain titleGroup="Resources" items={data.navMain} />
          </>
        )}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
