"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMenuStore } from "@/store/menuStore";

type MenuNode = {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  depth: number;
  children?: MenuNode[];
};

type DropPos = "before" | "inside" | "after" | null;

export default function Page() {
  const {
    menus,
    fetchMenus,
    expandAll,
    collapseAll,
    expandedIds,
    toggleExpand,
    addMenu,
    editMenu,
    removeMenu,
    moveMenuItem,
    reorderMenuItem,
  } = useMenuStore();

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    parentId: "",
    depth: 0,
  });
  const [parentText, setParentText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // DnD UX state
  const [dragId, setDragId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<DropPos>(null);
  const autoExpandTimer = useRef<NodeJS.Timeout | null>(null);

  // load awal
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // flat list buat datalist & util
  const flatMenus = useMemo(() => {
    const out: any[] = [];
    const walk = (n: any) => {
      out.push({
        id: n.id,
        name: n.name,
        parentId: n.parentId ?? null,
        depth: n.depth,
        order: n.order ?? 0,
      });
      n.children?.forEach(walk);
    };
    menus.forEach(walk);
    return out;
  }, [menus]);

  const resetForm = () => {
    setSelected(null);
    setForm({ id: "", name: "", parentId: "", depth: 0 });
    setParentText("");
  };

  const handleSelect = (m: any) => {
    setSelected(m);
    setForm({
      id: m.id,
      name: m.name,
      parentId: m.parentId || "",
      depth: m.depth,
    });
    setParentText(
      m.parentId ? flatMenus.find((x) => x.id === m.parentId)?.name || "" : "",
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await editMenu(form.id, {
        name: form.name,
        parentId: form.parentId || null,
      });
    } else {
      await addMenu({ name: form.name, parentId: form.parentId || null });
    }
    await fetchMenus();
    resetForm();
  };

  const handleDelete = async (e: React.MouseEvent, node: any) => {
    e.stopPropagation();
    if (
      !confirm(
        `Hapus menu "${node.name}"${node.children?.length ? " beserta seluruh submenunya" : ""}?`,
      )
    )
      return;
    try {
      setDeletingId(node.id);
      await removeMenu(node.id);
      await fetchMenus();
      if (selected?.id === node.id) resetForm();
    } finally {
      setDeletingId(null);
    }
  };

  // DnD helpers
  const getDescendantIds = (rootId: string) => {
    const ids = new Set<string>();
    const walk = (list: MenuNode[]) => {
      list.forEach((n) => {
        if (n.parentId === rootId) {
          ids.add(n.id);
        }
        if (n.children?.length) walk(n.children as MenuNode[]);
      });
    };
    walk(menus as MenuNode[]);
    // expand deeper:
    const stack = [...ids];
    while (stack.length) {
      const id = stack.pop()!;
      (menus as MenuNode[]).forEach(function deep(n) {
        if (n.parentId === id) {
          if (!ids.has(n.id)) {
            ids.add(n.id);
            stack.push(n.id);
          }
        }
        n.children?.forEach(deep);
      });
    }
    return ids;
  };

  const siblingsSorted = (parentId: string | null) =>
    flatMenus
      .filter((m) => (m.parentId ?? null) === (parentId ?? null))
      .sort((a, b) => a.order - b.order);

  const moveAndReorder = async (
    movedId: string,
    newParentId: string | null,
    insertIndex: number,
  ) => {
    await moveMenuItem(movedId, newParentId);
    await fetchMenus();

    const sibs = siblingsSorted(newParentId).filter((s) => s.id !== movedId);
    const idx = Math.max(0, Math.min(insertIndex, sibs.length));
    const moved = flatMenus.find((f) => f.id === movedId) || {
      id: movedId,
      name: "",
      depth: 0,
      order: 0,
    };
    sibs.splice(idx, 0, { ...moved, parentId: newParentId });

    for (let i = 0; i < sibs.length; i++) {
      await reorderMenuItem(sibs[i].id, i);
    }
    await fetchMenus();
  };

  // DnD handlers
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDragId(id);
  };
  const onDragEnd = () => {
    setDragId(null);
    setHoverId(null);
    setHoverPos(null);
    if (autoExpandTimer.current) {
      clearTimeout(autoExpandTimer.current);
      autoExpandTimer.current = null;
    }
  };

  // hitung posisi drop: before/inside/after berdasar Y dalam kartu
  const calcDropPos = (e: React.DragEvent, el: HTMLElement): DropPos => {
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    if (y < h * 0.25) return "before";
    if (y > h * 0.75) return "after";
    return "inside";
  };

  const onDragOverCard = (e: React.DragEvent, node: MenuNode) => {
    e.preventDefault();
    setHoverId(node.id);
    const target = e.currentTarget as HTMLElement;
    const pos = calcDropPos(e, target);
    setHoverPos(pos);

    // auto expand kalau hover di tengah (inside) node tertutup selama 500ms
    if (pos === "inside" && !expandedIds.has(node.id)) {
      if (autoExpandTimer.current) clearTimeout(autoExpandTimer.current);
      autoExpandTimer.current = setTimeout(() => {
        toggleExpand(node.id);
      }, 500);
    } else {
      if (autoExpandTimer.current) {
        clearTimeout(autoExpandTimer.current);
        autoExpandTimer.current = null;
      }
    }
  };

  const onDropCard = async (
    e: React.DragEvent,
    node: MenuNode,
    parentIdForBeforeAfter: string | null,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragId || dragId === node.id) return;

    // cegah drop ke descendant
    const des = getDescendantIds(dragId);
    if (des.has(node.id)) return;

    const pos = hoverPos;
    setHoverPos(null);
    setHoverId(null);

    // inside => child terakhir
    if (pos === "inside") {
      const count = siblingsSorted(node.id).length;
      await moveAndReorder(dragId, node.id, count);
      onDragEnd();
      return;
    }

    // before / after => sibling pada parent yang sama
    const parentId = parentIdForBeforeAfter;
    const sibs = siblingsSorted(parentId);
    const targetIdx = sibs.findIndex((s) => s.id === node.id);
    const insertIdx =
      pos === "before" ? Math.max(0, targetIdx) : Math.max(0, targetIdx + 1);

    await moveAndReorder(dragId, parentId, insertIdx);
    onDragEnd();
  };

  // UI tree
  const renderTree = (nodes: MenuNode[], parentId: string | null = null) => (
    <ul className="relative ml-4 border-l border-gray-300 pl-4">
      {nodes.map((node) => {
        const isHover = hoverId === node.id;
        const showBefore = isHover && hoverPos === "before";
        const showAfter = isHover && hoverPos === "after";
        const showInside = isHover && hoverPos === "inside";

        return (
          <li key={node.id} className="relative pb-2">
            {/* garis drop BEFORE */}
            <div
              className={`absolute -top-1 right-0 left-[-17px] h-3 ${dragId ? "cursor-copy" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverId(node.id);
                setHoverPos("before");
              }}
              onDrop={(e) => onDropCard(e, node, parentId)}
            >
              {showBefore && (
                <div className="absolute top-1/2 right-0 left-[-17px] -translate-y-1/2 border-t-2 border-blue-500" />
              )}
            </div>

            {/* kartu node */}
            <div
              className={`relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${selected?.id === node.id ? "bg-gray-300" : "hover:bg-gray-200"} ${showInside ? "ring-2 ring-blue-400" : ""}`}
              draggable
              onDragStart={(e) => onDragStart(e, node.id)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOverCard(e, node)}
              onDrop={(e) => onDropCard(e, node, parentId)}
              onClick={() => handleSelect(node)}
            >
              {/* garis horizontal kecil ke node */}
              <span className="absolute top-1/2 left-[-17px] h-px w-4 border-t border-gray-300"></span>

              {/* caret expand/collapse */}
              {node.children?.length ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  className="cursor-pointer text-sm text-gray-500"
                  title={expandedIds.has(node.id) ? "Collapse" : "Expand"}
                >
                  {expandedIds.has(node.id) ? "▼" : "▶"}
                </button>
              ) : (
                ""
              )}

              <span>{node.name}</span>

              {/* tombol delete */}
              <button
                onClick={(e) => handleDelete(e, node)}
                className="ml-auto cursor-pointer rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-60"
                disabled={deletingId === node.id}
                title="Hapus menu"
              >
                {deletingId === node.id ? "Menghapus..." : "X"}
              </button>
            </div>

            {/* garis drop AFTER */}
            <div
              className={`relative right-0 left-[-17px] h-3 ${dragId ? "cursor-copy" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverId(node.id);
                setHoverPos("after");
              }}
              onDrop={(e) => onDropCard(e, node, parentId)}
            >
              {showAfter && (
                <div className="absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-2 border-blue-500" />
              )}
            </div>

            {/* children */}
            {node.children?.length && expandedIds.has(node.id)
              ? renderTree(
                  node.children as MenuNode[],
                  node.parentId ?? node.id,
                )
              : null}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 py-[33px] font-medium">
        <img src="/folder-gray.svg" alt="" />
        <div className="text-blue-gray-300">/</div>
        <div>Menus</div>
      </div>

      <div className="mb-7 flex items-center gap-4">
        <div className="bg-blue-primary flex size-[52px] items-center justify-center rounded-full">
          <img src="/squares-white.svg" alt="" />
        </div>
        <div className="text-[32px] font-semibold">Menus</div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* Left: Tree */}
        <div>
          <div className="mb-7">
            <div className="mb-2">Menu</div>
            <div className="bg-gray-secondary flex items-center justify-between rounded-2xl p-4">
              <div>System Management</div>
              <img src="/caret.svg" alt="" />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              onClick={expandAll}
              className="bg-blue-gray-800 cursor-pointer rounded-4xl py-3 text-white"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="border-blue-gray-300 cursor-pointer rounded-4xl border py-3"
            >
              Collapse All
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {menus.length === 0 ? (
              <div className="text-sm text-gray-500 italic">No menus found</div>
            ) : (
              renderTree(menus as MenuNode[])
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="mt-[110px] flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block">Menu ID</label>
              <input
                type="text"
                value={form.id}
                disabled
                className="bg-gray-secondary w-full rounded-2xl px-4 py-[18px]"
              />
            </div>

            <div>
              <label className="mb-2 block">Depth</label>
              <input
                type="number"
                value={form.depth}
                readOnly
                className="bg-gray-secondary w-full rounded-2xl px-4 py-[18px]"
              />
            </div>

            <div>
              <label className="mb-2 block">Parent</label>
              <input
                type="text"
                list="parentMenuList"
                placeholder="Ketik nama parent"
                value={parentText}
                onChange={(e) => {
                  const text = e.target.value;
                  setParentText(text);
                  const sel = flatMenus.find(
                    (m) => m.name.toLowerCase() === text.toLowerCase(),
                  );
                  if (sel)
                    setForm((f) => ({
                      ...f,
                      parentId: sel.id,
                      depth: sel.depth + 1,
                    }));
                  else setForm((f) => ({ ...f, parentId: "", depth: 0 }));
                }}
                className="bg-gray-secondary rounded-2xl px-4 py-[18px]"
              />
              <datalist id="parentMenuList">
                {flatMenus.map((m) => (
                  <option key={m.id} value={m.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-2 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nama menu"
                className="bg-gray-secondary rounded-2xl px-4 py-[18px]"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-primary w-1/2 cursor-pointer rounded-4xl py-4 text-center text-white"
            >
              {form.id ? "Update" : "Save"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="w-1/2 cursor-pointer rounded-4xl border py-4"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
