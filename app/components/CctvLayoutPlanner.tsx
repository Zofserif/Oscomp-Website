"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./CctvLayoutPlanner.module.css";

type ToolMode = "select" | "wall" | "room" | "door" | "obstacle" | "camera";
type SelectedType = "wall" | "door" | "obstacle" | "camera" | null;

type Segment = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  thickness: number;
};

type Obstacle = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Camera = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  fov: number;
  range: number;
  color: string;
};

type DraftLine = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type DraftRect = DraftLine;

type Point = {
  x: number;
  y: number;
};

const PIXELS_PER_METER = 20;
const DEFAULT_GRID_SIZE = 20;
const CANVAS_EXTENT = 3200;
const COLOR_SWATCHES = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function getIntersection(
  rayStart: Point,
  rayEnd: Point,
  wallStart: Point,
  wallEnd: Point,
) {
  const x1 = rayStart.x;
  const y1 = rayStart.y;
  const x2 = rayEnd.x;
  const y2 = rayEnd.y;
  const x3 = wallStart.x;
  const y3 = wallStart.y;
  const x4 = wallEnd.x;
  const y4 = wallEnd.y;

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den === 0) {
    return null;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1),
      distance: t,
    };
  }

  return null;
}

function obstacleToSegments(obstacle: Obstacle): Segment[] {
  return [
    {
      id: `${obstacle.id}-top`,
      startX: obstacle.x,
      startY: obstacle.y,
      endX: obstacle.x + obstacle.w,
      endY: obstacle.y,
      thickness: 2,
    },
    {
      id: `${obstacle.id}-right`,
      startX: obstacle.x + obstacle.w,
      startY: obstacle.y,
      endX: obstacle.x + obstacle.w,
      endY: obstacle.y + obstacle.h,
      thickness: 2,
    },
    {
      id: `${obstacle.id}-bottom`,
      startX: obstacle.x + obstacle.w,
      startY: obstacle.y + obstacle.h,
      endX: obstacle.x,
      endY: obstacle.y + obstacle.h,
      thickness: 2,
    },
    {
      id: `${obstacle.id}-left`,
      startX: obstacle.x,
      startY: obstacle.y + obstacle.h,
      endX: obstacle.x,
      endY: obstacle.y,
      thickness: 2,
    },
  ];
}

function getCoveragePath(camera: Camera, segments: Segment[]) {
  const { x: cx, y: cy, range, rotation, fov } = camera;
  const startAngle = rotation - fov / 2;
  const endAngle = rotation + fov / 2;
  const angles = new Set<number>();

  for (let angle = Math.floor(startAngle); angle <= Math.ceil(endAngle); angle += 1) {
    angles.add(angle);
  }

  angles.add(startAngle);
  angles.add(endAngle);

  for (const segment of segments) {
    for (const point of [
      { x: segment.startX, y: segment.startY },
      { x: segment.endX, y: segment.endY },
    ]) {
      const distance = Math.hypot(point.x - cx, point.y - cy);
      if (distance > range) {
        continue;
      }

      let angle = (Math.atan2(point.y - cy, point.x - cx) * 180) / Math.PI + 90;
      let relativeAngle = angle - rotation;

      while (relativeAngle <= -180) {
        relativeAngle += 360;
      }
      while (relativeAngle > 180) {
        relativeAngle -= 360;
      }

      if (Math.abs(relativeAngle) <= fov / 2) {
        const continuousAngle = rotation + relativeAngle;
        angles.add(continuousAngle - 0.01);
        angles.add(continuousAngle);
        angles.add(continuousAngle + 0.01);
      }
    }
  }

  const sortedAngles = [...angles].sort((a, b) => a - b);
  let path = `M ${cx} ${cy} `;

  for (const angle of sortedAngles) {
    const rad = ((angle - 90) * Math.PI) / 180;
    const rayEnd = {
      x: cx + range * Math.cos(rad),
      y: cy + range * Math.sin(rad),
    };

    let closestPoint: Point & { distance: number } = {
      ...rayEnd,
      distance: 1,
    };

    for (const segment of segments) {
      const intersection = getIntersection(
        { x: cx, y: cy },
        rayEnd,
        { x: segment.startX, y: segment.startY },
        { x: segment.endX, y: segment.endY },
      );

      if (intersection && intersection.distance < closestPoint.distance) {
        closestPoint = intersection;
      }
    }

    path += `L ${closestPoint.x} ${closestPoint.y} `;
  }

  return `${path}Z`;
}

function metersFromPixels(value: number) {
  return (value / PIXELS_PER_METER).toFixed(2);
}

export function CctvLayoutPlanner() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [walls, setWalls] = useState<Segment[]>([]);
  const [doors, setDoors] = useState<Segment[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [mode, setMode] = useState<ToolMode>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SelectedType>(null);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draftWall, setDraftWall] = useState<DraftLine | null>(null);
  const [draftDoor, setDraftDoor] = useState<DraftLine | null>(null);
  const [draftRect, setDraftRect] = useState<DraftRect | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState<Point>({ x: 0, y: 0 });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const blockingSegments = useMemo(() => [...walls], [walls]);

  const selectedCamera =
    selectedType === "camera"
      ? cameras.find((item) => item.id === selectedId) ?? null
      : null;
  const selectedWall =
    selectedType === "wall"
      ? walls.find((item) => item.id === selectedId) ?? null
      : null;
  const selectedDoor =
    selectedType === "door"
      ? doors.find((item) => item.id === selectedId) ?? null
      : null;
  const selectedSegment = selectedWall ?? selectedDoor;
  const selectedObstacle =
    selectedType === "obstacle"
      ? obstacles.find((item) => item.id === selectedId) ?? null
      : null;
  const selectedItem = selectedCamera ?? selectedSegment ?? selectedObstacle;
  const selectedSegmentType: "wall" | "door" | null =
    selectedWall ? "wall" : selectedDoor ? "door" : null;
  const hasPlacedItems =
    walls.length > 0 ||
    doors.length > 0 ||
    obstacles.length > 0 ||
    cameras.length > 0;

  function clearSelection() {
    setSelectedId(null);
    setSelectedType(null);
  }

  function handleModeChange(nextMode: ToolMode) {
    setMode(nextMode);
    setMobileSidebarOpen(false);
  }

  async function exportAsImage() {
    if (!svgRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
      const viewBox = clonedSvg.viewBox.baseVal;
      const namespace = "http://www.w3.org/2000/svg";
      const background = document.createElementNS(namespace, "rect");

      background.setAttribute("x", String(viewBox.x));
      background.setAttribute("y", String(viewBox.y));
      background.setAttribute("width", String(viewBox.width));
      background.setAttribute("height", String(viewBox.height));
      background.setAttribute("fill", "#f8fafc");
      clonedSvg.insertBefore(background, clonedSvg.firstChild);

      clonedSvg.setAttribute("xmlns", namespace);
      clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
      clonedSvg.setAttribute("width", String(viewBox.width));
      clonedSvg.setAttribute("height", String(viewBox.height));

      const serialized = new XMLSerializer().serializeToString(clonedSvg);
      const blob = new Blob([serialized], {
        type: "image/svg+xml;charset=utf-8",
      });
      const objectUrl = URL.createObjectURL(blob);

      try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const element = new Image();
          element.onload = () => resolve(element);
          element.onerror = () => reject(new Error("Failed to load planner image."));
          element.src = objectUrl;
        });

        const canvas = document.createElement("canvas");
        const scaleFactor = 2;
        canvas.width = viewBox.width * scaleFactor;
        canvas.height = viewBox.height * scaleFactor;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not create export canvas.");
        }

        context.fillStyle = "#f8fafc";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "oscomp-cctv-layout.png";
        link.click();
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } finally {
      setIsExporting(false);
      setMobileSidebarOpen(false);
    }
  }

  function getMouseCoords(event: React.PointerEvent<Element>) {
    if (!svgRef.current) {
      return { x: 0, y: 0 };
    }

    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) {
      return { x: 0, y: 0 };
    }

    const svgX = (event.clientX - ctm.e) / ctm.a;
    const svgY = (event.clientY - ctm.f) / ctm.d;
    let x = (svgX - pan.x) / scale;
    let y = (svgY - pan.y) / scale;

    if (snapToGrid && !isPanning && mode !== "select") {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  }

  function handleCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setMobileSidebarOpen(false);

    if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
      setIsPanning(true);
      setLastMousePos({ x: event.clientX, y: event.clientY });
      return;
    }

    const coords = getMouseCoords(event);

    if (mode === "wall") {
      setDraftWall({
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
      });
      return;
    }

    if (mode === "door") {
      setDraftDoor({
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
      });
      return;
    }

    if (mode === "room" || mode === "obstacle") {
      setDraftRect({
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
      });
      return;
    }

    if (mode === "camera") {
      const camera: Camera = {
        id: makeId(),
        x: coords.x,
        y: coords.y,
        rotation: 180,
        fov: 90,
        range: 10 * PIXELS_PER_METER,
        color: COLOR_SWATCHES[0],
      };

      setCameras((items) => [...items, camera]);
      setSelectedId(camera.id);
      setSelectedType("camera");
      setMode("select");
      return;
    }

    if (mode === "select") {
      clearSelection();
    }
  }

  function handleCanvasPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (isPanning) {
      const dx = event.clientX - lastMousePos.x;
      const dy = event.clientY - lastMousePos.y;
      setPan((value) => ({ x: value.x + dx, y: value.y + dy }));
      setLastMousePos({ x: event.clientX, y: event.clientY });
      return;
    }

    const coords = getMouseCoords(event);

    if (mode === "wall" && draftWall) {
      setDraftWall((value) => (value ? { ...value, endX: coords.x, endY: coords.y } : value));
      return;
    }

    if (mode === "door" && draftDoor) {
      setDraftDoor((value) => (value ? { ...value, endX: coords.x, endY: coords.y } : value));
      return;
    }

    if ((mode === "room" || mode === "obstacle") && draftRect) {
      setDraftRect((value) => (value ? { ...value, endX: coords.x, endY: coords.y } : value));
      return;
    }

    if (!isDraggingItem || !selectedId) {
      return;
    }

    let newX = coords.x - dragOffset.x;
    let newY = coords.y - dragOffset.y;

    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    if (selectedType === "camera") {
      setCameras((items) =>
        items.map((item) =>
          item.id === selectedId ? { ...item, x: newX, y: newY } : item,
        ),
      );
      return;
    }

    if (selectedType === "wall") {
      setWalls((items) =>
        items.map((item) => {
          if (item.id !== selectedId) {
            return item;
          }

          const dx = newX - item.startX;
          const dy = newY - item.startY;
          return {
            ...item,
            startX: newX,
            startY: newY,
            endX: item.endX + dx,
            endY: item.endY + dy,
          };
        }),
      );
      return;
    }

    if (selectedType === "door") {
      setDoors((items) =>
        items.map((item) => {
          if (item.id !== selectedId) {
            return item;
          }

          const dx = newX - item.startX;
          const dy = newY - item.startY;
          return {
            ...item,
            startX: newX,
            startY: newY,
            endX: item.endX + dx,
            endY: item.endY + dy,
          };
        }),
      );
      return;
    }

    if (selectedType === "obstacle") {
      setObstacles((items) =>
        items.map((item) =>
          item.id === selectedId ? { ...item, x: newX, y: newY } : item,
        ),
      );
    }
  }

  function handleCanvasPointerUp() {
    setIsPanning(false);
    setIsDraggingItem(false);

    if (draftWall) {
      if (draftWall.startX !== draftWall.endX || draftWall.startY !== draftWall.endY) {
        setWalls((items) => [
          ...items,
          { id: makeId(), ...draftWall, thickness: 0.5 * PIXELS_PER_METER },
        ]);
      }
      setDraftWall(null);
    }

    if (draftDoor) {
      if (draftDoor.startX !== draftDoor.endX || draftDoor.startY !== draftDoor.endY) {
        setDoors((items) => [
          ...items,
          { id: makeId(), ...draftDoor, thickness: 0.3 * PIXELS_PER_METER },
        ]);
      }
      setDraftDoor(null);
    }

    if (draftRect) {
      const width = Math.abs(draftRect.endX - draftRect.startX);
      const height = Math.abs(draftRect.endY - draftRect.startY);
      const minX = Math.min(draftRect.startX, draftRect.endX);
      const minY = Math.min(draftRect.startY, draftRect.endY);

      if (width > 0 && height > 0) {
        if (mode === "room") {
          const thickness = 0.5 * PIXELS_PER_METER;
          setWalls((items) => [
            ...items,
            {
              id: makeId(),
              startX: minX,
              startY: minY,
              endX: minX + width,
              endY: minY,
              thickness,
            },
            {
              id: makeId(),
              startX: minX + width,
              startY: minY,
              endX: minX + width,
              endY: minY + height,
              thickness,
            },
            {
              id: makeId(),
              startX: minX + width,
              startY: minY + height,
              endX: minX,
              endY: minY + height,
              thickness,
            },
            {
              id: makeId(),
              startX: minX,
              startY: minY + height,
              endX: minX,
              endY: minY,
              thickness,
            },
          ]);
        }

        if (mode === "obstacle") {
          setObstacles((items) => [...items, { id: makeId(), x: minX, y: minY, w: width, h: height }]);
        }
      }

      setDraftRect(null);
    }
  }

  function handleItemPointerDown(
    event: React.PointerEvent<SVGElement>,
    id: string,
    type: Exclude<SelectedType, null>,
    point: Point,
  ) {
    if (mode !== "select") {
      return;
    }

    event.stopPropagation();
    setSelectedId(id);
    setSelectedType(type);
    setIsDraggingItem(true);

    const mouseCoords = getMouseCoords(event);
    setDragOffset({
      x: mouseCoords.x - point.x,
      y: mouseCoords.y - point.y,
    });
  }

  function updateSelectedCamera(updates: Partial<Camera>) {
    setCameras((items) =>
      items.map((item) => (item.id === selectedId ? { ...item, ...updates } : item)),
    );
  }

  function updateSelectedSegment(
    type: "wall" | "door",
    updates: Partial<Segment>,
  ) {
    const updater =
      type === "wall"
        ? setWalls
        : setDoors;

    updater((items) =>
      items.map((item) => (item.id === selectedId ? { ...item, ...updates } : item)),
    );
  }

  function deleteSelected() {
    if (!selectedId || !selectedType) {
      return;
    }

    if (selectedType === "camera") {
      setCameras((items) => items.filter((item) => item.id !== selectedId));
    } else if (selectedType === "wall") {
      setWalls((items) => items.filter((item) => item.id !== selectedId));
    } else if (selectedType === "door") {
      setDoors((items) => items.filter((item) => item.id !== selectedId));
    } else if (selectedType === "obstacle") {
      setObstacles((items) => items.filter((item) => item.id !== selectedId));
    }

    clearSelection();
  }

  function clearAll() {
    setWalls([]);
    setDoors([]);
    setObstacles([]);
    setCameras([]);
    clearSelection();
  }

  const toolButtons: Array<{
    mode: ToolMode;
    label: string;
    meta: string;
    icon: string;
  }> = [
    { mode: "select", label: "Select", meta: "Move", icon: "↖" },
    { mode: "wall", label: "Wall", meta: "Draw", icon: "／" },
    { mode: "room", label: "Room", meta: "Draw", icon: "▭" },
    { mode: "door", label: "Door", meta: "Draw", icon: "⊏" },
    { mode: "obstacle", label: "Obstacle", meta: "Block", icon: "■" },
    { mode: "camera", label: "Camera", meta: "Place", icon: "◉" },
  ];

  return (
    <div
      className={`${styles.plannerShell} ${sidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed} ${mobileSidebarOpen ? styles.sidebarMobileOpen : ""}`}
    >
      <button
        type="button"
        className={styles.mobileSidebarToggle}
        onClick={() => setMobileSidebarOpen(true)}
      >
        <span className={styles.toolButtonIcon} aria-hidden="true">
          ☰
        </span>
        <span className={styles.mobileSidebarButtonText}>Tools</span>
      </button>
      <button
        type="button"
        aria-hidden={!mobileSidebarOpen}
        className={`${styles.sidebarBackdrop} ${mobileSidebarOpen ? styles.sidebarBackdropVisible : ""}`}
        aria-label="Close tools panel"
        onClick={() => setMobileSidebarOpen(false)}
      />
      <aside className={styles.toolRail}>
        <div className={styles.toolRailHeader}>
          <div>
            <span className={styles.toolRailEyebrow}>Planner</span>
            <strong className={styles.toolRailTitle}>Layout Tools</strong>
            <span className={styles.toolRailStatus}>
              {mode === "select" ? "Select mode" : `${mode} mode`}
            </span>
          </div>
          <div className={styles.sidebarToggleGroup}>
            <button
              type="button"
              className={`${styles.sidebarToggle} ${styles.sidebarToggleDesktop}`}
              onClick={() => setSidebarExpanded((value) => !value)}
              aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarExpanded ? "←" : "→"}
            </button>
            <button
              type="button"
              className={`${styles.sidebarToggle} ${styles.sidebarToggleMobile}`}
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close tools"
            >
              ×
            </button>
          </div>
        </div>

        <div className={styles.toolGroup}>
          {toolButtons.map((tool) => (
            <button
              key={tool.mode}
              type="button"
              className={`${styles.toolButton} ${mode === tool.mode ? styles.toolButtonActive : ""}`}
              onClick={() => handleModeChange(tool.mode)}
              title={tool.label}
            >
              <span className={styles.toolButtonIcon} aria-hidden="true">
                {tool.icon}
              </span>
              <span className={styles.toolButtonLabelWrap}>
                <span className={styles.toolButtonLabel}>{tool.label}</span>
                <span className={styles.toolButtonMeta}>{tool.meta}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.toolDivider} />

        <div className={styles.toolGroup}>
          <div className={styles.compactButtonRow}>
            <button type="button" className={styles.miniButton} onClick={() => setScale((value) => Math.min(value + 0.2, 3))}>
              Zoom +
            </button>
            <button type="button" className={styles.miniButton} onClick={() => setScale((value) => Math.max(value - 0.2, 0.3))}>
              Zoom -
            </button>
          </div>
          <button
            type="button"
            className={styles.miniButton}
            onClick={() => {
              setScale(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            Reset View
          </button>
          <button type="button" className={styles.miniButton} onClick={exportAsImage}>
            <span className={styles.buttonIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h1Zm-7 14h14v2H5v-2Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>{isExporting ? "Exporting..." : "Export PNG"}</span>
          </button>
        </div>

        <div className={styles.toolRailFooter}>
          <div className={styles.canvasSummary}>
            <span>{walls.length + doors.length} lines</span>
            <span>{cameras.length} cameras</span>
          </div>
          <button type="button" className={styles.miniButton} onClick={() => setSnapToGrid((value) => !value)}>
            Grid Snap: {snapToGrid ? "On" : "Off"}
          </button>
          <button type="button" className={styles.dangerButton} onClick={clearAll}>
            <span className={styles.buttonIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 11h12l1-13H5l1 13Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>Clear All</span>
          </button>
        </div>
      </aside>

      <div
        className={`${styles.canvasStage} ${isPanning ? styles.grabbing : mode === "select" ? styles.defaultCursor : styles.crosshair}`}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerLeave={handleCanvasPointerUp}
      >
        <div className={styles.canvasViewport}>
          <svg ref={svgRef} className={styles.canvasSvg} viewBox={`0 0 1200 760`}>
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
              {Array.from({ length: (CANVAS_EXTENT * 2) / gridSize + 1 }, (_, index) => {
                const value = -CANVAS_EXTENT + index * gridSize;
                return (
                  <g key={value}>
                    <line
                      x1={value}
                      y1={-CANVAS_EXTENT}
                      x2={value}
                      y2={CANVAS_EXTENT}
                      stroke="#dbe4ef"
                      strokeWidth={1}
                    />
                    <line
                      x1={-CANVAS_EXTENT}
                      y1={value}
                      x2={CANVAS_EXTENT}
                      y2={value}
                      stroke="#dbe4ef"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}

              {obstacles.map((obstacle) => (
                <rect
                  key={obstacle.id}
                  x={obstacle.x}
                  y={obstacle.y}
                  width={obstacle.w}
                  height={obstacle.h}
                  fill={selectedId === obstacle.id ? "#94a3b8" : "#cbd5e1"}
                  stroke={selectedId === obstacle.id ? "#2563eb" : "#64748b"}
                  strokeWidth={2}
                  onPointerDown={(event) =>
                    handleItemPointerDown(event, obstacle.id, "obstacle", {
                      x: obstacle.x,
                      y: obstacle.y,
                    })
                  }
                />
              ))}

              {walls.map((wall) => (
                <line
                  key={wall.id}
                  x1={wall.startX}
                  y1={wall.startY}
                  x2={wall.endX}
                  y2={wall.endY}
                  stroke={selectedId === wall.id ? "#2563eb" : "#334155"}
                  strokeWidth={wall.thickness}
                  strokeLinecap="round"
                  onPointerDown={(event) =>
                    handleItemPointerDown(event, wall.id, "wall", {
                      x: wall.startX,
                      y: wall.startY,
                    })
                  }
                />
              ))}

              {doors.map((door) => (
                <line
                  key={door.id}
                  x1={door.startX}
                  y1={door.startY}
                  x2={door.endX}
                  y2={door.endY}
                  stroke={selectedId === door.id ? "#2563eb" : "#d97706"}
                  strokeWidth={door.thickness}
                  strokeLinecap="butt"
                  onPointerDown={(event) =>
                    handleItemPointerDown(event, door.id, "door", {
                      x: door.startX,
                      y: door.startY,
                    })
                  }
                />
              ))}

              {draftWall ? (
                <line
                  x1={draftWall.startX}
                  y1={draftWall.startY}
                  x2={draftWall.endX}
                  y2={draftWall.endY}
                  stroke="#94a3b8"
                  strokeWidth={0.5 * PIXELS_PER_METER}
                  strokeDasharray="6 6"
                />
              ) : null}

              {draftDoor ? (
                <line
                  x1={draftDoor.startX}
                  y1={draftDoor.startY}
                  x2={draftDoor.endX}
                  y2={draftDoor.endY}
                  stroke="#f59e0b"
                  strokeWidth={0.3 * PIXELS_PER_METER}
                  strokeDasharray="6 6"
                />
              ) : null}

              {draftRect ? (
                <rect
                  x={Math.min(draftRect.startX, draftRect.endX)}
                  y={Math.min(draftRect.startY, draftRect.endY)}
                  width={Math.abs(draftRect.endX - draftRect.startX)}
                  height={Math.abs(draftRect.endY - draftRect.startY)}
                  fill={mode === "obstacle" ? "rgba(148, 163, 184, 0.45)" : "transparent"}
                  stroke={mode === "obstacle" ? "#64748b" : "#94a3b8"}
                  strokeWidth={mode === "obstacle" ? 2 : 0.5 * PIXELS_PER_METER}
                  strokeDasharray={mode === "room" ? "6 6" : undefined}
                />
              ) : null}

              {cameras.map((camera) => {
                const startAngle = camera.rotation - camera.fov / 2;
                const endAngle = camera.rotation + camera.fov / 2;
                const isSelected = selectedId === camera.id;

                return (
                  <g
                    key={camera.id}
                    onPointerDown={(event) =>
                      handleItemPointerDown(event, camera.id, "camera", {
                        x: camera.x,
                        y: camera.y,
                      })
                    }
                  >
                    <path
                      d={getCoveragePath(camera, blockingSegments)}
                      fill={camera.color}
                      opacity={isSelected ? 0.34 : 0.2}
                    />
                    <path
                      d={describeArc(camera.x, camera.y, camera.range, startAngle, endAngle)}
                      fill="none"
                      stroke={camera.color}
                      strokeDasharray="4 4"
                      opacity={0.35}
                    />
                    <circle cx={camera.x} cy={camera.y} r={10} fill={isSelected ? "#2563eb" : "#0f172a"} />
                    <path
                      d={`M ${camera.x} ${camera.y - 10} L ${camera.x - 4} ${camera.y - 16} L ${camera.x + 4} ${camera.y - 16} Z`}
                      fill={isSelected ? "#2563eb" : "#0f172a"}
                      transform={`rotate(${camera.rotation} ${camera.x} ${camera.y})`}
                    />
                    {isSelected ? (
                      <circle
                        cx={camera.x}
                        cy={camera.y}
                        r={14}
                        fill="none"
                        stroke="#2563eb"
                        strokeDasharray="3 3"
                      />
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {!hasPlacedItems ? (
          <div className={styles.floatingCard}>
            <p className={styles.fieldLegend}>How to use</p>
            <ul>
              <li>Draw rooms, walls, doors, and obstacles to match the site layout.</li>
              <li>Place cameras, then adjust direction, field of view, and range.</li>
              <li>Shift + drag or middle-click to pan. Use zoom controls for tighter planning.</li>
            </ul>
          </div>
        ) : null}
      </div>

      <aside className={`${styles.sidePanel} ${selectedItem ? "" : styles.sidePanelEmpty}`}>
        {selectedItem ? (
          <>
            <div className={styles.sidePanelHeader}>
              <h2>
                {selectedType === "camera"
                  ? "Camera Properties"
                  : selectedType === "wall"
                    ? "Wall Properties"
                    : selectedType === "door"
                      ? "Door Properties"
                      : "Obstacle Properties"}
              </h2>
              <button type="button" className={styles.closeButton} onClick={clearSelection} aria-label="Close properties">
                ×
              </button>
            </div>

            {selectedCamera ? (
              <>
                <div className={styles.fieldGroup}>
                  <label htmlFor="camera-rotation">Direction</label>
                  <span className={styles.fieldHint}>{selectedCamera.rotation}°</span>
                  <input
                    id="camera-rotation"
                    className={styles.rangeInput}
                    type="range"
                    min="0"
                    max="360"
                    value={selectedCamera.rotation}
                    onChange={(event) => updateSelectedCamera({ rotation: Number(event.target.value) })}
                  />
                </div>
                <div className={styles.presetGrid}>
                  {[0, 90, 180, 270].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={styles.presetButton}
                      onClick={() => updateSelectedCamera({ rotation: value })}
                    >
                      {value}°
                    </button>
                  ))}
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="camera-fov">Field of View</label>
                  <span className={styles.fieldHint}>{selectedCamera.fov}°</span>
                  <input
                    id="camera-fov"
                    className={styles.rangeInput}
                    type="range"
                    min="10"
                    max="180"
                    value={selectedCamera.fov}
                    onChange={(event) => updateSelectedCamera({ fov: Number(event.target.value) })}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="camera-range">Coverage Range</label>
                  <span className={styles.fieldHint}>{metersFromPixels(selectedCamera.range)} m</span>
                  <input
                    id="camera-range"
                    className={styles.rangeInput}
                    type="range"
                    min="1"
                    max="50"
                    value={selectedCamera.range / PIXELS_PER_METER}
                    onChange={(event) =>
                      updateSelectedCamera({ range: Number(event.target.value) * PIXELS_PER_METER })
                    }
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLegend}>Zone Color</span>
                  <div className={styles.swatchGrid}>
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`${styles.swatchButton} ${selectedCamera.color === color ? styles.swatchButtonActive : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSelectedCamera({ color })}
                        aria-label={`Use ${color} zone color`}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {selectedSegment && selectedSegmentType ? (
              <>
                <div className={styles.fieldGroup}>
                  <label htmlFor="segment-thickness">Thickness</label>
                  <span className={styles.fieldHint}>{metersFromPixels(selectedSegment.thickness)} m</span>
                  <input
                    id="segment-thickness"
                    className={styles.rangeInput}
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={selectedSegment.thickness / PIXELS_PER_METER}
                    onChange={(event) =>
                      updateSelectedSegment(selectedSegmentType, {
                        thickness: Number(event.target.value) * PIXELS_PER_METER,
                      })
                    }
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="segment-length">Length</label>
                  <input
                    id="segment-length"
                    className={styles.numberInput}
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={Number(
                      (
                        Math.hypot(
                          selectedSegment.endX - selectedSegment.startX,
                          selectedSegment.endY - selectedSegment.startY,
                        ) / PIXELS_PER_METER
                      ).toFixed(2),
                    )}
                    onChange={(event) => {
                      const nextLength = Number(event.target.value);
                      if (!nextLength || nextLength <= 0) {
                        return;
                      }

                      const lengthInPixels = nextLength * PIXELS_PER_METER;
                      const angle = Math.atan2(
                        selectedSegment.endY - selectedSegment.startY,
                        selectedSegment.endX - selectedSegment.startX,
                      );
                      updateSelectedSegment(selectedSegmentType, {
                        endX: selectedSegment.startX + lengthInPixels * Math.cos(angle),
                        endY: selectedSegment.startY + lengthInPixels * Math.sin(angle),
                      });
                    }}
                  />
                </div>
              </>
            ) : null}

            {selectedObstacle ? (
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.fieldHint}>Width</span>
                  <strong>{metersFromPixels(selectedObstacle.w)} m</strong>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.fieldHint}>Height</span>
                  <strong>{metersFromPixels(selectedObstacle.h)} m</strong>
                </div>
              </div>
            ) : null}

            <div className={styles.fieldGroup}>
              <label htmlFor="grid-size">Grid Size</label>
              <input
                id="grid-size"
                className={styles.numberInput}
                type="number"
                min="10"
                step="10"
                value={gridSize}
                onChange={(event) => setGridSize(Math.max(10, Number(event.target.value) || DEFAULT_GRID_SIZE))}
              />
            </div>

            <div className={styles.panelSpacer}>
              <button type="button" className={styles.dangerButton} onClick={deleteSelected}>
                <span className={styles.buttonIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path
                      d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 11h12l1-13H5l1 13Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>Delete Selected</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>No item selected</h2>
            <p>Pick a wall, door, obstacle, or camera to edit its properties.</p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.fieldHint}>Walls</span>
                <strong>{walls.length}</strong>
              </div>
              <div className={styles.statCard}>
                <span className={styles.fieldHint}>Cameras</span>
                <strong>{cameras.length}</strong>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
