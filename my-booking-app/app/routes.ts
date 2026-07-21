import { type RouteConfig, prefix, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/login.tsx"),
  route("booking", "routes/booking.tsx"),
  route("admin", "routes/admin.tsx"),
  ...prefix("actions", [
    route("/addBooking", "routes/actions/addBooking.ts"),
    route("/addWorker", "routes/actions/addWorker.ts"),
    route("/addRoom", "routes/actions/addRoom.ts"),
  ]),
] satisfies RouteConfig;
