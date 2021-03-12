import {
    WebGLWrapper,
    Program,
    Mesh,
    Texture,
    Sampler,
    Mat4Type
} from "@me.bokov/webgl-wrapper";
import { vec3, mat4 } from "gl-matrix";

const VS = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec2 a_texCoords;
out vec2 v_texCoords;
uniform mat4 u_MVP;
void main() {
    gl_Position = u_MVP * vec4(a_pos, 1.0);
    v_texCoords = a_texCoords;
}
`;
const FS = `#version 300 es
precision mediump float;
in vec2 v_texCoords;
uniform sampler2D u_sampler;
out vec4 out_color;
void main() {
    out_color = texture(u_sampler, v_texCoords);
}
`;

class Camera {
    view: mat4 = mat4.create();
    projection: mat4 = mat4.create();
    position: vec3 = [0, 0, -1];
    direction: vec3 = [0, 0, 1];
    up: vec3 = [0, 1, 0];
    fovy: number = Math.PI / 3.0;
    near: number = 0.01;
    far: number = 150.0;

    update(aspect: number): void {
        mat4.perspective(
            this.projection,
            this.fovy,
            aspect,
            this.near,
            this.far
        );
        mat4.lookAt(
            this.view,
            this.position,
            vec3.add([0, 0, 0], this.position, this.direction),
            this.up
        );
    }
}

class App {
    private program: Program;
    private mesh: Mesh;
    private texture: Texture;
    private sampler: Sampler;
    private mvp: mat4 = mat4.create();
    private camera: Camera = new Camera();
    private timer: number = 0.0;

    constructor() {}

    setup(gl: WebGL2RenderingContext, ww: WebGLWrapper): void {
        this.program = ww.makeProgramFromShaders(
            ww.makeVertexShader(VS),
            ww.makeFragmentShader(FS),
            true
        );
        console.log(this.program);
        this.mesh = ww.makeMesh({
            primitive: gl.TRIANGLES,
            attributes: [
                { index: 0, length: 3, type: gl.FLOAT, normalized: false },
                { index: 1, length: 2, type: gl.FLOAT, normalized: false }
            ],
            indexed: true
        });
        this.mesh.uploadVertexData(
            // prettier-ignore
            new Float32Array([
                -0.5, 0.5, 0.0, 0.0, 0.0,
                0.5, 0.5, 1.0, 4.0, 0.0,
                -0.5, -0.5, 2.0, 4.0, 4.0,
                0.5, -0.5, 1.0, 0.0, 4.0
            ])
        );
        this.mesh.uploadIndexDataShort(new Uint16Array([0, 1, 2, 2, 3, 1]), 6);

        this.texture = ww.make2DTexture({
            width: 16,
            height: 16,
            pixelFormat: {
                internalFormat: gl.RGBA8,
                format: gl.RGBA,
                dataType: gl.UNSIGNED_BYTE
            }
        });
        let textureData = new Uint8Array(16 * 16 * 4);
        let ptr = 0;
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                textureData[ptr++] = (x * 16) % 255;
                textureData[ptr++] = (y * 16) % 255;
                textureData[ptr++] = (x * 6 + y * 6) % 255;
                textureData[ptr++] = 0xff;
            }
        }
        this.texture.uploadUnsignedByte(textureData);

        this.sampler = ww.makeSampler({
            properties: {
                minFilter: gl.NEAREST,
                magFilter: gl.NEAREST,
                wrapS: gl.REPEAT,
                wrapT: gl.REPEAT,
                wrapR: gl.REPEAT
            }
        });

        gl.enable(gl.DEPTH_TEST);
    }

    render(delta: number, gl: WebGL2RenderingContext): void {
        this.timer += delta;
        this.camera.position = [
            Math.cos(this.timer) * 2.5,
            0.0,
            Math.sin(this.timer) * 2.5
        ];
        vec3.set(this.camera.direction, 0, 0, 0);
        this.camera.direction = vec3.sub(
            this.camera.direction,
            [0, 0, 0],
            this.camera.position
        );
        vec3.normalize(this.camera.direction, this.camera.direction);
        this.camera.update(gl.canvas.width / gl.canvas.height);
        mat4.identity(this.mvp);
        mat4.mul(this.mvp, this.mvp, this.camera.projection);
        mat4.mul(this.mvp, this.mvp, this.camera.view);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.program.use();
        this.texture.bind(0);
        this.sampler.bind(0);
        this.program.setUniform("u_sampler", 0);
        this.program.setUniform("u_MVP", this.mvp);
        this.mesh.draw();
    }
}

var app: App = new App();

new WebGLWrapper("#canvas", {
    resizeCanvasToFitWindow: true,
    onInit: app.setup.bind(app),
    onRender: app.render.bind(app)
}).start();
