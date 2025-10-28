import { create } from "zustand";
import {
  getAllMenus,
  menuCreate,
  updateMenu,
  deleteMenu,
  moveMenu,
  reorderMenu,
} from "@/lib/api/MenuApi";

export interface Menu {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  depth: number;
  children?: Menu[];
}

export interface MenuCreateRequest {
  name: string;
  parentId?: string | null;
  order?: number;
  depth?: number;
}

export interface MenuUpdateRequest {
  name?: string;
  parentId?: string | null;
  order?: number;
  depth?: number;
}

interface MenuState {
  menus: Menu[];
  loading: boolean;
  error: string | null;
  expandedIds: Set<string>;

  fetchMenus: () => Promise<void>;
  addMenu: (menuData: MenuCreateRequest) => Promise<void>;
  editMenu: (id: string, update: MenuUpdateRequest) => Promise<void>;
  removeMenu: (id: string) => Promise<void>;
  moveMenuItem: (id: string, newParentId: string | null) => Promise<void>;
  reorderMenuItem: (id: string, order: number) => Promise<void>;

  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  resetError: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  loading: false,
  error: null,
  expandedIds: new Set(),

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const menus = await getAllMenus();
      set({ menus, loading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to fetch menus", loading: false });
    }
  },

  addMenu: async (menuData) => {
    set({ error: null });
    try {
      await menuCreate({
        name: menuData.name,
        parentId: menuData.parentId ?? null,
        order: menuData.order ?? 0,
      });
      await get().fetchMenus();
    } catch (e: any) {
      set({ error: e?.message || "Failed to create menu" });
    }
  },

  editMenu: async (id, update) => {
    set({ error: null });
    try {
      const payload: any = {};
      if (update.name !== undefined) payload.name = update.name;
      if (update.parentId !== undefined) payload.parentId = update.parentId;
      if (update.order !== undefined) payload.order = update.order;

      await updateMenu(id, payload);
      await get().fetchMenus();
    } catch (e: any) {
      set({ error: e?.message || "Failed to update menu" });
    }
  },

  removeMenu: async (id) => {
    set({ error: null });
    try {
      await deleteMenu(id);
      await get().fetchMenus();
    } catch (e: any) {
      set({ error: e?.message || "Failed to delete menu" });
    }
  },

  moveMenuItem: async (id, newParentId) => {
    set({ error: null });
    try {
      await moveMenu(id, newParentId);
      await get().fetchMenus();
    } catch (e: any) {
      set({ error: e?.message || "Failed to move menu" });
    }
  },

  reorderMenuItem: async (id, order) => {
    set({ error: null });
    try {
      await reorderMenu(id, order);
      await get().fetchMenus();
    } catch (e: any) {
      set({ error: e?.message || "Failed to reorder menu" });
    }
  },

  toggleExpand: (id) => {
    const expandedIds = new Set(get().expandedIds);
    expandedIds.has(id) ? expandedIds.delete(id) : expandedIds.add(id);
    set({ expandedIds });
  },

  expandAll: () => {
    const allIds = new Set<string>();
    const collectIds = (menus: Menu[]) => {
      menus.forEach((m) => {
        allIds.add(m.id);
        if (m.children) collectIds(m.children);
      });
    };
    collectIds(get().menus);
    set({ expandedIds: allIds });
  },

  collapseAll: () => set({ expandedIds: new Set() }),

  resetError: () => set({ error: null }),
}));
