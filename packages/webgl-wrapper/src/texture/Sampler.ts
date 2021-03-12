import { SamplingProperties } from "./SamplingProperties";

export class Sampler {
    private static DEFAULT_SAMPLING_PROPERTIES: SamplingProperties = {
        minFilter: WebGL2RenderingContext.NEAREST,
        magFilter: WebGL2RenderingContext.NEAREST,
        wrapS: WebGL2RenderingContext.CLAMP_TO_EDGE,
        wrapT: WebGL2RenderingContext.CLAMP_TO_EDGE,
        wrapR: WebGL2RenderingContext.CLAMP_TO_EDGE,
    };

    private _handle: WebGLSampler;
    private _handleGenerated: boolean = false;
    private _samplingPropertiesSet: boolean = false;
    private _isDeleted: boolean = false;

    constructor(
        public gl: WebGL2RenderingContext,
        private _properties: SamplingProperties = Sampler.DEFAULT_SAMPLING_PROPERTIES
    ) {
        if (!_properties) {
            this._properties = Sampler.DEFAULT_SAMPLING_PROPERTIES;
        }
    }

    get handle(): WebGLSampler {
        return this._handle;
    }
    get properties(): SamplingProperties {
        return this._properties;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }
    get samplingPropertiesSet(): boolean {
        return this._samplingPropertiesSet;
    }

    generateHandle(): void {
        if (this._handleGenerated) {
            throw new Error("Handle has already been generated");
        }
        if (this._isDeleted) {
            throw new Error("Sampler has been deleted");
        }
        this._handle = this.gl.createSampler();
        this._handleGenerated = true;
    }

    update(props: SamplingProperties = null): void {
        if (this._isDeleted) {
            throw new Error("Sampler has been deleted");
        }
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (props) {
            this._properties = props;
        }

        this.gl.samplerParameteri(
            this._handle,
            this.gl.TEXTURE_MIN_FILTER,
            this._properties.minFilter
        );
        this.gl.samplerParameteri(
            this._handle,
            this.gl.TEXTURE_MAG_FILTER,
            this._properties.minFilter
        );

        this.gl.samplerParameteri(
            this._handle,
            this.gl.TEXTURE_WRAP_S,
            this._properties.wrapS
        );
        this.gl.samplerParameteri(
            this._handle,
            this.gl.TEXTURE_WRAP_T,
            this._properties.wrapT
        );
        this.gl.samplerParameteri(
            this._handle,
            this.gl.TEXTURE_WRAP_R,
            this._properties.wrapR
        );

        this._samplingPropertiesSet = true;
    }

    bind(unit: number): void {
        if (this._isDeleted) {
            throw new Error("Sampler has been deleted");
        }
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (!this._samplingPropertiesSet) {
            this.update();
        }
        this.gl.bindSampler(unit, this._handle);
    }

    delete(): void {
        if (this._isDeleted) {
            throw new Error("Sampler has been deleted");
        }
        if (!this._handleGenerated) {
            throw new Error(
                "Cannot delete sampler before it has been generated"
            );
        }
        this.gl.deleteSampler(this._handle);
        this._isDeleted = true;
    }
}
