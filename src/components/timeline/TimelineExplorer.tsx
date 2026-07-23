import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ExternalLink, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Note = {
  text: string;
  tone: 'yellow' | 'blue' | 'coral' | 'green';
  placement: 'inner' | 'outer' | 'media';
};

type MapMedia = {
  kind: 'map';
  coordinates: [number, number];
  zoom: number;
  label: string;
};

type RouteMedia = {
  kind: 'route';
  coordinates: Array<[number, number]>;
  label: string;
};

type ImageMedia = {
  kind: 'image';
  src: string;
  alt: string;
  caption?: string;
};

type VideoMedia = {
  kind: 'video';
  src: string;
  poster?: string;
  caption?: string;
};

type TimelineItem = {
  id: string;
  title: string;
  organization?: string;
  startDate: string;
  kind: 'work' | 'education' | 'project' | 'travel' | 'life';
  location: {
    label: string;
    coordinates?: [number, number];
  };
  media: MapMedia | RouteMedia | ImageMedia | VideoMedia;
  notes: Note[];
  links: Array<{ label: string; url: string }>;
};

type Props = {
  items: TimelineItem[];
};

function StaticMap({ label }: { label: string }) {
  return (
    <div className="map-fallback">
      <div className="map-fallback-grid" aria-hidden="true" />
      <span className="map-fallback-route" aria-hidden="true" />
      <span className="map-pin" aria-hidden="true">
        <MapPin size={18} />
      </span>
      <span className="map-label">{label}</span>
    </div>
  );
}

function InteractiveMap({ media, reducedMotion }: { media: MapMedia | RouteMedia; reducedMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let disposed = false;
    let map: import('maplibre-gl').Map | undefined;

    const initialize = async () => {
      const [maplibregl, { default: workerUrl }] = await Promise.all([
        import('maplibre-gl'),
        import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
      ]);
      if (disposed || !containerRef.current) return;

      maplibregl.setWorkerUrl(workerUrl);
      const center = media.kind === 'map' ? media.coordinates : media.coordinates[0];
      map = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center,
        zoom: media.kind === 'map' ? media.zoom : 4,
        attributionControl: false,
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        renderWorldCopies: false,
      });

      map.scrollZoom.disable();
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        if (!map || disposed) return;

        const accentColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--cp-accent')
          .trim();

        if (media.kind === 'map') {
          new maplibregl.Marker({ color: accentColor }).setLngLat(media.coordinates).addTo(map);
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: media.coordinates },
            },
          });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': accentColor,
              'line-width': 3,
              'line-opacity': 0.85,
            },
          });
          const bounds = media.coordinates.reduce(
            (currentBounds, coordinate) => currentBounds.extend(coordinate),
            new maplibregl.LngLatBounds(media.coordinates[0], media.coordinates[0]),
          );
          map.fitBounds(bounds, { padding: 32, duration: reducedMotion ? 0 : 500 });
        }
        setLoaded(true);
      });
    };

    void initialize();

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [media, reducedMotion]);

  return (
    <div className="interactive-map-shell">
      {!loaded && <StaticMap label={media.label} />}
      <div className="interactive-map" ref={containerRef} aria-hidden="true" />
    </div>
  );
}

function Media({ item, interactive = false }: { item: TimelineItem; interactive?: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  const media = item.media;

  if (media.kind === 'map' || media.kind === 'route') {
    return interactive ? (
      <InteractiveMap media={media} reducedMotion={reducedMotion} />
    ) : (
      <StaticMap label={media.label} />
    );
  }

  if (media.kind === 'image') {
    return <img src={media.src} alt={media.alt} loading="lazy" />;
  }

  return (
    <video controls muted playsInline preload="metadata" poster={media.poster}>
      <source src={media.src} />
    </video>
  );
}

function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
}

export default function TimelineExplorer({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const reducedMotion = Boolean(useReducedMotion());
  const activeItem = items.find(item => item.id === activeId) ?? items[0];
  const groups = items.reduce<Array<{ year: string; items: TimelineItem[] }>>((result, item) => {
    const year = String(new Date(item.startDate).getUTCFullYear());
    const existing = result.find(group => group.year === year);
    if (existing) existing.items.push(item);
    else result.push({ year, items: [item] });
    return result;
  }, []);

  if (!activeItem) return null;

  return (
    <div className="compact-timeline">
      <div className="timeline-groups">
        {groups.map(group => (
          <section className="timeline-year" aria-labelledby={`year-${group.year}`} key={group.year}>
            <h3 id={`year-${group.year}`}>{group.year}</h3>
            <div>
              {group.items.map(item => {
                const active = item.id === activeItem.id;
                return (
                  <div className="timeline-item" key={item.id}>
                    <button
                      type="button"
                      className="timeline-row"
                      aria-pressed={active}
                      aria-controls="timeline-preview"
                      onMouseEnter={() => setActiveId(item.id)}
                      onFocus={() => setActiveId(item.id)}
                      onClick={() => setActiveId(item.id)}>
                      <time dateTime={item.startDate}>{formatMonth(item.startDate)}</time>
                      <span>{item.title}</span>
                    </button>
                    {active && (
                      <div className="timeline-inline-preview">
                        <Media item={item} />
                        <p>{item.location.label}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="timeline-preview" id="timeline-preview" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}>
            <div className="timeline-preview-media">
              <Media item={activeItem} interactive />
            </div>
            <div className="timeline-preview-caption">
              <span>{activeItem.location.label}</span>
              {activeItem.links[0] && (
                <a href={activeItem.links[0].url} aria-label={`Visit ${activeItem.links[0].label}`}>
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}
            </div>
            {activeItem.notes.map(note => (
              <aside className={`timeline-note timeline-note-${note.tone}`} key={note.text}>
                {note.text}
              </aside>
            ))}
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}
