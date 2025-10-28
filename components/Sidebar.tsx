"use client";
import { useState } from "react";

export default function Sidebar() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSystemMenu, setOpenSystemMenu] = useState(true);
  const [activeMenu, setActiveMenu] = useState("menus");

  const handleMainMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "systems") setOpenSystemMenu(!openSystemMenu);
  };

  const handleSubMenuClick = (submenu: string) => setActiveMenu(submenu);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open sidebar"
        aria-expanded={openSidebar}
        onClick={() => setOpenSidebar(true)}
        className={`fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-lg p-2 text-white sm:hidden ${
          openSidebar ? "pointer-events-none opacity-0" : "bg-blue-primary"
        }`}
      >
        <svg
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12V10H13V12H0ZM16.6 11L11.6 6L16.6 1L18 2.4L14.4 6L18 9.6L16.6 11ZM0 7V5H10V7H0ZM0 2V0H13V2H0Z"
            fill="white"
          />
        </svg>
      </button>

      {openSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      <aside
        className={`bg-blue-primary fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col rounded-r-3xl p-4 transition-transform duration-300 sm:static sm:z-auto sm:w-60 sm:rounded-3xl sm:p-0 ${
          openSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="mx-2 mt-6 mb-6 flex items-center justify-between sm:mt-[30px] sm:mb-10 sm:px-4">
          <img src="/logo.svg" alt="logo" />
          <button
            type="button"
            onClick={() => setOpenSidebar(false)}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10 sm:hidden"
          >
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12V10H13V12H0ZM16.6 11L11.6 6L16.6 1L18 2.4L14.4 6L18 9.6L16.6 11ZM0 7V5H10V7H0ZM0 2V0H13V2H0Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div
          className={`mx-2 rounded-2xl text-[14px] font-bold text-white sm:mx-4 ${
            activeMenu === "systems" ||
            ["system-code", "properties", "menus", "api-list"].includes(
              activeMenu,
            )
              ? "bg-blue-secondary"
              : ""
          }`}
        >
          <div
            onClick={() => handleMainMenuClick("systems")}
            className="flex cursor-pointer items-center gap-4 p-3"
          >
            <img
              src={
                activeMenu === "systems" ||
                ["system-code", "properties", "menus", "api-list"].includes(
                  activeMenu,
                )
                  ? "/folder.svg"
                  : "/folder-secondary.svg"
              }
              alt=""
            />
            <div>Systems</div>
          </div>

          {openSystemMenu && (
            <div className="pb-2">
              {[
                { id: "system-code", label: "System Code" },
                { id: "properties", label: "Properties" },
                { id: "menus", label: "Menus" },
                { id: "api-list", label: "API List" },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSubMenuClick(item.id)}
                  className={`mx-1 flex cursor-pointer items-center gap-4 rounded-2xl p-3 ${
                    activeMenu === item.id
                      ? "text-blue-gray-800 bg-white"
                      : "text-white"
                  }`}
                >
                  <img
                    src={
                      activeMenu === item.id
                        ? "/squares-blue.svg"
                        : "/squares.svg"
                    }
                    alt=""
                  />
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          onClick={() => handleMainMenuClick("user-group")}
          className={`mx-2 mt-2 flex cursor-pointer items-center gap-4 rounded-2xl p-3 text-[14px] font-bold text-white sm:mx-4 ${
            activeMenu === "user-group" ? "bg-blue-secondary" : ""
          }`}
        >
          <img
            src={
              activeMenu === "user-group"
                ? "/folder.svg"
                : "/folder-secondary.svg"
            }
            alt=""
          />
          <div>Users & Group</div>
        </div>

        <div
          onClick={() => handleMainMenuClick("competition")}
          className={`mx-2 mt-2 flex cursor-pointer items-center gap-4 rounded-2xl p-3 text-[14px] font-bold text-white sm:mx-4 ${
            activeMenu === "competition" ? "bg-blue-secondary" : ""
          }`}
        >
          <img
            src={
              activeMenu === "competition"
                ? "/folder.svg"
                : "/folder-secondary.svg"
            }
            alt=""
          />
          <div>Competition</div>
        </div>
      </aside>
    </div>
  );
}
