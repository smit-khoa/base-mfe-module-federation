import { createWebHistory, createRouter } from "vue-router";
// import App2 from "../components/Test1.vue";
// import App1 from "../components/Test2.vue";

// console.log(App1, App2);

// Import static để tránh dynamic chunks
const HomeApp = () => import("client_gate_home/app");
const App1 = () => import("client_gate_app_1/app");
const App2 = () => import("client_gate_app_2/app");

const routes = [
  {
    path: "/",
    component: HomeApp,
  },
  {
    path: "/1",
    component: App1,
  },
  {
    path: "/2",
    component: App2,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
