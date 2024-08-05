import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetifyThemesAndComponents = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        sets: {
            fa,
            mdi
        }
    }
});

export default vuetifyThemesAndComponents;
