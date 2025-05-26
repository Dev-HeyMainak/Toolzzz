"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { TOOLS, TOOL_CATEGORIES, ToolCategoryKey } from '@/config/tools';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 items-center hidden md:flex">
        <Logo />
      </SidebarHeader>
      <SidebarContent asChild>
        <ScrollArea className="flex-1">
          <SidebarMenu className="py-4 px-2">
            {TOOL_CATEGORIES.map((category) => (
              <SidebarGroup key={category.id}>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool) => (
                    <SidebarMenuItem key={tool.id}>
                      <Link href={tool.href} legacyBehavior passHref>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === tool.href}
                          tooltip={{ children: tool.name, side: 'right', align: 'center' }}
                        >
                          <a>
                            <tool.icon />
                            <span>{tool.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t mt-auto">
         <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Office Toolkit
          </p>
      </SidebarFooter>
    </Sidebar>
  );
}
