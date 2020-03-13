export default class Shader {
    private _handle: WebGLShader;
    private _type: GLenum;
    private _source: string;
    private _handleGenerated: boolean = false;
    private _isCompiled: boolean = false;
    private _hasCompilationError: boolean = false;
    private _isDeleted: boolean = false;

    constructor(
        public gl: WebGL2RenderingContext,
        shaderType: GLenum,
        shaderSource?: string | null
    ) {
        this._type = shaderType;
        if (shaderSource) {
            this._source = shaderSource;
        }
    }

    get handle(): WebGLShader {
        return this._handle;
    }
    get type(): GLenum {
        return this._type;
    }
    get source(): string {
        return this._source;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get isCompiled(): boolean {
        return this._isCompiled;
    }
    get hasCompilationError(): boolean {
        return this._hasCompilationError;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }

    generateHandle(): void {
        if (this._handleGenerated) {
            throw new Error("Handle has already been generated!");
        }
        if (this._isDeleted) {
            throw new Error("Shader has been deleted!");
        }
        this._handle = this.gl.createShader(this._type);
        this._handleGenerated = true;
    }

    attachSource(src?: string | null): void {
        if (this._isCompiled) {
            throw new Error(
                "Shader is already compiled, cannot attach source at this point!"
            );
        }
        if (this._isDeleted) {
            throw new Error("Shader has been deleted!");
        }

        if (src) {
            this._source = src;
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (this._source) {
            this.gl.shaderSource(this._handle, this._source);
        }
    }

    compile(): void {
        if (this._isCompiled) {
            throw new Error("Shader is already compiled!");
        }
        if (this._hasCompilationError) {
            throw new Error(
                "Shader compilation was requested previously, but failed with compilation error!"
            );
        }
        if (this._isDeleted) {
            throw new Error("Shader has been deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        this.gl.compileShader(this.handle);

        let compileStatus = this.gl.getShaderParameter(
            this._handle,
            this.gl.COMPILE_STATUS
        );
        if (compileStatus) {
            this._isCompiled = true;
            this._hasCompilationError = false;
        } else {
            this._isCompiled = false;
            this._hasCompilationError = true;
        }
    }

    delete(): void {
        if (this._isDeleted) {
            throw new Error("Shader is already deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        this.gl.deleteShader(this._handle);
        this._isDeleted = true;
    }

    getInfoLog(): string {
        if (this._isDeleted) {
            throw new Error("Shader has been deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        return this.gl.getShaderInfoLog(this._handle);
    }
}
