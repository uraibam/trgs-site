"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
} from "react";
import "./LogoLoop.css";

/**
 * Lightweight, production-safe port of React Bits' LogoLoop.
 * Speed unit = pixels/second. Direction "left" or "right".
 */

type NodeLogo = {
  node: React.ReactNode;
  title?: string;
  href?: string;
  ariaLabel?: string;
};

type ImageLogo = {
  src: string;
  alt?: string;
  title?: string;
  href?: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
};

type LogoItem = NodeLogo | ImageLogo;

type Props = {
  logos: LogoItem[];
  speed?: number; // px/s
  direction?: "left" | "right";
  width?: number | string;
  logoHeight?: number; // px
  gap?: number; // px
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const ANIMATION = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (v?: number | string) =>
  typeof v === "number" ? `${v}px` : v ?? undefined;

const useResizeObserver = (
  callback: () => void,
  elements: React.RefObject<HTMLElement>[],
  deps: React.DependencyList
) => {
  useEffect(() => {
    if (!("ResizeObserver" in window)) {
      const onWin = () => callback();
      window.addEventListener("resize", onWin);
      callback();
      return () => window.removeEventListener("resize", onWin);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const ro = new ResizeObserver(callback);
      ro.observe(ref.current);
      return ro;
    });

    callback();
    return () => observers.forEach((o) => o?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLElement>,
  onLoad: () => void,
  deps: React.DependencyList
) => {
  useEffect(() => {
    const imgs = (seqRef.current?.querySelectorAll("img") ??
      []) as NodeListOf<HTMLImageElement>;
    if (imgs.length === 0) {
      onLoad();
      return;
    }
    let remaining = imgs.length;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };
    imgs.forEach((img) => {
      if (img.complete) return done();
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
    return () => {
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const offset = useRef(0);
  const vel = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offset.current = ((offset.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset.current}px,0,0)`;
    }

    const animate = (t: number) => {
      if (lastTs.current == null) lastTs.current = t;
      const dt = Math.max(0, t - lastTs.current) / 1000;
      lastTs.current = t;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;
      const easing = 1 - Math.exp(-dt / ANIMATION.SMOOTH_TAU);
      vel.current += (target - vel.current) * easing;

      if (seqWidth > 0) {
        let next = offset.current + vel.current * dt;
        next = ((next % seqWidth) + seqWidth) % seqWidth;
        offset.current = next;
        track.style.transform = `translate3d(${-offset.current}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

const LogoLoop = memo((props: Props) => {
  const {
    logos,
    speed = 10, // subtle premium default
    direction = "left",
    width = "100%",
    logoHeight = 32,
    gap = 40,
    pauseOnHover = true,
    fadeOut = true,
    fadeOutColor,
    scaleOnHover = true,
    ariaLabel = "Partner logos",
    className,
    style,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION.MIN_COPIES);
  const [hovered, setHovered] = useState(false);

  const targetVelocity = useMemo(() => {
    const dir = direction === "left" ? 1 : -1;
    return Math.abs(speed) * dir;
  }, [speed, direction]);

  const updateDims = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      const copiesNeeded =
        Math.ceil(cw / sw) + ANIMATION.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDims, [containerRef, seqRef], [logos, gap, logoHeight]);
  useImageLoader(seqRef, updateDims, [logos, gap, logoHeight]);

  useAnimationLoop(trackRef, targetVelocity, seqWidth, hovered, pauseOnHover);

  const cssVars: CSSProperties = {
    ["--logoloop-gap" as any]: `${gap}px`,
    ["--logoloop-logoHeight" as any]: `${logoHeight}px`,
    ...(fadeOutColor && { ["--logoloop-fadeColor" as any]: fadeOutColor }),
  };

  const rootClass =
    [
      "logoloop",
      fadeOut && "logoloop--fade",
      scaleOnHover && "logoloop--scale-hover",
      className,
    ]
      .filter(Boolean)
      .join(" ");

  const containerStyle: CSSProperties = {
    width: toCssLength(width) ?? "100%",
    ...cssVars,
    ...style,
  };

  const renderItem = useCallback((item: LogoItem, key: React.Key) => {
    const isNode = (item as NodeLogo).node !== undefined;
    const node = isNode ? (
      <span className="logoloop__node">{(item as NodeLogo).node}</span>
    ) : (
      <img
        src={(item as ImageLogo).src}
        alt={(item as ImageLogo).alt ?? ""}
        title={(item as ImageLogo).title}
        width={(item as ImageLogo).width}
        height={(item as ImageLogo).height}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );

    const href = (item as any).href as string | undefined;
    const label =
      (item as any).ariaLabel ?? (isNode ? (item as any).title : (item as any).alt);

    const inner = href ? (
      <a
        className="logoloop__link"
        href={href}
        aria-label={label || "logo link"}
        target="_blank"
        rel="noreferrer noopener"
      >
        {node}
      </a>
    ) : (
      node
    );

    return (
      <li className="logoloop__item" key={key} role="listitem">
        {inner}
      </li>
    );
  }, []);

  const lists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, i) => (
        <ul
          className="logoloop__list"
          key={`copy-${i}`}
          role="list"
          aria-hidden={i > 0}
          ref={i === 0 ? seqRef : undefined}
        >
          {logos.map((item, idx) => renderItem(item, `${i}-${idx}`))}
        </ul>
      )),
    [copyCount, logos, renderItem]
  );

  const onEnter = useCallback(() => pauseOnHover && setHovered(true), [pauseOnHover]);
  const onLeave = useCallback(() => pauseOnHover && setHovered(false), [pauseOnHover]);

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="logoloop__track" ref={trackRef}>
        {lists}
      </div>
    </div>
  );
});

LogoLoop.displayName = "LogoLoop";
export default LogoLoop;
