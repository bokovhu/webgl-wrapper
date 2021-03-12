export declare class Renderbuffer {
    gl: WebGL2RenderingContext;
    private _width;
    private _height;
    private _internalFormat;
    private _handle;
    private _handleGenerated;
    private _storageGenerated;
    private _isDeleted;
    constructor(gl: WebGL2RenderingContext, _width: number, _height: number, _internalFormat: GLenum);
    get handle(): WebGLRenderbuffer;
    get width(): number;
    get height(): number;
    get internalFormat(): GLenum;
    get handleGenerated(): boolean;
    get storageGenerated(): boolean;
    get isDeleted(): boolean;
    generateHandle(): void;
    generateStorage(internalFormat?: GLenum | null): void;
    bind(): void;
    delete(): void;
}
