import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Clock, Car, Check } from 'lucide-react'
import styles from './VolunteerMap.module.css'

// Fix Leaflet's broken default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export const ORG = {
  name:    'Anna Seva Community Center',
  street:  '21100 Dulles Town Center, Ste 190',
  city:    'Dulles, VA 20166',
  hours:   'Monday to Sunday – 9 AM to 5 PM',
  parking: 'Free parking at Dulles Town Center',
  lat:  39.0196,
  lng: -77.4358,
}

// Custom SVG pin for org
const orgIcon = L.divIcon({
  className: '',
  iconSize:   [28, 36],
  iconAnchor: [14, 36],
  popupAnchor:[0, -36],
  html: `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
            fill="#c41230"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
})

// Custom dot for user location
const userIcon = L.divIcon({
  className: '',
  iconSize:   [20, 20],
  iconAnchor: [10, 10],
  popupAnchor:[0, -12],
  html: `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="#2563eb" stroke="white" stroke-width="2.5"/>
      <circle cx="10" cy="10" r="3.5" fill="white"/>
    </svg>`,
})

/** Auto-fits map to show all markers */
function AutoFit({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [56, 56], maxZoom: 15 })
    }
  }, [positions.length])
  return null
}

export default function VolunteerMap() {
  const [userPos,  setUserPos]  = useState(null)
  const [route,    setRoute]    = useState(null)   // [[lat,lng], ...]
  const [distance, setDistance] = useState(null)   // miles string
  const [duration, setDuration] = useState(null)   // minutes
  const [geoState, setGeoState] = useState('idle') // idle | loading | ok | denied | unsupported

  async function fetchRoute(userLat, userLng) {
    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${userLng},${userLat};${ORG.lng},${ORG.lat}` +
        `?overview=full&geometries=geojson`
      const res  = await fetch(url)
      const data = await res.json()
      if (data.routes?.[0]) {
        const r = data.routes[0]
        setRoute(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]))
        setDistance((r.distance / 1609.34).toFixed(1))
        setDuration(Math.round(r.duration / 60))
      }
    } catch {
      // Show markers without route on network error
    }
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setGeoState('unsupported')
      return
    }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserPos({ lat, lng })
        setGeoState('ok')
        fetchRoute(lat, lng)
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }

  const orgLatLng  = [ORG.lat, ORG.lng]
  const userLatLng = userPos ? [userPos.lat, userPos.lng] : null
  const allPositions = userLatLng ? [orgLatLng, userLatLng] : [orgLatLng]

  return (
    <div className={styles.wrapper}>

      {/* ── Address card ── */}
      <div className={styles.addressCard}>
        <div className={styles.addressIcon}><MapPin size={24} /></div>
        <div className={styles.addressBody}>
          <h3>{ORG.name}</h3>
          <p className={styles.street}>{ORG.street}</p>
          <p className={styles.city}>{ORG.city}</p>
          <div className={styles.addressMeta}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {ORG.hours}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Car size={14} /> {ORG.parking}</span>
          </div>
        </div>
        {distance && duration && (
          <div className={styles.distanceBadge}>
            <span className={styles.distNum}>{distance} mi</span>
            <span className={styles.distLabel}>~{duration} min drive</span>
          </div>
        )}
      </div>

      {/* ── Map ── */}
      <div className={styles.mapWrap}>
        <MapContainer
          center={orgLatLng}
          zoom={13}
          className={styles.map}
          zoomControl
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Org marker */}
          <Marker position={orgLatLng} icon={orgIcon}>
            <Popup>
              <strong>{ORG.name}</strong><br />
              {ORG.street}, {ORG.city}<br />
              <em>{ORG.hours}</em>
            </Popup>
          </Marker>

          {/* User marker */}
          {userLatLng && (
            <Marker position={userLatLng} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Driving route */}
          {route && (
            <Polyline
              positions={route}
              pathOptions={{ color: '#c41230', weight: 4, opacity: 0.85 }}
            />
          )}

          {/* Fit both markers in view */}
          {userLatLng && <AutoFit positions={allPositions} />}
        </MapContainer>

        {/* Locate button overlaid on map */}
        <button
          className={`${styles.locateBtn} ${geoState === 'ok' ? styles.locateDone : ''}`}
          onClick={handleLocate}
          disabled={geoState === 'loading' || geoState === 'ok'}
          title="Show my location"
        >
          {geoState === 'loading' ? (
            <span className={styles.spinner} />
          ) : geoState === 'ok' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={14} /> Located</span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
                <path d="M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M16.95 7.05l2.83-2.83M4.22 19.78l2.83-2.83"/>
              </svg>
              Show my location
            </>
          )}
        </button>

        {/* Status messages */}
        {geoState === 'denied' && (
          <div className={styles.geoMsg}>
            Location access was denied — showing organisation address only.
          </div>
        )}
        {geoState === 'unsupported' && (
          <div className={styles.geoMsg}>
            Geolocation is not supported by your browser.
          </div>
        )}
      </div>
    </div>
  )
}
