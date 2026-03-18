import { MapPin, ClipboardList, Navigation } from "lucide-react"
import { initialTasks } from "../initialTasks"

function distanceInKm(from, to) {
  const toRadians = (degree) => (degree * Math.PI) / 180
  const earthRadiusKm = 6371
  const deltaLat = toRadians(to.lat - from.lat)
  const deltaLng = toRadians(to.lng - from.lng)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function buildEfficientRoute(tasks) {
  if (!tasks.length) return []

  const remaining = [...tasks]
  const ordered = [remaining.shift()]

  while (remaining.length) {
    const lastStop = ordered[ordered.length - 1]
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    remaining.forEach((candidate, index) => {
      const candidateDistance = distanceInKm(lastStop, candidate)
      if (candidateDistance < nearestDistance) {
        nearestDistance = candidateDistance
        nearestIndex = index
      }
    })

    ordered.push(remaining.splice(nearestIndex, 1)[0])
  }

  return ordered
}

function buildMultiStopMapLink(routeStops) {
  if (!routeStops.length) return "https://www.google.com/maps"

  const origin = `${routeStops[0].lat},${routeStops[0].lng}`
  const destination = `${routeStops[routeStops.length - 1].lat},${routeStops[routeStops.length - 1].lng}`
  const waypoints = routeStops.slice(1, -1).map((stop) => `${stop.lat},${stop.lng}`).join("|")

  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "driving",
  })

  if (waypoints) {
    params.set("waypoints", waypoints)
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export default function DriverMapPage() {
  const routeStops = buildEfficientRoute(initialTasks)
  const mapCenter = routeStops[0] || { lat: -6.200392, lng: 106.816048 }
  const mapEmbedLink = `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=13&output=embed`
  const multiStopLink = buildMultiStopMapLink(routeStops)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-5">
      <header className="rounded-2xl border border-eco-green/20 bg-gradient-to-r from-mint-soft/60 to-white p-5">
        <div className="flex items-center gap-2 text-forest-emerald">
          <MapPin size={20} />
          <h1 className="text-2xl font-semibold">Peta Rute</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">Rute penjemputan harian berbasis data initialTasks dari dashboard driver.</p>
      </header>

      <section className="overflow-hidden rounded-xl border border-eco-green/20 bg-white shadow-sm">
        <iframe
          title="Peta Rute Driver Pilahin"
          src={mapEmbedLink}
          className="h-72 w-full md:h-[380px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-forest-emerald">
          <ClipboardList size={18} />
          <h2 className="text-lg font-semibold">Urutan Rute Efisien</h2>
        </div>

        <ol className="space-y-3">
          {routeStops.map((stop, index) => (
            <li key={stop.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-gray/40 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-eco-green text-xs font-semibold text-white">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-forest-emerald">{stop.name}</p>
                <p className="text-sm text-slate-600">{stop.address}</p>
                <p className="text-xs text-slate-500">Koordinat: {stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="pt-1">
        <a
          href={multiStopLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-eco-green px-4 py-3 text-sm font-semibold text-white hover:brightness-95 md:w-auto"
        >
          <Navigation size={16} />
          Mulai Navigasi Rute
        </a>
      </div>
    </div>
  )
}
