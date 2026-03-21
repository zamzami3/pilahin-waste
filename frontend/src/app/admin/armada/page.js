"use client"

import { useEffect, useMemo, useState } from "react"
import { Clipboard, Clock, MapPin, Truck, User } from "lucide-react"
import { getUsers } from "../../../lib/mockAuth"
import StyledSelect from "../../../components/StyledSelect"

const SIMULATED_LOCATIONS = [
  "Jl. Merdeka No.12, Kecamatan A",
  "Perumahan Melati Blok C3, Kecamatan B",
  "Pasar Induk Timur, Kecamatan C",
  "Jl. Anggrek Raya, Kecamatan D",
  "Kompleks Hijau Asri, Kecamatan E",
]

const PENDING_REPORTS_SEED = [
  {
    id: "RPT-901",
    area: "Kecamatan A",
    address: "Jl. Rajawali No.8",
    note: "Kontainer penuh sejak pagi",
  },
  {
    id: "RPT-902",
    area: "Kecamatan C",
    address: "Pasar Sentral Blok F",
    note: "Sampah menumpuk di belakang kios",
  },
  {
    id: "RPT-903",
    area: "Kecamatan D",
    address: "Perumahan Kenanga A12",
    note: "Laporan sampah penuh dari warga",
  },
]

function getFleetIndicator(status) {
  const normalized = String(status || "").toLowerCase()

  if (normalized === "tersedia" || normalized === "available") {
    return {
      label: "Tersedia",
      chipClass: "bg-emerald-100 text-emerald-700",
      dotClass: "bg-emerald-500",
    }
  }

  if (
    normalized === "sedang bertugas" ||
    normalized === "on-duty" ||
    normalized === "on duty"
  ) {
    return {
      label: "Sedang Bertugas",
      chipClass: "bg-amber-100 text-amber-700",
      dotClass: "bg-amber-500",
    }
  }

  return {
    label: "Servis/Off",
    chipClass: "bg-red-100 text-red-700",
    dotClass: "bg-red-500",
  }
}

function statusToFleetValue(rawStatus) {
  const normalized = String(rawStatus || "").toLowerCase()
  if (normalized === "on-duty" || normalized === "sedang bertugas") return "Sedang Bertugas"
  if (normalized === "off" || normalized === "servis/off") return "Servis/Off"
  return "Tersedia"
}

export default function AdminArmadaPage() {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [tasks, setTasks] = useState([])
  const [pendingReports, setPendingReports] = useState(PENDING_REPORTS_SEED)
  const [selectedDriverByReport, setSelectedDriverByReport] = useState({})
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    const allUsers = getUsers()
    const driverUsers = allUsers.filter((user) => String(user.role || "").toLowerCase() === "driver")

    const fallbackDrivers = [
      { id: "drv-fallback-1", name: "Driver Cadangan 1" },
      { id: "drv-fallback-2", name: "Driver Cadangan 2" },
      { id: "drv-fallback-3", name: "Driver Cadangan 3" },
    ]

    const baseDrivers = driverUsers.length > 0 ? driverUsers : fallbackDrivers

    const hydratedDrivers = baseDrivers.map((driver, index) => {
      const status = index % 3 === 0 ? "on-duty" : index % 3 === 1 ? "available" : "off"
      return {
        id: driver.id,
        name: driver.name,
        status,
        location: SIMULATED_LOCATIONS[index % SIMULATED_LOCATIONS.length],
      }
    })

    const hydratedVehicles = hydratedDrivers.map((driver, index) => {
      const type = index % 2 === 0 ? "Motor" : "Truk"
      return {
        id: `VH-${index + 1}`,
        plateNo: `B ${1200 + index} PLH`,
        vehicleType: type,
        driverId: driver.id,
        driverName: driver.name,
        fleetStatus: statusToFleetValue(driver.status),
      }
    })

    hydratedVehicles.push({
      id: "VH-SP-1",
      plateNo: "B 9987 PLH",
      vehicleType: "Truk",
      driverId: null,
      driverName: "Belum ditugaskan",
      fleetStatus: "Servis/Off",
    })

    const onProcessTasks = hydratedDrivers
      .filter((driver) => driver.status === "on-duty")
      .map((driver, index) => ({
        id: `TSK-${index + 41}`,
        area: `Kecamatan ${String.fromCharCode(65 + (index % 5))}`,
        address: SIMULATED_LOCATIONS[(index + 1) % SIMULATED_LOCATIONS.length],
        status: "On-Process",
        driverId: driver.id,
        driverName: driver.name,
      }))

    setDrivers(hydratedDrivers)
    setVehicles(hydratedVehicles)
    setTasks(onProcessTasks)
  }, [])

  const onDutyDrivers = useMemo(
    () => drivers.filter((driver) => driver.status === "on-duty"),
    [drivers]
  )

  const assignableDrivers = useMemo(
    () => drivers.filter((driver) => driver.status !== "off"),
    [drivers]
  )

  function assignTask(reportId) {
    const report = pendingReports.find((item) => item.id === reportId)
    if (!report) return

    const chosenDriverId = selectedDriverByReport[reportId] || assignableDrivers[0]?.id
    const chosenDriver = drivers.find((driver) => String(driver.id) === String(chosenDriverId))

    if (!chosenDriver) {
      setNotice({ type: "error", text: "Tidak ada driver yang bisa ditugaskan saat ini." })
      return
    }

    const newTask = {
      id: `TSK-${Date.now()}`,
      area: report.area,
      address: report.address,
      status: "On-Process",
      driverId: chosenDriver.id,
      driverName: chosenDriver.name,
    }

    setTasks((prev) => [newTask, ...prev])
    setPendingReports((prev) => prev.filter((item) => item.id !== reportId))
    setDrivers((prev) =>
      prev.map((driver) => {
        if (String(driver.id) !== String(chosenDriver.id)) return driver
        return {
          ...driver,
          status: "on-duty",
          location: `${report.address}, ${report.area}`,
        }
      })
    )

    setVehicles((prev) =>
      prev.map((vehicle) => {
        if (String(vehicle.driverId) !== String(chosenDriver.id)) return vehicle
        return { ...vehicle, fleetStatus: "Sedang Bertugas" }
      })
    )

    setNotice({
      type: "success",
      text: `Tugas ${report.id} berhasil di-assign ke ${chosenDriver.name}.`,
    })
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Armada</h1>
          <p className="mt-1 text-sm text-slate-300">
            Kontrol status driver, inventori kendaraan, dan progres tugas lapangan secara real-time.
          </p>
        </div>

        <div className="rounded-xl bg-white px-4 py-3 shadow border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2">Indikator Status</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Hijau: Tersedia
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Kuning: Sedang Bertugas
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Merah: Servis/Off
            </span>
          </div>
        </div>
      </header>

      {notice && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      <section className="mb-6 rounded-xl bg-white p-5 shadow border border-slate-100">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest-emerald">
          <User size={18} />
          Status Driver Aktif (On-Duty)
        </h2>

        {onDutyDrivers.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Tidak ada driver on-duty saat ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {onDutyDrivers.map((driver) => {
              const indicator = getFleetIndicator("on-duty")
              return (
                <div key={driver.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-forest-emerald">{driver.name}</p>
                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                        <MapPin size={15} className="mt-0.5 text-eco-green" />
                        <span>{driver.location}</span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${indicator.chipClass}`}>
                      <span className={`h-2 w-2 rounded-full ${indicator.dotClass}`} />
                      {indicator.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="mb-6 rounded-xl bg-white p-5 shadow border border-slate-100">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest-emerald">
          <Truck size={18} />
          Inventory Kendaraan
        </h2>

        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">No. Polisi</th>
                <th className="px-4 py-3 font-semibold">Jenis Kendaraan</th>
                <th className="px-4 py-3 font-semibold">Driver</th>
                <th className="px-4 py-3 font-semibold">Status Servis</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const indicator = getFleetIndicator(vehicle.fleetStatus)
                return (
                  <tr key={vehicle.id} className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-3 font-medium">{vehicle.plateNo}</td>
                    <td className="px-4 py-3">{vehicle.vehicleType}</td>
                    <td className="px-4 py-3">{vehicle.driverName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${indicator.chipClass}`}>
                        <span className={`h-2 w-2 rounded-full ${indicator.dotClass}`} />
                        {indicator.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow border border-slate-100">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest-emerald">
            <Clipboard size={18} />
            Monitor Tugas (On-Process)
          </h2>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Belum ada tugas on-process.
              </p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-forest-emerald">{task.id}</p>
                      <p className="mt-1 text-sm text-slate-600">{task.address}</p>
                      <p className="mt-1 text-sm text-slate-600">Area: {task.area}</p>
                      <p className="mt-2 text-sm text-slate-700">Driver: {task.driverName}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Clock size={13} />
                      On-Process
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow border border-slate-100">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest-emerald">
            <Clipboard size={18} />
            Assign Tugas Manual
          </h2>

          <div className="space-y-3">
            {pendingReports.length === 0 ? (
              <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Semua laporan sampah penuh sudah tertangani.
              </p>
            ) : (
              pendingReports.map((report) => (
                <div key={report.id} className="rounded-lg border border-slate-100 p-4">
                  <p className="font-semibold text-forest-emerald">{report.id} - {report.area}</p>
                  <p className="mt-1 text-sm text-slate-600">{report.address}</p>
                  <p className="mt-1 text-sm text-slate-600">{report.note}</p>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                    <StyledSelect
                      value={selectedDriverByReport[report.id] || ""}
                      onValueChange={(nextValue) =>
                        setSelectedDriverByReport((prev) => ({
                          ...prev,
                          [report.id]: nextValue,
                        }))
                      }
                      options={assignableDrivers.map((driver) => ({
                        value: String(driver.id),
                        label: driver.name,
                      }))}
                      placeholder="Pilih Driver"
                      disabled={assignableDrivers.length === 0}
                    />

                    <button
                      type="button"
                      onClick={() => assignTask(report.id)}
                      disabled={assignableDrivers.length === 0}
                      className="rounded-md bg-eco-green px-4 py-2 text-sm font-semibold text-white hover:bg-forest-emerald disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Assign Tugas
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}