import { PixelFormat, SamplingProperties } from "./types";
import glUtil from "./glUtil";

export default class Texture {
    private static DEFAULT_PIXEL_FORMAT: PixelFormat = {
        format: WebGL2RenderingContext.RGBA,
        internalFormat: WebGL2RenderingContext.RGBA8,
        dataType: WebGL2RenderingContext.UNSIGNED_BYTE
    };

    private static DEFAULT_SAMPLING_PROPERTIES: SamplingProperties = {
        minFilter: WebGL2RenderingContext.NEAREST,
        magFilter: WebGL2RenderingContext.NEAREST,
        wrapS: WebGL2RenderingContext.CLAMP_TO_EDGE,
        wrapT: WebGL2RenderingContext.CLAMP_TO_EDGE,
        wrapR: WebGL2RenderingContext.CLAMP_TO_EDGE
    };

    private static VALID_TARGETS: GLenum[] = [
        WebGL2RenderingContext.TEXTURE_2D,
        WebGL2RenderingContext.TEXTURE_3D
    ];

    private static TWO_DIMENSIONAL_TARGETS: GLenum[] = [
        WebGL2RenderingContext.TEXTURE_2D
    ];
    private static THREE_DIMENSIONAL_TARGETS: GLenum[] = [
        WebGL2RenderingContext.TEXTURE_3D
    ];

    private _handle: WebGLTexture;
    private _width: number;
    private _height: number;
    private _depth: number;
    private _handleGenerated: boolean = false;
    private _isDeleted: boolean = false;
    private _isStorageInitialized: boolean = false;

    private validateTarget(t: GLenum): boolean {
        return Texture.VALID_TARGETS.indexOf(t) >= 0;
    }

    constructor(
        public gl: WebGL2RenderingContext,
        size: [number, number, number?],
        private _target: GLenum,
        private _pixelFormat: PixelFormat = Texture.DEFAULT_PIXEL_FORMAT,
        private _samplingProperties: SamplingProperties = Texture.DEFAULT_SAMPLING_PROPERTIES
    ) {
        if (!this.validateTarget(_target)) {
            throw new Error(
                `${glUtil.nameOfGLEnum(_target)} is not a valid target!`
            );
        }
        this._width = size[0];
        this._height = size[1];
        if (size.length == 3) {
            this._depth = size[2];
        }
        if (!_pixelFormat) {
            this._pixelFormat = Texture.DEFAULT_PIXEL_FORMAT;
        }
        if (!_samplingProperties) {
            this._samplingProperties = Texture.DEFAULT_SAMPLING_PROPERTIES;
        }
    }

    get handle(): WebGLTexture {
        return this._handle;
    }
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    get depth(): number {
        return this._depth;
    }
    get pixelFormat(): PixelFormat {
        return this._pixelFormat;
    }
    get samplingProperties(): SamplingProperties {
        return this._samplingProperties;
    }
    get target(): GLenum {
        return this._target;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }
    get isStorageInitialized(): boolean {
        return this._isStorageInitialized;
    }

    private is2DTexture(): boolean {
        return Texture.TWO_DIMENSIONAL_TARGETS.indexOf(this._target) >= 0;
    }
    private is3DTexture(): boolean {
        return Texture.THREE_DIMENSIONAL_TARGETS.indexOf(this._target) >= 0;
    }

    generateHandle(): void {
        if (this._handleGenerated) {
            throw new Error("Handle is already generated");
        }
        if (this._isDeleted) {
            throw new Error("Texture has been deleted");
        }
        this._handle = this.gl.createTexture();
        this._handleGenerated = true;
    }

    private setSampling(): void {
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (this._isDeleted) {
            throw new Error("Texture has been deleted");
        }
        this.gl.bindTexture(this._target, this._handle);
        this.gl.texParameteri(
            this._target,
            this.gl.TEXTURE_MIN_FILTER,
            this._samplingProperties.minFilter
        );
        this.gl.texParameteri(
            this._target,
            this.gl.TEXTURE_MAG_FILTER,
            this._samplingProperties.magFilter
        );
        this.gl.texParameteri(
            this._target,
            this.gl.TEXTURE_WRAP_S,
            this._samplingProperties.wrapS
        );
        this.gl.texParameteri(
            this._target,
            this.gl.TEXTURE_WRAP_T,
            this._samplingProperties.wrapT
        );
        if (this.is3DTexture()) {
            this.gl.texParameteri(
                this._target,
                this.gl.TEXTURE_WRAP_R,
                this._samplingProperties.wrapR
            );
        }
    }

    createStorage(): void {
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (this._isDeleted) {
            throw new Error("Texture has been deleted");
        }
        if (this._isStorageInitialized) {
            throw new Error("Storage has already been initialized");
        }
        if (this.is2DTexture()) {
            this.gl.texStorage2D(
                this._target,
                1,
                this._pixelFormat.internalFormat,
                this._width,
                this._height
            );
        } else if (this.is3DTexture()) {
            this.gl.texStorage3D(
                this._target,
                1,
                this._pixelFormat.internalFormat,
                this._width,
                this._height,
                this._depth
            );
        } else {
            throw new Error(
                "Could not decide on how to create storage for texture"
            );
        }

        this.setSampling();
        this._isStorageInitialized = true;
    }

    delete(): void {
        if (!this._handleGenerated) {
            throw new Error(
                "Cannot delete texture before it has been initialized"
            );
        }
        if (this._isDeleted) {
            throw new Error("Texture has already been deleted");
        }
        this.gl.deleteTexture(this._handle);
        this._isDeleted = true;
    }

    bind(unit: number): void {
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (this._isDeleted) {
            throw new Error("Texture has been deleted");
        }
        if (!this._isStorageInitialized) {
            this.createStorage();
        }

        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this._target, this._handle);
    }

    private beforeUpload(): void {
        if (!this._handleGenerated) {
            this.generateHandle();
            console.log("Generating handle");
        }
        if (this._isDeleted) {
            throw new Error("Texture has been deleted");
        }
    }

    private upload2D(data: ArrayBufferView): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._handle);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this._pixelFormat.internalFormat,
            this._width,
            this._height,
            0,
            this._pixelFormat.format,
            this._pixelFormat.dataType,
            data
        );
        this.setSampling();
        this._isStorageInitialized = true;
    }

    private upload3D(data: ArrayBufferView): void {
        this.gl.bindTexture(this.gl.TEXTURE_3D, this._handle);
        this.gl.texImage3D(
            this.gl.TEXTURE_3D,
            0,
            this._pixelFormat.internalFormat,
            this._width,
            this._height,
            this._depth,
            0,
            this._pixelFormat.format,
            this._pixelFormat.dataType,
            data
        );
        this.setSampling();
        this._isStorageInitialized = true;
    }

    private performUpload(data: ArrayBufferView): void {
        if (this.is2DTexture()) {
            this.upload2D(data);
        } else if (this.is3DTexture()) {
            this.upload3D(data);
        } else {
            throw new Error("Could not decide on how to upload texture data");
        }
    }

    uploadFloat(data: Float32Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadInt(data: Int32Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadUnsignedInt(data: Uint32Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadShort(data: Int16Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadUnsignedShort(data: Uint16Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadByte(data: Int8Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
    uploadUnsignedByte(data: Uint8Array, format: PixelFormat = null): void {
        this.beforeUpload();
        if (format) {
            this._pixelFormat = format;
        }
        this.performUpload(data);
    }
}
