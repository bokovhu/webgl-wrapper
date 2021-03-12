export class Renderbuffer {
    private _handle: WebGLRenderbuffer;
    private _handleGenerated: boolean = false;
    private _storageGenerated: boolean = false;
    private _isDeleted: boolean = false;

    constructor(
        public gl: WebGL2RenderingContext,
        private _width: number,
        private _height: number,
        private _internalFormat: GLenum
    ) {}

    get handle(): WebGLRenderbuffer {
        return this._handle;
    }
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    get internalFormat(): GLenum {
        return this._internalFormat;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get storageGenerated(): boolean {
        return this._storageGenerated;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }

    generateHandle(): void {
        if (this._isDeleted) {
            throw new Error("Renderbuffer has been deleted");
        }
        if (this._handleGenerated) {
            throw new Error("Renderbuffer handle has already been generated");
        }
        this._handle = this.gl.createRenderbuffer();
        this._handleGenerated = true;
    }
    generateStorage(internalFormat: GLenum | null = null): void {
        if (this._isDeleted) {
            throw new Error("Renderbuffer has been deleted");
        }
        if (this._storageGenerated) {
            throw new Error("Renderbuffer storage has already been generated");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (internalFormat != null) {
            this._internalFormat = internalFormat;
        }
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._handle);
        this.gl.renderbufferStorage(
            this.gl.RENDERBUFFER,
            this._internalFormat,
            this._width,
            this._height
        );
        this._storageGenerated = true;
    }
    bind(): void {
        if (this._isDeleted) {
            throw new Error("Renderbuffer has been deleted");
        }
        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (!this._storageGenerated) {
            this.generateStorage();
        }
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._handle);
    }
    delete(): void {
        if (this._isDeleted) {
            throw new Error("Renderbuffer has already been deleted");
        }
        if (!this._handleGenerated) {
            throw new Error(
                "Cannot delete renderbuffer before it has been generated"
            );
        }

        this.gl.deleteRenderbuffer(this._handle);
        this._isDeleted = true;
    }
}
