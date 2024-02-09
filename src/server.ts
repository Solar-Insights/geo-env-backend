import { PORT } from "@/config";
import app from "@/index";

app.listen(PORT, () => {
    console.log("server is now opened");
});
