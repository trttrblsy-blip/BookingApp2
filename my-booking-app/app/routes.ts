import { type RouteConfig, route } from "@react-router/dev/routes";

export default [route("/","routes/login.tsx"), route("booking", "routes/booking.tsx")] satisfies RouteConfig;
