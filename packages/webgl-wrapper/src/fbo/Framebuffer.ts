import { Texture } from "../texture";
import { glUtil } from "../util";
import { Renderbuffer } from "./Renderbuffer";

export class Framebuffer {
    private _handle: WebGLFramebuffer;

    private _handleGenerated: boolean = false;
    private _isComplete: boolean = false;
    private _isDeleted: boolean = false;

    constructor(
        public gl: WebGL2RenderingContext,
        private _width: number,
        private _height: number
    ) {}

    get handle(): WebGLFramebuffer {
        return this._handle;
    }
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get isComplete(): boolean {
        return this._isComplete;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }

    generateHandle(): void {
        if (this._isDeleted) {
            throw new Error("Framebuffer has been deleted");
        }
        if (this._handleGenerated) {
            throw new Error("Framebuffer handle has already been generated");
        }

        this._handle = this.gl.createFramebuffer();
        this._handleGenerated = true;
    }

    bind(target: GLenum = this.gl.FRAMEBUFFER, check: boolean = false): void {
        if (this._isDeleted) {
            throw new Error("Framebuffer has been deleted");
        }
        if (!this._handleGenerated) {
            this.generateHandle();
        }

        if (check) {
            if (!this.check(target)) {
                throw new Error(
                    "Framebuffer check failed! Framebuffer is incomplete!"
                );
            }
        }

        this.gl.bindFramebuffer(target, this._handle);
    }

    check(target: GLenum): boolean {
        if (this._isDeleted) {
            throw new Error("Framebuffer has been deleted");
        }
        if (!this._handleGenerated) {
            throw new Error(
                "Cannot check framebuffer status before it has been generated"
            );
        }

        this.gl.bindFramebuffer(target, this._handle);
        let status = this.gl.checkFramebufferStatus(target);

        if (status == this.gl.FRAMEBUFFER_COMPLETE) {
            this._isComplete = true;
            return true;
        }

        this._isComplete = false;
        return false;
    }

    applyViewport(): void {
        this.gl.viewport(0, 0, this._width, this._height);
    }

    private beforeAttach(): void {
        if (this._isDeleted) {
            throw new Error("Framebuffer has been deleted");
        }
        if (!this._handleGenerated) {
            this.generateHandle();
        }
    }

    attachColorTexture(index: number, texture: Texture): void {
        this.beforeAttach();
        if (texture.target != this.gl.TEXTURE_2D) {
            throw new Error("Cannot attach non-2D texture as color attachment");
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0 + index,
            texture.target,
            texture.handle,
            0
        );
    }

    attachColorTextureLayer(
        index: number,
        texture: Texture,
        layer: number
    ): void {
        this.beforeAttach();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferTextureLayer(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0 + index,
            texture.handle,
            0,
            layer
        );
    }

    attachColorRenderbuffer(index: number, renderbuffer: Renderbuffer): void {
        this.beforeAttach();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0 + index,
            this.gl.RENDERBUFFER,
            renderbuffer.handle
        );
    }

    attachDepthTexture(texture: Texture): void {
        this.beforeAttach();
        if (texture.target != this.gl.TEXTURE_2D) {
            throw new Error("Cannot attach non-2D texture as depth attachment");
        }
        // TODO: Check texture format and datatype
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_ATTACHMENT,
            texture.target,
            texture.handle,
            0
        );
    }

    attachDepthRenderbuffer(renderbuffer: Renderbuffer): void {
        this.beforeAttach();
        // TODO: Check renderbuffer internal format
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_ATTACHMENT,
            this.gl.RENDERBUFFER,
            renderbuffer.handle
        );
    }

    attachStencilTexture(texture: Texture): void {
        this.beforeAttach();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.STENCIL_ATTACHMENT,
            texture.target,
            texture.handle,
            0
        );
    }

    attachStencilRenderbuffer(renderbuffer: Renderbuffer): void {
        this.beforeAttach();
        // TODO: Check renderbuffer internal format
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,
            this.gl.STENCIL_ATTACHMENT,
            this.gl.RENDERBUFFER,
            renderbuffer.handle
        );
    }

    attachDepthStencilTexture(texture: Texture): void {
        this.beforeAttach();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_STENCIL_ATTACHMENT,
            texture.target,
            texture.handle,
            0
        );
    }

    attachDepthStencilRenderbuffer(renderbuffer: Renderbuffer): void {
        this.beforeAttach();
        // TODO: Check renderbuffer internal format
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._handle);
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_STENCIL_ATTACHMENT,
            this.gl.RENDERBUFFER,
            renderbuffer.handle
        );
    }

    delete(): void {
        if (this._isDeleted) {
            throw new Error("Framebuffer has already been deleted");
        }
        if (!this._handleGenerated) {
            throw new Error(
                "Cannot delete framebuffer before it has been generated"
            );
        }

        this.gl.deleteFramebuffer(this._handle);
        this._isDeleted = true;
    }
}
