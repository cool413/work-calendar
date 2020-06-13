import Vue from "vue";
import VueRouter from "vue-router";
import AddTask from "../components/add-task";
import QueryTask from "../components/query-task";

Vue.use(VueRouter);

const routes = [
  { path: "*", redirect: "/" },
  {
    path: "/",
    alias: "/AddTask",
    name: "AddTask",
    component: AddTask
  },
  {
    path: "/about",
    name: "about",
    component: QueryTask
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
