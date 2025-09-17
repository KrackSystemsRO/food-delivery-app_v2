import { ChevronRight, CopyMinus, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "./ui";

const STORAGE_KEY = "sidebar-submenu-state";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface NavMainProps {
  titleGroup: string;
  items: NavItem[];
}

export function NavMain({ titleGroup, items }: NavMainProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => {
      const isOpen = prev.includes(title);
      const next = isOpen ? prev.filter((t) => t !== title) : [...prev, title];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleCollapseAll = () => {
    setExpandedItems([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="w-full flex justify-between items-center">
        <span>{titleGroup}</span>
        <Button
          className="w-6 h-6 flex items-center justify-center p-0 m-0 bg-[var(--sidebar-background)] border border-gray-300 rounded-sm hover:bg-gray-100 transition"
          onClick={toggleCollapseAll}
          title="Collapse All"
        >
          <CopyMinus
            className="w-5 h-5"
            style={{ color: "var(--sidebar-foreground)" }}
          />
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = expandedItems.includes(item.title);

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => toggleSubmenu?.(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    style={{ color: "var(--sidebar-foreground)" }}
                  >
                    {item.items && (
                      <ChevronRight className=" transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                    {item.icon && <item.icon className="" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
