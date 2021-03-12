export default class Shader {
    gl: WebGL2RenderingContext;
    private _handle;
    private _type;
    private _source;
    private _handleGenerated;
    private _isCompiled;
    private _hasCompilationError;
    private _isDeleted;
    constructor(gl: WebGL2RenderingContext, shaderType: GLenum, shaderSource?: string | null);
    get handle(): WebGLShader;
    get type(): GLenum;
    get source(): string;
    get handleGenerated(): boolean;
    get isCompiled(): boolean;
    get hasCompilationError(): boolean;
    get isDeleted(): boolean;
    generateHandle(): void;
    attachSource(src?: string | null): void;
    compile(): void;
    delete(): void;
    getInfoLog(): string;
}
