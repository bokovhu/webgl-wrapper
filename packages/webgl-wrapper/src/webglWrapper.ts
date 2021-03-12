import { DefaultFramebuffer, Framebuffer, Renderbuffer } from "./fbo";
import { Mesh, VertexAttribute } from "./mesh";
import { Program, Shader } from "./shader";
import { PixelFormat, Sampler, SamplingProperties, Texture } from "./texture";

export type RenderFunction = (
    delta: number,
    gl: WebGL2RenderingContext,
    ww?: WebGLWrapper
) => void;

export type InitFunction = (
    gl: WebGL2RenderingContext,
    ww?: WebGLWrapper
) => void;

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

class DefaultFramebufferImpl implements DefaultFramebuffer {
    constructor(
        private gl: WebGL2RenderingContext,
        private canvas: HTMLCanvasElement
    ) {}

    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }

    applyViewport(): void {
        this.gl.viewport(0, 0, this.width, this.height);
    }
    bind(target: GLenum = this.gl.FRAMEBUFFER) {
        this.gl.bindFramebuffer(target, null);
    }
}

export class WebGLWrapper {
    private _onInit: InitFunction = null;
    private _onRender: RenderFunction = null;

    private _canvas: HTMLCanvasElement = null;
    private _glContext: WebGL2RenderingContext = null;

    private resolution: [number, number] = [0, 0];

    private _lastFrame: number = 0;

    private resizeCanvasToFitWindow: boolean = true;

    private _enableExtensions: string[] = [];

    private _defaultFramebuffer: DefaultFramebuffer = null;

    constructor(private canvasSelector: string, options?: WebGLWrapperOptions) {
        if (options) {
            if (options.onRender) {
                this._onRender = options.onRender;
            }
            if (options.onInit) {
                this._onInit = options.onInit;
            }
            if ("resizeCanvasToFitWindow" in options) {
                this.resizeCanvasToFitWindow = options.resizeCanvasToFitWindow;
            }
            if ("extensions" in options) {
                if (options.extensions.colorBufferFloat) {
                    this._enableExtensions.push("EXT_color_buffer_float");
                }
                if (options.extensions.textureFloatLinear) {
                    this._enableExtensions.push("OES_texture_float_linear");
                }
                if (options.extensions.elementIndexUint) {
                }
            }
        }
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    get glContext(): WebGL2RenderingContext {
        return this._glContext;
    }
    get defaultFramebuffer(): DefaultFramebuffer {
        return this._defaultFramebuffer;
    }

    private resizeCanvas(): void {
        this.resolution = [
            document.body.clientWidth,
            document.body.clientHeight,
        ];

        this._canvas.width = this.resolution[0];
        this._canvas.height = this.resolution[1];

        this._glContext.viewport(0, 0, this.resolution[0], this.resolution[1]);
    }

    start(): void {
        this._canvas = document.querySelector(this.canvasSelector);
        this._glContext = this._canvas.getContext("webgl2");

        for (let ext in this._enableExtensions) {
            this._glContext.getExtension(ext);
        }

        this._defaultFramebuffer = new DefaultFramebufferImpl(
            this._glContext,
            this._canvas
        );

        this.resolution = [this._canvas.width, this._canvas.height];

        if (this.resizeCanvasToFitWindow) {
            this.resizeCanvas();
            document.body.onresize = this.resizeCanvas.bind(this);
        }

        if (this._onInit) {
            this._onInit(this._glContext, this);
        }

        this._lastFrame = Date.now();
        window.requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    private onAnimationFrame(): void {
        let now = Date.now();
        let delta = (now - this._lastFrame) / 1000.0;
        this._lastFrame = now;

        if (this._onRender) {
            this._onRender(delta, this._glContext, this);
        }

        window.requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    makeShader(shaderType: GLenum): Shader {
        return new Shader(this._glContext, shaderType);
    }

    makeVertexShader(shaderSource: string): Shader {
        let s = this.makeShader(this._glContext.VERTEX_SHADER);
        s.attachSource(shaderSource);
        s.compile();
        if (!s.isCompiled) {
            throw new Error(
                `Vertex shader compilation error: ${s.getInfoLog()}`
            );
        }

        return s;
    }

    makeFragmentShader(shaderSource: string): Shader {
        let s = this.makeShader(this._glContext.FRAGMENT_SHADER);
        s.attachSource(shaderSource);
        s.compile();
        if (!s.isCompiled) {
            throw new Error(
                `Fragment shader compilation error: ${s.getInfoLog()}`
            );
        }

        return s;
    }

    makeProgram(): Program {
        return new Program(this._glContext);
    }

    makeProgramFromShaders(
        vs: Shader,
        fs: Shader,
        validate: boolean = false
    ): Program {
        let p = this.makeProgram();
        p.attachShader(vs);
        p.attachShader(fs);

        p.link();
        if (!p.isLinked) {
            throw new Error(`Program could not be linked: ${p.getInfoLog()}`);
        }

        if (validate) {
            p.validate();
            if (!p.isValidated) {
                throw new Error(
                    `Program could not be validated: ${p.getInfoLog()}`
                );
            }
        }

        return p;
    }

    makeMesh(options: MakeMeshOptions = null): Mesh {
        let m = new Mesh(this._glContext);

        if (options) {
            m.setup(options.attributes, options.primitive, options.indexed);
        }

        return m;
    }

    makeTexture(options: MakeTextureOptions): Texture {
        let size: [number, number, number?] = [options.width, options.height];
        if ("depth" in options) {
            size.push(options.depth);
        }

        let tex = new Texture(
            this._glContext,
            size,
            options.target,
            options.pixelFormat,
            options.samplingProperties
        );
        tex.generateHandle();

        return tex;
    }

    make2DTexture(options: Make2DTextureOptions): Texture {
        let tex = new Texture(
            this._glContext,
            [options.width, options.height],
            this._glContext.TEXTURE_2D,
            options.pixelFormat,
            options.samplingProperties
        );

        tex.generateHandle();

        return tex;
    }

    make3DTexture(options: Make3DTextureOptions): Texture {
        let tex = new Texture(
            this._glContext,
            [options.width, options.height, options.depth],
            this._glContext.TEXTURE_3D,
            options.pixelFormat,
            options.samplingProperties
        );

        tex.generateHandle();

        return tex;
    }

    makeSampler(options: MakeSamplerOptions): Sampler {
        let samp = new Sampler(this._glContext, options.properties);

        samp.generateHandle();
        samp.update();

        return samp;
    }

    makeRenderbuffer(options: MakeRenderbufferOptions): Renderbuffer {
        let rb = new Renderbuffer(
            this._glContext,
            options.width,
            options.height,
            options.internalFormat
        );
        rb.generateHandle();
        rb.generateStorage();

        return rb;
    }

    makeFramebuffer(options: MakeFramebufferOptions): Framebuffer {
        let fb = new Framebuffer(
            this._glContext,
            options.width,
            options.height
        );

        fb.generateHandle();

        if (options.generatedRenderbuffers) {
            if (
                options.generatedRenderbuffers.generateDepthStencilRenderbuffer
            ) {
                let rb = this.makeRenderbuffer({
                    width: options.width,
                    height: options.height,
                    internalFormat: this._glContext.DEPTH_STENCIL,
                });
                fb.attachDepthStencilRenderbuffer(rb);
            } else {
                if (options.generatedRenderbuffers.generateDepthRenderbuffer) {
                    let rb = this.makeRenderbuffer({
                        width: options.width,
                        height: options.height,
                        internalFormat: this._glContext.DEPTH_COMPONENT16,
                    });
                    fb.attachDepthRenderbuffer(rb);
                }

                if (
                    options.generatedRenderbuffers.generateStencilRenderbuffer
                ) {
                    let rb = this.makeRenderbuffer({
                        width: options.width,
                        height: options.height,
                        internalFormat: this._glContext.STENCIL_INDEX8,
                    });
                    fb.attachStencilRenderbuffer(rb);
                }
            }
        }

        return fb;
    }
}
