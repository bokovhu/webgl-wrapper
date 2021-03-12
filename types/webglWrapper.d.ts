import { DefaultFramebuffer, Framebuffer, Renderbuffer } from "./fbo";
import { Mesh, VertexAttribute } from "./mesh";
import { Program, Shader } from "./shader";
import { PixelFormat, Sampler, SamplingProperties, Texture } from "./texture";
export declare type RenderFunction = (delta: number, gl: WebGL2RenderingContext, ww?: WebGLWrapper) => void;
export declare type InitFunction = (gl: WebGL2RenderingContext, ww?: WebGLWrapper) => void;
export interface WebGLExtensionOptions {
    colorBufferFloat?: boolean | null;
    textureFloatLinear?: boolean | null;
    elementIndexUint?: boolean | null;
}
export interface WebGLWrapperOptions {
    onInit?: InitFunction | null;
    onRender?: RenderFunction | null;
    resizeCanvasToFitWindow?: boolean;
    extensions?: WebGLExtensionOptions | null;
}
export interface MakeMeshOptions {
    attributes: VertexAttribute[];
    primitive: GLenum;
    indexed: boolean;
}
export interface MakeTextureOptions {
    width: number;
    height: number;
    depth?: number;
    target: GLenum;
    pixelFormat?: PixelFormat;
    samplingProperties?: SamplingProperties;
}
export interface Make2DTextureOptions {
    width: number;
    height: number;
    pixelFormat?: PixelFormat;
    samplingProperties?: SamplingProperties;
}
export interface Make3DTextureOptions {
    width: number;
    height: number;
    depth: number;
    pixelFormat?: PixelFormat;
    samplingProperties?: SamplingProperties;
}
export interface MakeCubemapOptions {
    width: number;
    height: number;
    pixelFormat?: PixelFormat;
    samplingProperties?: SamplingProperties;
}
export interface MakeSamplerOptions {
    properties?: SamplingProperties;
}
export interface MakeRenderbufferOptions {
    width: number;
    height: number;
    internalFormat: GLenum;
}
export interface MakeGeneratedRenderbuffersOptions {
    generateDepthRenderbuffer?: boolean;
    generateStencilRenderbuffer?: boolean;
    generateDepthStencilRenderbuffer?: boolean;
}
export interface MakeFramebufferOptions {
    width: number;
    height: number;
    generatedRenderbuffers?: MakeGeneratedRenderbuffersOptions;
}
export declare class WebGLWrapper {
    private canvasSelector;
    private _onInit;
    private _onRender;
    private _canvas;
    private _glContext;
    private resolution;
    private _lastFrame;
    private resizeCanvasToFitWindow;
    private _enableExtensions;
    private _defaultFramebuffer;
    constructor(canvasSelector: string, options?: WebGLWrapperOptions);
    get canvas(): HTMLCanvasElement;
    get glContext(): WebGL2RenderingContext;
    get defaultFramebuffer(): DefaultFramebuffer;
    private resizeCanvas;
    start(): void;
    private onAnimationFrame;
    makeShader(shaderType: GLenum): Shader;
    makeVertexShader(shaderSource: string): Shader;
    makeFragmentShader(shaderSource: string): Shader;
    makeProgram(): Program;
    makeProgramFromShaders(vs: Shader, fs: Shader, validate?: boolean): Program;
    makeMesh(options?: MakeMeshOptions): Mesh;
    makeTexture(options: MakeTextureOptions): Texture;
    make2DTexture(options: Make2DTextureOptions): Texture;
    make3DTexture(options: Make3DTextureOptions): Texture;
    makeSampler(options: MakeSamplerOptions): Sampler;
    makeRenderbuffer(options: MakeRenderbufferOptions): Renderbuffer;
    makeFramebuffer(options: MakeFramebufferOptions): Framebuffer;
}
