"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    return setIsOpen((open) => !open);
  }, [setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

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
      className={cn("size-10", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <div className="size-5 rounded-[4px] border-black border-4 flex items-center ">
        <motion.div
          animate={{ width: isOpen ? 10 : 4, height: 16 }}
          transition={{ duration: 0.2 }}
          className={cn("bg-black ml-px rounded-[2px]", isOpen && "ml-0")}
        />
      </div>
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
      className={cn(
        "h-full overflow-hidden bg-white text-black border-r",
        className
      )}
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

export { SidebarContent, SidebarProvider, SidebarTrigger, useSidebar };
