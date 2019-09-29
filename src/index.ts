import { JupyterFrontEndPlugin } from "@jupyterlab/application";
import { ISettingRegistry } from "@jupyterlab/coreutils";
import { JSONExt, JSONObject } from "@phosphor/coreutils";
import { DisposableSet } from "@phosphor/disposable";

const plugin: JupyterFrontEndPlugin<void> = {
    id: "jupyterlab-file-glue",
    autoStart: true,
    requires: [
        ISettingRegistry,
    ],
    activate: async (app, settings: ISettingRegistry) => {
        const { docRegistry } = app;

        let mappings = new DisposableSet();

        async function pairMappings() {
            if (mappings != null) {
                mappings.dispose();
            }
            mappings = new DisposableSet();
            const { composite } = await settings.get("jupyterlab-file-glue:plugin", "mappings");
            if (JSONExt.isArray(composite)) {
                (composite as IMapping[]).map((mapping: IMapping) => {
                    const { extensions, mimeTypes, name, format } = mapping;
    
                    mappings.add(docRegistry.addFileType({
                        extensions: [...extensions],
                        mimeTypes: [...mimeTypes],
                        name,
                        fileFormat: format
                    }));
                })
            }
            console.log("Applied file glue!", composite);
        }

        await pairMappings();

        settings.pluginChanged.connect((_s, p) => {
            if (p === "jupyterlab-file-glue:plugin") {
                pairMappings().catch(console.error);
            }
        });
    }
}
export default plugin;

interface IMapping extends JSONObject {
    extensions: string[];
    mimeTypes: string[];
    name: string;
    format: "text" | "base64" | "json";
}