"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { urlFor } from "@/sanity/lib/image";
import type { MapLocation } from "@/sanity/lib/queries";

const SOURCE_ID = "locations";
const CLUSTER_LAYER = "clusters";
const CLUSTER_COUNT_LAYER = "cluster-count";
const POINT_LAYER = "unclustered-point";

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

type Props = { locations: MapLocation[]; className?: string };

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
    const sub = el("div", "font-body text-xs text-fg/60 leading-snug");
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
    "flex w-full items-center gap-3 p-3 text-left hover:bg-fg/5 border-b border-fg/10 last:border-b-0 cursor-pointer" +
      (isPast ? " opacity-60" : "")
  );
  row.type = "button";
  row.appendChild(buildThumb(props.thumb, "w-10 h-10"));

  const body = el("div", "min-w-0 flex-1");
  const title = el("div", "font-body text-sm font-semibold text-fg leading-snug truncate");
  title.textContent = props.title;
  body.appendChild(title);

  const subParts = [locationSubtitle(props), isPast ? "Past" : null].filter(Boolean);
  if (subParts.length > 0) {
    const sub = el("div", "font-body text-xs text-fg/60 leading-snug");
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

export default function ProjectMap({ locations, className = "" }: Props) {
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

    function applyHighlight(active: string | null) {
      for (const loc of locationsRef.current) {
        map.setFeatureState(
          { source: SOURCE_ID, id: loc._id },
          { dimmed: active !== null && loc.project._id !== active }
        );
      }
    }

    function setActiveProject(projectRef: string | null) {
      activeProjectRef.current = projectRef;
      applyHighlight(projectRef);
    }

    function openPopupAt(lngLat: mapboxgl.LngLatLike, content: HTMLElement) {
      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({ closeButton: false, offset: 12, maxWidth: "none" })
        .setLngLat(lngLat)
        .setDOMContent(content)
        .addTo(map);
    }

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(locationsRef.current),
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
        promoteId: "locationId",
      });

      map.addLayer({
        id: CLUSTER_LAYER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#DC738F", 10, "#C91F6E", 30, "#8A1650"],
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 30, 26],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: CLUSTER_COUNT_LAYER,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      const opacityExpr: mapboxgl.Expression = [
        "case",
        ["boolean", ["feature-state", "dimmed"], false],
        0.3,
        ["==", ["get", "locationState"], "past"],
        0.55,
        1,
      ];

      map.addLayer({
        id: POINT_LAYER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#DC738F",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": opacityExpr,
          "circle-stroke-opacity": opacityExpr,
        },
      });

      map.on("mouseenter", CLUSTER_LAYER, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", CLUSTER_LAYER, () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", POINT_LAYER, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", POINT_LAYER, () => (map.getCanvas().style.cursor = ""));

      map.on("click", POINT_LAYER, (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const props = feature.properties as LocationProperties;
        const next = activeProjectRef.current === props.projectRef ? null : props.projectRef;
        setActiveProject(next);
        openPopupAt(feature.geometry.coordinates as [number, number], buildSingleLocationPopup(props));
      });

      map.on("click", CLUSTER_LAYER, (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
        const coordinates = feature.geometry.coordinates as [number, number];
        source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
          if (err || !leaves) return;
          const leafProps = leaves.map((leaf) => leaf.properties as LocationProperties);
          openPopupAt(
            coordinates,
            buildClusterPopup(leafProps, (projectRef) => {
              const next = activeProjectRef.current === projectRef ? null : projectRef;
              setActiveProject(next);
            })
          );
        });
      });

      // Background click (nothing under the cursor) clears the active
      // project family and closes any open popup.
      map.on("click", (e) => {
        const hits = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER, POINT_LAYER] });
        if (hits.length === 0) {
          setActiveProject(null);
          popupRef.current?.remove();
        }
      });
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // Runs once on mount — `locations` updates flow through locationsRef (kept
    // current by the effect below) so the map/source aren't torn down and
    // rebuilt on every prop change.
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
