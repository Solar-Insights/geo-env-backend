import { createRouter, createWebHistory } from "vue-router";
import { PageName, PageRoute } from "@/router/routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
    routes: [
        {
            path: PageRoute.HOME,
            name: PageName.HOME,
            component: () => import("@/pages/HomePage.vue"),
            beforeEnter: []
        },
    ]
});

export default router;
