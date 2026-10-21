import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { AuthProvider } from "../../context/AuthContext";

const renderSidebar = (props = {}) => {
  const defaultProps = {
    sidebarOpen: true,
    setSidebarOpen: jest.fn(),
    isMobile: false,
    activeTab: "chat",
    activeApp: null,
    handleTabClick: jest.fn(),
    onOpenApp: jest.fn(),
    handleNewChat: jest.fn(),
    searchText: "",
    setSearchText: jest.fn(),
    user: { name: "Pradeep Parihar", email: "pradeep@vitya.ai" },
    profilePicSrc: "https://vitya.ai/avatar.png",
    defaultAvatar: "https://vitya.ai/default-avatar.png",
  };

  return render(
    <AuthProvider>
      <Sidebar {...defaultProps} {...props} />
    </AuthProvider>
  );
};

describe("Sidebar Component UI/UX Optimization", () => {
  test("renders essential navigation items: Chat, Presentation Studio, All Apps, History", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: /^Chat$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Presentation Studio$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^All Apps$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^History$/i })).toBeInTheDocument();
  });

  test("does not render removed secondary shortcuts", () => {
    renderSidebar();

    expect(screen.queryByText("Dr.Dora")).not.toBeInTheDocument();
    expect(screen.queryByText("Vidya Advisor")).not.toBeInTheDocument();
    expect(screen.queryByText("Receipt Scanner")).not.toBeInTheDocument();
    expect(screen.queryByText("Neural Routines")).not.toBeInTheDocument();
    expect(screen.queryByText("Research Lab")).not.toBeInTheDocument();
    expect(screen.queryByText("Voice Notes")).not.toBeInTheDocument();
  });

  test("triggers handleNewChat when clicking New Chat button", () => {
    const handleNewChat = jest.fn();
    renderSidebar({ handleNewChat });

    const newChatBtn = screen.getByRole("button", { name: /New Chat/i });
    fireEvent.click(newChatBtn);

    expect(handleNewChat).toHaveBeenCalledTimes(1);
  });

  test("triggers handleTabClick when clicking navigation items", () => {
    const handleTabClick = jest.fn();
    renderSidebar({ handleTabClick });

    const appsBtn = screen.getByRole("button", { name: /^All Apps$/i });
    fireEvent.click(appsBtn);

    expect(handleTabClick).toHaveBeenCalledWith("apps");
  });

  test("toggles profile dropdown menu and exposes Profile, Settings, Help & Support, Sign Out", () => {
    const handleTabClick = jest.fn();
    renderSidebar({ handleTabClick });

    const profileCard = screen.getByLabelText("User profile and settings menu");
    fireEvent.click(profileCard);

    // Profile menu items should now be visible
    expect(screen.getByRole("menuitem", { name: /Profile & Account/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Help & Support/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Sign Out/i })).toBeInTheDocument();

    // Clicking Settings triggers handleTabClick("settings")
    const settingsItem = screen.getByRole("menuitem", { name: /Settings/i });
    fireEvent.click(settingsItem);

    expect(handleTabClick).toHaveBeenCalledWith("settings");
  });

  test("toggles desktop collapse mode when clicking collapse button", () => {
    renderSidebar();

    const collapseBtn = screen.getByLabelText("Collapse sidebar");
    fireEvent.click(collapseBtn);

    const sidebar = screen.getByLabelText("Main sidebar");
    expect(sidebar).toHaveClass("collapsed");
  });
});
