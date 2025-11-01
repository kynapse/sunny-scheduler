import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // index("routes/home.tsx"),
    route("sunny-scheduler", "routes/sunny-scheduler.tsx"),
] satisfies RouteConfig;
