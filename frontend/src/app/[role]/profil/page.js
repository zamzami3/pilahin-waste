import ProfileView from "../../../components/ProfileView"

function normalizeRole(role) {
  return ["warga", "driver", "admin"].includes(role) ? role : "warga"
}

export default function Page({ params }) {
  return <ProfileView routeRole={normalizeRole(params?.role)} />
}
