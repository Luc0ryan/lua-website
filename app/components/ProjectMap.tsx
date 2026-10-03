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
  title: string;
  year: number | null;
  venueName: string | null;
  city: string | null;
  thumb: string | null;
};

type Props = { locations: MapLocation[]; className?: string; leftInset?: number };

function toFeatureCollection(
  locations: MapLocation[]
): GeoJSON.FeatureCollection<GeoJSON.Point, LocationProperties> {
  return {
    type: "FeatureCollection",
    features: locations.map((loc) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [loc.geopoint.lng, loc.geopoint.lat] },
      properties: {
        locationId: loc._id,
        projectRef: loc.project._id,
        locationState: loc.locationState,
        title: loc.project.title,
        year: loc.year ?? null,
        venueName: loc.venueName ?? null,
        city: loc.city ?? null,
        thumb: loc.project.image ? urlFor(loc.project.image).width(120).height(120).fit("crop").url() : null,
      },
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
function fitToLocations(map: mapboxgl.Map, locations: MapLocation[], leftInset: number) {
  if (locations.length === 0) return;
  const bounds = new mapboxgl.LngLatBounds();
  for (const loc of locations) bounds.extend([loc.geopoint.lng, loc.geopoint.lat]);
  map.fitBounds(bounds, {
    padding: { ...FIT_PADDING, left: FIT_PADDING.left + leftInset },
    maxZoom: 9,
    animate: false,
  });
}

// ── Marker DOM builders ──────────────────────────────────────────────────────
// Mapbox owns the marker element's transform, so the visible shape lives on an
// inner span. Singles are small squares, clusters are larger circles — the
// shapes differ on purpose so they read apart at a glance.

const HALFTONE =
  "radial-gradient(circle, var(--fg) 1.2px, transparent 1.6px) 0 0 / 6px 6px, var(--pink)";

function buildSingleMarker(props: LocationProperties): HTMLButtonElement {
  const btn = el("button", "block w-4 h-4 cursor-pointer p-0 border-0 bg-transparent");
  btn.type = "button";
  btn.setAttribute("aria-label", props.title);
  btn.appendChild(el("span", "block w-full h-full bg-pink border-2 border-black rounded-[2px] shadow-[3px_3px_0_#000]"));
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

export default function ProjectMap({ locations, className = "", leftInset = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const activeProjectRef = useRef<string | null>(null);
  const locationsRef = useRef(locations);

  const [missingToken] = useState(() => !process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

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
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const markers = new Map<string, MarkerEntry>();

    // Past locations are intentionally drawn at 55% (a state, not a bug);
    // while a project is active, every other project's pins drop to 30%.
    function applyMarkerState(entry: MarkerEntry) {
      const props = entry.props;
      if (!props) return;
      const active = activeProjectRef.current;
      const dimmed = active !== null && props.projectRef !== active;
      entry.el.style.opacity = dimmed ? "0.3" : props.locationState === "past" ? "0.55" : "1";
    }

    function setActiveProject(projectRef: string | null) {
      activeProjectRef.current = projectRef;
      markers.forEach(applyMarkerState);
    }

    function openPopupAt(lngLat: mapboxgl.LngLatLike, content: HTMLElement, offset = POPUP_OFFSET) {
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
            openPopupAt(coords, buildSingleLocationPopup(props!));
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

      map.on("render", syncMarkers);

      // Marker clicks stopPropagation, so any click that reaches the map is
      // on the background: clear the active project and close the popup.
      map.on("click", () => {
        setActiveProject(null);
        popupRef.current?.remove();
      });
    });

    return () => {
      markers.forEach((entry) => entry.marker.remove());
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
  }, [locations]);

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
