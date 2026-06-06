/**
 * ParkingResultCard.jsx
 *
 * Renders a single parking result inline in the chat.
 * Reuses app CSS variables so it respects light/dark theme automatically.
 */

import { MapPin, IndianRupee, Car, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParkingResultCard({ parking }) {
  const distanceLabel =
    parking.distanceMetres != null
      ? parking.distanceMetres < 1000
        ? `${Math.round(parking.distanceMetres)} m`
        : `${(parking.distanceMetres / 1000).toFixed(1)} km`
      : null;

  return (
    <div
      style={{
        background: 'var(--app-surface)',
        border: '1px solid var(--app-border)',
        borderRadius: '10px',
        padding: '10px 12px',
        marginBottom: '8px',
        fontSize: '13px'
      }}
    >
      {/* Title + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 600, color: 'var(--app-text)', fontSize: '14px', lineHeight: 1.3 }}>
          {parking.title}
        </span>
        {parking.badge && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '20px',
              background: 'var(--brand-600, #2563eb)',
              color: '#fff',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {parking.badge}
          </span>
        )}
      </div>

      {/* Address */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--app-text-muted)' }}>
        <MapPin size={11} />
        <span style={{ fontSize: '12px' }}>{parking.address}</span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 8, color: 'var(--app-text-muted)', fontSize: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <IndianRupee size={11} />
          <strong style={{ color: 'var(--app-text)' }}>₹{parking.hourlyPrice}/hr</strong>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Car size={11} />
          {parking.availableSlots} slots free
        </span>
        {distanceLabel && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            📍 {distanceLabel}
          </span>
        )}
        {parking.rating != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={11} fill="currentColor" />
            {Number(parking.rating).toFixed(1)}
          </span>
        )}
      </div>

      {/* Amenities */}
      {parking.amenities?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {parking.amenities.map((a) => (
            <span
              key={a}
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'var(--app-surface-muted)',
                color: 'var(--app-text-muted)',
                border: '1px solid var(--app-border)',
                textTransform: 'capitalize'
              }}
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Book link */}
      <div style={{ marginTop: 8 }}>
        <Link
          to={`/parkings/${parking.id}`}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--brand-600, #2563eb)',
            textDecoration: 'none'
          }}
        >
          View & Book →
        </Link>
      </div>
    </div>
  );
}
