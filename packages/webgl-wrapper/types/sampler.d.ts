import { SamplingProperties } from "./types";
export default class Sampler {
    gl: WebGL2RenderingContext;
    private _properties;
    private static DEFAULT_SAMPLING_PROPERTIES;
    private _handle;
    private _handleGenerated;
    private _samplingPropertiesSet;
    private _isDeleted;
    constructor(gl: WebGL2RenderingContext, _properties?: SamplingProperties);
    get handle(): WebGLSampler;
    get properties(): SamplingProperties;
    get handleGenerated(): boolean;
    get isDeleted(): boolean;
    get samplingPropertiesSet(): boolean;
    generateHandle(): void;
    update(props?: SamplingProperties): void;
    bind(unit: number): void;
    delete(): void;
}
