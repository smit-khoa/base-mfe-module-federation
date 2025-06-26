import { createWebHistory, createRouter } from "vue-router";
// import App2 from "../components/Test1.vue";
// import App1 from "../components/Test2.vue";

// console.log(App1, App2);

// Import static để tránh dynamic chunks
const HomeApp = () => import("smit_gate_home/app");
const App2 = () => import("smit_gate_app_2/app");

const routes = [
  {
    path: "/",
    component: HomeApp,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/business",
    component: () => import("smit_gate_business/app"),
    meta: {
      title: "Business",
    },
  },
  {
    path: "/2",
    component: App2,
    meta: {
      title: "App 2",
    },
  },
  {
    path: "/shared",
    component: () => import("smit_gate_shared_dependency/app"),
    meta: {
      title: "Shared",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
