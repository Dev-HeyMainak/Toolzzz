
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, // This was missing
} from '@/components/ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from '@/components/Logo';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { isOpen: isSidebarPanelOpen, isMobile: sidebarIsMobile } = useSidebar(); // Use a more descriptive name

  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Determine if the sidebar is effectively in icon-only mode
  // This depends on the main panel being collapsed *and* not being on a mobile view where it's always full width when open.
  const isEffectivelyIconOnly = !isSidebarPanelOpen && !sidebarIsMobile;


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 items-center hidden md:flex">
        <Logo hideText={true} />
      </SidebarHeader>
      <SidebarContent asChild>
        {isClient ? (
          <ScrollArea className="flex-1">
            <Accordion type="multiple" className="w-full py-4 px-2">
              {TOOL_CATEGORIES.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="border-none mb-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:no-underline",
                           isEffectivelyIconOnly && "h-8 w-8 p-2 justify-center [&>.lucide-chevron-down]:hidden"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4 shrink-0" />
                          <span className={cn(isEffectivelyIconOnly && "hidden")}>{category.name}</span>
                        </div>
                      </AccordionTrigger>
                    </TooltipTrigger>
                    {isEffectivelyIconOnly && (
                      <TooltipContent side="right" align="center">
                        <p>{category.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>

                  <AccordionContent
                    className={cn(
                      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                      isEffectivelyIconOnly && "hidden"
                    )}
                  >
                    <div className="pt-1 pb-1">
                      <SidebarMenu className="py-0 pl-4 pr-0">
                        {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool) => (
                          <SidebarMenuItem key={tool.id}>
                            <Link href={tool.href} legacyBehavior passHref>
                              <SidebarMenuButton
                                asChild
                                isActive={pathname === tool.href}
                                tooltip={{ children: tool.name, side: 'right', align: 'center' }}
                                size="sm"
                                className="h-8"
                              >
                                <a>
                                  <tool.icon className="h-4 w-4"/>
                                  <span>{tool.name}</span>
                                </a>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="flex-1 overflow-auto p-2">
            {/* Skeleton or placeholder for SSR can go here */}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t mt-auto">
         <p className="text-xs text-muted-foreground text-center">
            © {currentYear} Toolzzz
          </p>
      </SidebarFooter>
    </Sidebar>
  );
}
