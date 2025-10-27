"use client";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [openSystemMenu, setOpenSystemMenu] = useState(true);
  const [activeMenu, setActiveMenu] = useState("menus");

  const handleMainMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "systems") {
      setOpenSystemMenu(!openSystemMenu);
    }
  };

  const handleSubMenuClick = (submenu: string) => {
    setActiveMenu(submenu);
  };

  return (
    <div>
      <div className="bg-blue-primary flex h-full w-60 flex-col rounded-3xl px-4 py-[30px]">
        <div className="mx-2 mb-10 flex items-center justify-between">
          <Image src="/logo.svg" alt="logo" width={70} height={29.67} />
          <div className="cursor-pointer">
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
          </div>
        </div>

        <div
          className={`rounded-2xl text-[14px] font-bold text-white ${
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
            />
            <div>Systems</div>
          </div>

          {openSystemMenu && (
            <div>
              <div
                onClick={() => handleSubMenuClick("system-code")}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 ${
                  activeMenu === "system-code"
                    ? "text-blue-gray-800 bg-white"
                    : "text-white"
                }`}
              >
                <img
                  src={
                    activeMenu === "system-code"
                      ? "/squares-blue.svg"
                      : "/squares.svg"
                  }
                />
                <div>System Code</div>
              </div>

              <div
                onClick={() => handleSubMenuClick("properties")}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 ${
                  activeMenu === "properties"
                    ? "text-blue-gray-800 bg-white"
                    : "text-white"
                }`}
              >
                <img
                  src={
                    activeMenu === "properties"
                      ? "/squares-blue.svg"
                      : "/squares.svg"
                  }
                />
                <div>Properties</div>
              </div>

              <div
                onClick={() => handleSubMenuClick("menus")}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 ${
                  activeMenu === "menus"
                    ? "text-blue-gray-800 bg-white"
                    : "text-white"
                }`}
              >
                <img
                  src={
                    activeMenu === "menus"
                      ? "/squares-blue.svg"
                      : "/squares.svg"
                  }
                />
                <div>Menus</div>
              </div>

              <div
                onClick={() => handleSubMenuClick("api-list")}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 ${
                  activeMenu === "api-list"
                    ? "text-blue-gray-800 bg-white"
                    : "text-white"
                }`}
              >
                <img
                  src={
                    activeMenu === "api-list"
                      ? "/squares-blue.svg"
                      : "/squares.svg"
                  }
                />
                <div>API List</div>
              </div>
            </div>
          )}
        </div>

        <div
          onClick={() => handleMainMenuClick("user-group")}
          className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 text-[14px] font-bold text-white ${
            activeMenu === "user-group" ? "bg-blue-secondary" : ""
          }`}
        >
          <img
            src={
              activeMenu === "user-group"
                ? "/folder.svg"
                : "/folder-secondary.svg"
            }
          />
          <div>Users & Group</div>
        </div>

        <div
          onClick={() => handleMainMenuClick("competition")}
          className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 text-[14px] font-bold text-white ${
            activeMenu === "competition" ? "bg-blue-secondary" : ""
          }`}
        >
          <img
            src={
              activeMenu === "competition"
                ? "/folder.svg"
                : "/folder-secondary.svg"
            }
          />
          <div>Competition</div>
        </div>
      </div>
    </div>
  );
}
