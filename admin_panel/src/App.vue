<template>
    <v-app>
        <v-main style="min-height: 100vh">
            <router-view class="page-container" :key="currentRoute.fullPath" />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {} from "#/server/services/solar";

const currentRoute = useRoute();
</script>
