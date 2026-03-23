import { Outlet } from "react-router-dom";

type Props = {
  allowedRoles?: ("student" | "vendor" | "admin")[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
  return <Outlet />;
}
