import {
    WebGLWrapperOptions,
    RenderFunction,
    MakeMeshOptions,
    InitFunction,
    MakeTextureOptions,
    Make2DTextureOptions,
    Make3DTextureOptions,
    MakeSamplerOptions
} from "../@types/webgl-wrapper/index";
import Shader from "./shader";
import Program from "./program";
import Mesh from "./mesh";
import Texture from "./texture";
import Sampler from "./sampler";

export default class WebGLWrapper {
    private _onInit: InitFunction = null;
    private _onRender: RenderFunction = null;

    private _canvas: HTMLCanvasElement = null;
    private _glContext: WebGL2RenderingContext = null;

    private resolution: [number, number] = [0, 0];

    private _lastFrame: number = 0;

    private resizeCanvasToFitWindow: boolean = true;

    private _enableExtensions: string[] = [];

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

    private resizeCanvas(): void {
        this.resolution = [
            document.body.clientWidth,
            document.body.clientHeight
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
}
