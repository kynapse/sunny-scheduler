import type { Route } from "./+types/home";
import { Scheduler } from "../scheduler/scheduler";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sunny Scheduler" },
    { name: "description", content: "Welcome to Sunny Scheduler!" },
  ];
}

export default function Home() {
  return <Scheduler />;
}
