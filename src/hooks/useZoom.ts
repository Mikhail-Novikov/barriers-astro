// src/hooks/useZoom.js
import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const WHEEL_STEP = 0.15;
const BUTTON_STEP = 1.5;
const DOUBLE_TAP_SCALE = 2.5;

export function useZoom({ imgRef, viewportRef, enabled = true }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const scaleRef = useRef(scale);
  const posRef = useRef(position);
  const displaySize = useRef({ w: 0, h: 0 });
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const isDraggingRef = useRef(false);
  const lastTap = useRef(0);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { posRef.current = position; }, [position]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  const clampPosition = useCallback((x, y, currentScale = scaleRef.current) => {
    if (currentScale <= 1) return { x: 0, y: 0 };

    const vw = viewportRef.current?.clientWidth ?? 0;
    const vh = viewportRef.current?.clientHeight ?? 0;
    const scaledW = displaySize.current.w * currentScale;
    const scaledH = displaySize.current.h * currentScale;

    const maxX = Math.max(0, (scaledW - vw) / 2);
    const maxY = Math.max(0, (scaledH - vh) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, [viewportRef]);

  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomAt = useCallback((newScale, clientX, clientY) => {
    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    const img = imgRef.current;
    if (!img || newScale === scaleRef.current) return;

    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const offsetX = clientX - cx;
    const offsetY = clientY - cy;
    const ratio = newScale / scaleRef.current;

    const nextX = posRef.current.x - offsetX * (ratio - 1);
    const nextY = posRef.current.y - offsetY * (ratio - 1);

    setScale(newScale);
    setPosition(clampPosition(nextX, nextY, newScale));
  }, [imgRef, clampPosition]);

  const zoomIn = useCallback(() => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(
      scaleRef.current * BUTTON_STEP,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  }, [imgRef, zoomAt]);

  const zoomOut = useCallback(() => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(
      scaleRef.current / BUTTON_STEP,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  }, [imgRef, zoomAt]);

  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    const viewport = viewportRef.current;
    if (!img || !viewport) return;

    const maxW = viewport.clientWidth * 0.9;
    const maxH = viewport.clientHeight * 0.9;
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);

    displaySize.current = {
      w: img.naturalWidth * ratio,
      h: img.naturalHeight * ratio,
    };
  }, [imgRef, viewportRef]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !enabled) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * WHEEL_STEP;
      zoomAt(scaleRef.current * (1 + delta), e.clientX, e.clientY);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [viewportRef, enabled, zoomAt]);

  useEffect(() => {
    if (!enabled) return;
    const img = imgRef.current;
    if (!img) return;

    const getPoint = (e) => (e.touches ? e.touches[0] : e);

    const onDown = (e) => {
      if (scaleRef.current <= 1) return;
      const p = getPoint(e);
      dragStart.current = {
        x: p.clientX,
        y: p.clientY,
        posX: posRef.current.x,
        posY: posRef.current.y,
      };
      setIsDragging(true);
    };

    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const p = getPoint(e);
      const rawX = dragStart.current.posX + (p.clientX - dragStart.current.x);
      const rawY = dragStart.current.posY + (p.clientY - dragStart.current.y);
      setPosition(clampPosition(rawX, rawY));
    };

    const onUp = () => setIsDragging(false);

    img.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    img.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      img.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      img.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [imgRef, enabled, clampPosition]);

  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    if (scaleRef.current > 1) reset();
    else zoomAt(DOUBLE_TAP_SCALE, e.clientX, e.clientY);
  }, [reset, zoomAt]);

  const handleTouchEnd = useCallback((e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault();
      const p = e.changedTouches[0];
      if (scaleRef.current > 1) reset();
      else zoomAt(DOUBLE_TAP_SCALE, p.clientX, p.clientY);
    }
    lastTap.current = now;
  }, [reset, zoomAt]);

  return {
    scale,
    position,
    isDragging,
    reset,
    zoomIn,
    zoomOut,
    onImageLoad,
    handleDoubleClick,
    handleTouchEnd,
  };
}