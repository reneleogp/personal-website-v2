import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
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
  role?: string;
  startDate: string;
  dateLabel: string;
  kind: 'work' | 'education' | 'project' | 'travel' | 'life';
  summary: string;
  details: string[];
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
        <MapPin size={24} />
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
      const maplibregl = await import('maplibre-gl');
      if (disposed || !containerRef.current) return;

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
          new maplibregl.Marker({ color: accentColor })
            .setLngLat(media.coordinates)
            .addTo(map);
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
              'line-width': 4,
              'line-opacity': 0.9,
            },
          });
          const bounds = media.coordinates.reduce(
            (currentBounds, coordinate) => currentBounds.extend(coordinate),
            new maplibregl.LngLatBounds(media.coordinates[0], media.coordinates[0]),
          );
          map.fitBounds(bounds, { padding: 64, duration: reducedMotion ? 0 : 700 });
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
      <span className="map-location-label">
        <MapPin size={15} aria-hidden="true" />
        {media.label}
      </span>
    </div>
  );
}

function MediaPanel({ item, reducedMotion }: { item: TimelineItem; reducedMotion: boolean }) {
  const media = item.media;

  return (
    <div className="media-panel" id={`media-${item.id}`} aria-label={`Media for ${item.title}`}>
      {media.kind === 'map' || media.kind === 'route' ? (
        <InteractiveMap media={media} reducedMotion={reducedMotion} />
      ) : media.kind === 'image' ? (
        <figure>
          <img src={media.src} alt={media.alt} loading="lazy" />
          {media.caption && <figcaption>{media.caption}</figcaption>}
        </figure>
      ) : (
        <figure>
          <video controls muted playsInline preload="metadata" poster={media.poster}>
            <source src={media.src} />
          </video>
          {media.caption && <figcaption>{media.caption}</figcaption>}
        </figure>
      )}

      {item.notes
        .filter(note => note.placement === 'media')
        .map(note => (
          <aside className={`sticky-note sticky-note-${note.tone} sticky-note-media`} key={note.text}>
            {note.text}
          </aside>
        ))}
    </div>
  );
}

function TimelineEntry({
  item,
  active,
  onActivate,
  reducedMotion,
}: {
  item: TimelineItem;
  active: boolean;
  onActivate: (id: string) => void;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { margin: '-35% 0px -50% 0px' });

  useEffect(() => {
    if (isInView) onActivate(item.id);
  }, [isInView, item.id, onActivate]);

  return (
    <motion.article
      ref={ref}
      className="timeline-entry"
      data-active={active}
      initial={reducedMotion ? false : { opacity: 0.5, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      onMouseEnter={() => onActivate(item.id)}>
      <div className="timeline-rail" aria-hidden="true">
        <span className="timeline-dot" />
      </div>

      <div className="timeline-entry-body">
        <div className="timeline-meta">
          <time dateTime={item.startDate}>{item.dateLabel}</time>
          <span>{item.kind}</span>
        </div>
        <h3>
          <button
            type="button"
            aria-pressed={active}
            aria-controls={`media-${item.id}`}
            onClick={() => onActivate(item.id)}
            onFocus={() => onActivate(item.id)}>
            {item.title}
          </button>
        </h3>
        {(item.role || item.organization) && (
          <p className="timeline-role">
            {item.role}
            {item.role && item.organization && <span aria-hidden="true"> · </span>}
            {item.organization}
          </p>
        )}
        <p className="timeline-summary">{item.summary}</p>
        <p className="timeline-location">
          <MapPin size={15} aria-hidden="true" />
          {item.location.label}
        </p>

        <div className="timeline-mobile-media">
          <StaticMap label={item.location.label} />
        </div>

        {item.details.length > 0 && (
          <ul className="timeline-details">
            {item.details.map(detail => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        {item.notes
          .filter(note => note.placement !== 'media')
          .map(note => (
            <aside className={`sticky-note sticky-note-${note.tone}`} key={note.text}>
              {note.text}
            </aside>
          ))}

        {item.links.length > 0 && (
          <div className="timeline-links">
            {item.links.map(link => (
              <a href={link.url} key={link.url}>
                {link.label}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function TimelineExplorer({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const reducedMotion = Boolean(useReducedMotion());
  const activeItem = items.find(item => item.id === activeId) ?? items[0];

  if (!activeItem) return null;

  return (
    <div className="timeline-explorer">
      <div className="timeline-list">
        {items.map(item => (
          <TimelineEntry
            item={item}
            active={item.id === activeItem.id}
            onActivate={setActiveId}
            reducedMotion={reducedMotion}
            key={item.id}
          />
        ))}
      </div>

      <div className="timeline-stage-column">
        <div className="timeline-stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeItem.id}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.32 }}>
              <MediaPanel item={activeItem} reducedMotion={reducedMotion} />
            </motion.div>
          </AnimatePresence>
          <p className="stage-caption">
            <span>{activeItem.dateLabel}</span>
            {activeItem.title}
          </p>
        </div>
      </div>
    </div>
  );
}