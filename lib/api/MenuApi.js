const API_BASE = process.env.NEXT_PUBLIC_DB_HOST;

export const menuCreate = async ({ name, parentId, order }) => {
  const response = await fetch(`${API_BASE}/menus`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name,
      parentId: parentId ?? null,
      order: order ?? 0,
    }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create menu");
  return result.data;
};

export const getAllMenus = async () => {
  try {
    const response = await fetch(`${API_BASE}/menus`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to fetch menus");
    return result.data;
  } catch (error) {
    console.error("Get all menus error:", error);
    throw error;
  }
};

export const getMenuById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/menus/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch menu");
    return result.data;
  } catch (error) {
    console.error("Get menu by id error:", error);
    throw error;
  }
};

export const updateMenu = async (id, payload) => {
  const body = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.parentId !== undefined) body.parentId = payload.parentId;
  if (payload.order !== undefined) body.order = payload.order;

  const response = await fetch(`${API_BASE}/menus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update menu");
  return result.data;
};

export const deleteMenu = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/menus/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Failed to delete menu");
    }
    return true;
  } catch (error) {
    console.error("Delete menu error:", error);
    throw error;
  }
};

export const moveMenu = async (id, newParentId) => {
  try {
    const response = await fetch(`${API_BASE}/menus/${id}/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ newParentId }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to move menu");
    return result.data;
  } catch (error) {
    console.error("Move menu error:", error);
    throw error;
  }
};

export const reorderMenu = async (id, order) => {
  try {
    const response = await fetch(`${API_BASE}/menus/${id}/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ order }),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to reorder menu");
    return result.data;
  } catch (error) {
    console.error("Reorder menu error:", error);
    throw error;
  }
};
