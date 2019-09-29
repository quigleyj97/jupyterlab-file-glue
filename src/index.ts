import { JupyterFrontEndPlugin } from "@jupyterlab/application";

const plugin: JupyterFrontEndPlugin<void> = {
    id: "jupyterlab-file-glue",
    activate: (app) => {
        console.log("Initialized file glue!");
    }
}