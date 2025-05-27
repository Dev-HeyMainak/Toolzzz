
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react"; // Retained for potential internal use, though SidebarTrigger was removed
import { cn } from "@/lib/utils";
// Button import removed as SidebarTrigger was removed.
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// SidebarContext definition
type SidebarContext = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebarPanel: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// SidebarProvider
export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
  }
>(({ defaultOpen = false, className, style, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggleSidebarPanel = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []); // setIsOpen is stable, so [] is correct.

  // This contextValue is re-created if isOpen changes, or if toggleSidebarPanel changes (it doesn't).
  // This is fine as consumers will re-render if isOpen changes.
  const contextValue: SidebarContext = {
    isOpen,
    setIsOpen,
    toggleSidebarPanel,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
          style={style}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

// Sidebar (Sheet wrapper)
export const Sidebar = React.forwardRef<
  React.ElementRef<typeof Sheet>, // Ref is for the Sheet component
  Omit<React.ComponentProps<typeof Sheet>, "open" | "onOpenChange"> & {
    side?: "left" | "right" | "top" | "bottom";
  }
>(({ side = "left", className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <Sheet ref={ref} open={isOpen} onOpenChange={setIsOpen} {...props}> {/* Pass ref and props to Sheet */}
      <SheetContent
        side={side}
        // The ref for SheetContent is internal to Sheet; the forwarded ref is for the Sheet itself.
        className={cn(
          "w-[var(--sidebar-width-mobile)] sm:w-[var(--sidebar-width)] p-0 flex flex-col",
          "bg-sidebar text-sidebar-foreground border-sidebar-border",
          className
        )}
        style={{
          "--sidebar-width": "280px", // Example width
          "--sidebar-width-mobile": "260px",
        } as React.CSSProperties}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
});
Sidebar.displayName = "Sidebar";


// --- Other Sidebar components (Header, Content, Footer, Menu etc.) ---
// These are for structuring content *inside* the sidebar panel (SheetContent)

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-4 border-b border-sidebar-border", className)} // Added padding and border
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col", // Removed gap-2 from here, ScrollArea will handle scrolling
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";


export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-4 border-t border-sidebar-border mt-auto", className)} // Added padding and border
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-sidebar shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} // Reduced gap for tighter menu
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";


export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement, // Changed from HTMLAnchorElement because asChild might not always be true
  React.ComponentProps<typeof Button> & { // Use ButtonProps
    isActive?: boolean;
    tooltip?: string | Omit<React.ComponentProps<typeof TooltipContent>, "children">;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default", // Use the variant from cva
      size = "default",    // Use the size from cva
      tooltip,
      className,
      children, // Ensure children is passed
      ...props
    },
    ref
  ) => {
    const buttonContent = (
      <Button // Use the actual Button component
        ref={ref}
        asChild={asChild}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        variant="ghost" // Sidebar buttons usually look best as ghost or custom styled
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      >
        {asChild ? children : <>{children}</>}
      </Button>
    );

    if (!tooltip) {
      return buttonContent;
    }

    const tooltipProps: Omit<React.ComponentProps<typeof TooltipContent>, "children"> =
      typeof tooltip === "string" ? {} : tooltip;
    const tooltipChildren = typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip.children;


    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right" align="center" {...tooltipProps}>
          {tooltipChildren || (typeof tooltip === 'string' && <p>{tooltip}</p>)}
        </TooltipContent>
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

    