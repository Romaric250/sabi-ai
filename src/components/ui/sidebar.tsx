"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { MenuIcon, PanelLeftIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = React.useCallback(() => {
    return setIsOpen((open) => !open);
  }, [setIsOpen]);

  const contextValue: SidebarContextType = {
    isOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, isOpen } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className={isOpen ? "rotate-0" : "rotate-180"} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarContent({ className, ...props }: HTMLMotionProps<"div">) {
  const { isOpen } = useSidebar();
  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? "250px" : "0px",
        opacity: isOpen ? 1 : 0,
        transition: { duration: 0.2 },
      }}
      className={cn("h-full overflow-hidden bg-white text-black", className)}
      {...props}
    />
  );
}

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export { SidebarProvider, SidebarTrigger, SidebarContent, useSidebar };
