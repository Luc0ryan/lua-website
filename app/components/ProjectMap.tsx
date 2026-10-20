"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { urlFor } from "@/sanity/lib/image";
import type { MapLocation } from "@/sanity/lib/queries";

const SOURCE_ID = "locations";
// Invisible layer. The visible markers are HTML (see syncMarkers), but a
// source with no layers never loads tiles, so querySourceFeatures would
// return nothing — this keeps the clustered source "in use".
const SYNC_LAYER = "markers-sync";

const POPUP_OFFSET = 16;
// Flip to true for a Ben-Day halftone dot fill on cluster markers.
const CLUSTER_HALFTONE = false;
// Reserved on the left of the fitBounds padding. 0 today (the map is
// full-bleed); pass the sidebar's pixel width via the `leftInset` prop if one
// is added.
const FIT_PADDING = { top: 120, right: 64, bottom: 64, left: 64 };

type LocationProperties = {
  locationId: string;
  projectRef: string;
  locationState: "current" | "past";
  placement: string | null;
  title: string;
  year: number | null;
  venueName: string | null;
  city: string | null;
  thumb: string | null;
};

type Props = {
  /** One location per project — the pin each project gets on the map. */
  locations: MapLocation[];
  /** Earlier stops of the active project, revealed as hollow pins plus a route. */
  pastStops?: MapLocation[];
  activeProjectId?: string | null;
  hoveredProjectId?: string | null;
  onActiveProjectChange?: (id: string | null) => void;
  /** Fires on every pan/zoom with the projects whose pin is in view. */
  onVisibleProjectsChange?: (ids: string[]) => void;
  /** Bump to re-frame every pin. */
  fitSignal?: number;
  className?: string;
  leftInset?: number;
};

function locationProps(loc: MapLocation): LocationProperties {
  return {
    locationId: loc._id,
    projectRef: loc.project._id,
    locationState: loc.locationState,
    placement: loc.project.placement ?? null,
    title: loc.project.title,
    year: loc.year ?? null,
    venueName: loc.venueName ?? null,
    city: loc.city ?? null,
    thumb: loc.project.image ? urlFor(loc.project.image).width(120).height(120).fit("crop").url() : null,
  };
}

function toFeatureCollection(
  locations: MapLocation[]
): GeoJSON.FeatureCollection<GeoJSON.Point, LocationProperties> {
  return {
    type: "FeatureCollection",
    features: locations.map((loc) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [loc.geopoint.lng, loc.geopoint.lat] },
      properties: locationProps(loc),
    })),
  };
}

// ── Popup DOM builders ───────────────────────────────────────────────────────
// Built with real DOM nodes (not innerHTML) so CMS-authored text (project
// title, venue, city) is set via textContent — inherently safe against
// injecting markup, no manual escaping needed.

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function buildThumb(thumb: string | null, sizeClass: string): HTMLElement {
  if (thumb) {
    const img = el("img", `${sizeClass} object-cover rounded-[2px] shrink-0 bg-fg/10`);
    img.src = thumb;
    img.alt = "";
    return img;
  }
  return el("div", `${sizeClass} rounded-[2px] shrink-0 bg-fg/10`);
}

function locationSubtitle(props: LocationProperties): string {
  return [props.venueName || props.city, props.year != null ? String(props.year) : null]
    .filter(Boolean)
    .join(" · ");
}

function buildSingleLocationPopup(props: LocationProperties): HTMLElement {
  const card = el(
    "div",
    "flex items-start gap-3 bg-white border-2 border-fg shadow-[5px_5px_0_var(--fg)] rounded-[2px] p-3 max-w-[15rem]"
  );
  card.appendChild(buildThumb(props.thumb, "w-14 h-14"));

  const body = el("div", "min-w-0");
  const title = el("div", "font-body text-sm font-semibold text-fg leading-snug truncate");
  title.textContent = props.title;
  body.appendChild(title);

  const subParts = [locationSubtitle(props), props.locationState === "past" ? "Past" : null].filter(Boolean);
  if (subParts.length > 0) {
    const sub = el("div", "font-body text-xs text-fg/70 leading-snug");
    sub.textContent = subParts.join(" · ");
    body.appendChild(sub);
  }
  card.appendChild(body);
  return card;
}

function buildClusterRow(props: LocationProperties, onSelect: () => void): HTMLElement {
  const isPast = props.locationState === "past";
  const row = el(
    "button",
    "flex w-full items-center gap-3 p-3 text-left hover:bg-fg/5 border-b border-fg/10 last:border-b-0 cursor-pointer"
  );
  row.type = "button";
  row.appendChild(buildThumb(props.thumb, "w-10 h-10"));

  const body = el("div", "min-w-0 flex-1");
  const title = el("div", "font-body text-sm font-semibold text-fg leading-snug truncate");
  title.textContent = props.title;
  body.appendChild(title);

  const subParts = [locationSubtitle(props), isPast ? "Past" : null].filter(Boolean);
  if (subParts.length > 0) {
    const sub = el("div", "font-body text-xs text-fg/70 leading-snug");
    sub.textContent = subParts.join(" · ");
    body.appendChild(sub);
  }
  row.appendChild(body);
  row.addEventListener("click", onSelect);
  return row;
}

function buildClusterPopup(leaves: LocationProperties[], onSelect: (projectRef: string) => void): HTMLElement {
  const card = el(
    "div",
    "bg-white border-2 border-fg shadow-[5px_5px_0_var(--fg)] rounded-[2px] max-w-[17.5rem] max-h-[20rem] overflow-y-auto"
  );
  const header = el(
    "div",
    "sticky top-0 bg-white p-3 border-b border-fg/10 font-body text-xs font-semibold uppercase tracking-wide text-fg/60"
  );
  header.textContent = `${leaves.length} location${leaves.length === 1 ? "" : "s"} here`;
  card.appendChild(header);
  for (const props of leaves) {
    card.appendChild(buildClusterRow(props, () => onSelect(props.projectRef)));
  }
  return card;
}

// Frame every pin. Called on load, with the map's real container size known.
function fitToLocations(map: mapboxgl.Map, locations: MapLocation[], leftInset: number, animate = false) {
  if (locations.length === 0) return;
  const bounds = new mapboxgl.LngLatBounds();
  for (const loc of locations) bounds.extend([loc.geopoint.lng, loc.geopoint.lat]);
  map.fitBounds(bounds, {
    padding: { ...FIT_PADDING, left: FIT_PADDING.left + leftInset },
    maxZoom: 9,
    animate,
  });
}

function openPopup(
  map: mapboxgl.Map,
  popupRef: { current: mapboxgl.Popup | null },
  lngLat: mapboxgl.LngLatLike,
  content: HTMLElement,
  offset = POPUP_OFFSET
) {
  popupRef.current?.remove();
  popupRef.current = new mapboxgl.Popup({
    className: "lua-popup",
    closeButton: false,
    maxWidth: "none",
    offset,
  })
    .setLngLat(lngLat)
    .setDOMContent(content)
    .addTo(map);
}

// ── Marker DOM builders ──────────────────────────────────────────────────────
// Mapbox owns the marker element's transform, so the visible shape lives on an
// inner span. Singles are small squares, clusters are larger circles — the
// shapes differ on purpose so they read apart at a glance.

const HALFTONE =
  "radial-gradient(circle, var(--fg) 1.2px, transparent 1.6px) 0 0 / 6px 6px, var(--pink)";

// Pin states: solid pink = on view now; solid with a black dot = permanent
// install; hollow = not on view (last known stop, or an earlier stop of the
// selected project). Shape and fill carry the meaning, not just the hue.
function buildSingleMarker(props: LocationProperties): HTMLButtonElement {
  const hollow = props.locationState === "past";
  const permanent = !hollow && props.placement === "permanent";
  const btn = el("button", "block w-4 h-4 cursor-pointer p-0 border-0 bg-transparent");
  btn.type = "button";
  btn.setAttribute("aria-label", props.title);
  const shape = el(
    "span",
    `relative flex items-center justify-center w-full h-full rounded-[2px] shadow-[3px_3px_0_#000] transition-transform duration-150 ${
      hollow ? "bg-white border-[3px] border-pink" : "bg-pink border-2 border-black"
    }`
  );
  if (permanent) shape.appendChild(el("span", "block w-1.5 h-1.5 rounded-full bg-black"));
  btn.appendChild(shape);
  return btn;
}

function buildPastMarker(props: LocationProperties): HTMLButtonElement {
  const btn = el("button", "block w-3.5 h-3.5 cursor-pointer p-0 border-0 bg-transparent");
  btn.type = "button";
  btn.setAttribute("aria-label", `${props.title}, ${locationSubtitle(props)}`);
  btn.appendChild(
    el("span", "block w-full h-full bg-white border-[3px] border-pink rounded-[2px] shadow-[2px_2px_0_#000]")
  );
  return btn;
}

function buildClusterMarker(count: number, label: string): HTMLButtonElement {
  const size = count >= 30 ? 52 : count >= 10 ? 44 : 36;
  const btn = el("button", "block cursor-pointer p-0 border-0 bg-transparent");
  btn.type = "button";
  btn.style.width = btn.style.height = `${size}px`;
  btn.setAttribute("aria-label", `${count} locations`);
  const disc = el(
    "span",
    "flex w-full h-full items-center justify-center bg-pink border-2 border-black rounded-full shadow-[3px_3px_0_#000] font-heading text-sm font-bold text-black"
  );
  if (CLUSTER_HALFTONE) disc.style.background = HALFTONE;
  const num = el("span", CLUSTER_HALFTONE ? "bg-white px-1 rounded-full leading-tight" : "");
  num.textContent = label;
  disc.appendChild(num);
  btn.appendChild(disc);
  return btn;
}

type MarkerEntry = { marker: mapboxgl.Marker; el: HTMLElement; props?: LocationProperties };

const ROUTE_SOURCE = "active-route";
const ROUTE_LAYER = "active-route-line";

function chronological(locs: MapLocation[]): MapLocation[] {
  return [...locs].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
}

export default function ProjectMap({
  locations,
  pastStops,
  activeProjectId = null,
  hoveredProjectId = null,
  onActiveProjectChange,
  onVisibleProjectsChange,
  fitSignal = 0,
  className = "",
  leftInset = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupProjectRef = useRef<string | null>(null);
  const activeProjectRef = useRef<string | null>(null);
  const hoveredProjectRef = useRef<string | null>(null);
  const locationsRef = useRef(locations);
  const pastMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const readyRef = useRef(false);
  const applyAllRef = useRef<() => void>(() => {});
  const emitVisibleRef = useRef<() => void>(() => {});
  const revealRef = useRef<() => void>(() => {});
  const onActiveRef = useRef(onActiveProjectChange);
  const onVisibleRef = useRef(onVisibleProjectsChange);

  const [missingToken] = useState(() => !process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  useEffect(() => {
    onActiveRef.current = onActiveProjectChange;
    onVisibleRef.current = onVisibleProjectsChange;
  });

  useEffect(() => {
    if (missingToken || !containerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5, 39.8],
      zoom: 3,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    const markers = new Map<string, MarkerEntry>();

    // While a project is active, every other project's pins drop to 30%; the
    // hovered project's pin (from the sidebar list) swells.
    function applyMarkerState(entry: MarkerEntry) {
      const props = entry.props;
      if (!props) return;
      const active = activeProjectRef.current;
      const dimmed = active !== null && props.projectRef !== active;
      entry.el.style.opacity = dimmed ? "0.3" : "1";
      const shape = entry.el.firstElementChild as HTMLElement | null;
      if (shape) shape.style.transform = hoveredProjectRef.current === props.projectRef ? "scale(1.5)" : "";
    }
    applyAllRef.current = () => markers.forEach(applyMarkerState);

    function setActiveProject(projectRef: string | null) {
      activeProjectRef.current = projectRef;
      markers.forEach(applyMarkerState);
      onActiveRef.current?.(projectRef);
    }

    function openPopupAt(
      lngLat: mapboxgl.LngLatLike,
      content: HTMLElement,
      projectRef: string | null,
      offset = POPUP_OFFSET
    ) {
      popupProjectRef.current = projectRef;
      openPopup(map, popupRef, lngLat, content, offset);
    }

    function openCluster(clusterId: number, coordinates: [number, number], radius: number) {
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
      source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
        if (err || !leaves) return;
        const leafProps = leaves.map((leaf) => leaf.properties as LocationProperties);
        openPopupAt(
          coordinates,
          buildClusterPopup(leafProps, (projectRef) => {
            setActiveProject(activeProjectRef.current === projectRef ? null : projectRef);
          }),
          null,
          radius + POPUP_OFFSET
        );
      });
    }

    // Diff the markers on screen against the source's currently-visible
    // features (clusters re-form as you zoom/pan).
    function syncMarkers() {
      if (!map.isSourceLoaded(SOURCE_ID)) return;
      const seen = new Set<string>();
      for (const f of map.querySourceFeatures(SOURCE_ID)) {
        if (f.geometry.type !== "Point") continue;
        const p = (f.properties ?? {}) as Record<string, unknown>;
        const coords = f.geometry.coordinates as [number, number];
        const isCluster = p.cluster === true;
        const key = isCluster ? `c${p.cluster_id}:${p.point_count}` : `l${p.locationId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (markers.has(key)) continue;

        let node: HTMLButtonElement;
        let props: LocationProperties | undefined;
        if (isCluster) {
          const count = p.point_count as number;
          node = buildClusterMarker(count, String(p.point_count_abbreviated ?? count));
          const clusterId = p.cluster_id as number;
          node.addEventListener("click", (ev) => {
            ev.stopPropagation();
            openCluster(clusterId, coords, node.offsetWidth / 2);
          });
        } else {
          props = p as unknown as LocationProperties;
          node = buildSingleMarker(props);
          node.addEventListener("click", (ev) => {
            ev.stopPropagation();
            const next = activeProjectRef.current === props!.projectRef ? null : props!.projectRef;
            setActiveProject(next);
            openPopupAt(coords, buildSingleLocationPopup(props!), props!.projectRef);
          });
        }
        const entry: MarkerEntry = {
          marker: new mapboxgl.Marker({ element: node }).setLngLat(coords).addTo(map),
          el: node,
          props,
        };
        applyMarkerState(entry);
        markers.set(key, entry);
      }
      markers.forEach((entry, key) => {
        if (!seen.has(key)) {
          entry.marker.remove();
          markers.delete(key);
        }
      });
    }

    function emitVisible() {
      const bounds = map.getBounds();
      if (!bounds) return;
      const ids = locationsRef.current
        .filter((l) => bounds.contains([l.geopoint.lng, l.geopoint.lat]))
        .map((l) => l.project._id);
      onVisibleRef.current?.(ids);
    }
    emitVisibleRef.current = emitVisible;

    map.on("load", () => {
      fitToLocations(map, locationsRef.current, leftInset);
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(locationsRef.current),
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
        promoteId: "locationId",
      });

      map.addLayer({
        id: SYNC_LAYER,
        type: "circle",
        source: SOURCE_ID,
        paint: { "circle-radius": 1, "circle-opacity": 0 },
      });

      // Dashed route through the active project's stops, oldest to newest.
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: ROUTE_LAYER,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-cap": "round" },
        paint: { "line-color": "#111", "line-width": 1.5, "line-dasharray": [2, 2], "line-opacity": 0.55 },
      });

      map.on("render", syncMarkers);
      map.on("moveend", emitVisible);

      // Marker clicks stopPropagation, so any click that reaches the map is
      // on the background: clear the active project and close the popup.
      map.on("click", () => {
        setActiveProject(null);
        popupRef.current?.remove();
      });

      readyRef.current = true;
      emitVisible();
      revealRef.current();
    });

    return () => {
      readyRef.current = false;
      markers.forEach((entry) => entry.marker.remove());
      pastMarkersRef.current.forEach((m) => m.remove());
      pastMarkersRef.current = [];
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // Runs once on mount — `locations` updates flow through locationsRef (kept
    // current by the effect below) so the map/source aren't torn down and
    // rebuilt on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingToken]);

  useEffect(() => {
    locationsRef.current = locations;
    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(toFeatureCollection(locations));
    emitVisibleRef.current();
  }, [locations]);

  useEffect(() => {
    hoveredProjectRef.current = hoveredProjectId;
    applyAllRef.current();
  }, [hoveredProjectId]);

  // Reveal the active project's earlier stops: hollow pins, a dashed route,
  // and a camera move that frames the whole run. Selecting from the sidebar
  // and clicking a pin both land here.
  const lastFramedRef = useRef<string | null>(null);
  useEffect(() => {
    activeProjectRef.current = activeProjectId;
    applyAllRef.current();

    const reveal = () => {
      const map = mapRef.current;
      if (!map || !readyRef.current) return;

      pastMarkersRef.current.forEach((m) => m.remove());
      pastMarkersRef.current = [];

      const primary = activeProjectId
        ? locations.find((l) => l.project._id === activeProjectId)
        : undefined;
      const stops = primary ? chronological([...(pastStops ?? []), primary]) : [];

      const route = map.getSource(ROUTE_SOURCE) as mapboxgl.GeoJSONSource | undefined;
      route?.setData({
        type: "FeatureCollection",
        features:
          stops.length > 1
            ? [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: stops.map((s) => [s.geopoint.lng, s.geopoint.lat]),
                  },
                },
              ]
            : [],
      });

      for (const loc of pastStops ?? []) {
        const props = locationProps(loc);
        const node = buildPastMarker(props);
        const coords: [number, number] = [loc.geopoint.lng, loc.geopoint.lat];
        node.addEventListener("click", (ev) => {
          ev.stopPropagation();
          popupProjectRef.current = props.projectRef;
          openPopup(map, popupRef, coords, buildSingleLocationPopup(props));
        });
        pastMarkersRef.current.push(new mapboxgl.Marker({ element: node }).setLngLat(coords).addTo(map));
      }

      // Drop a popup that belongs to a different project than the selection.
      if (popupProjectRef.current !== activeProjectId) popupRef.current?.remove();

      if (!primary) {
        lastFramedRef.current = null;
        return;
      }
      if (lastFramedRef.current === activeProjectId) return;
      lastFramedRef.current = activeProjectId;

      if (stops.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        for (const s of stops) bounds.extend([s.geopoint.lng, s.geopoint.lat]);
        map.fitBounds(bounds, {
          padding: { ...FIT_PADDING, left: FIT_PADDING.left + leftInset },
          maxZoom: 9,
        });
      } else {
        map.easeTo({
          center: [primary.geopoint.lng, primary.geopoint.lat],
          zoom: Math.max(map.getZoom(), 5),
        });
      }
    };

    revealRef.current = reveal;
    reveal();
  }, [activeProjectId, pastStops, locations, leftInset]);

  useEffect(() => {
    if (fitSignal === 0) return;
    const map = mapRef.current;
    if (map && readyRef.current) fitToLocations(map, locationsRef.current, leftInset, true);
  }, [fitSignal, leftInset]);

  if (missingToken) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 ${className}`}>
        <p className="font-body text-sm text-fg/60">
          Map unavailable — missing NEXT_PUBLIC_MAPBOX_TOKEN.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
