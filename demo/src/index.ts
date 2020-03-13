import { WebGLWrapper, Program, Mesh, Texture, Sampler } from "webgl-wrapper";

const VS = `#version 300 es
precision mediump float;
layout(location = 0) in vec2 a_pos;
layout(location = 1) in vec2 a_texCoords;
out vec2 v_texCoords;
void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
    v_texCoords = a_texCoords;
}
`;
const FS = `#version 300 es
precision mediump float;
in vec2 v_texCoords;
uniform sampler2D u_sampler;
out vec4 out_color;
void main() {
    out_color = texture(u_sampler, v_texCoords) + vec4(0.5, 0.0, 0.0, 1.0);
}
`;

class App {
    private program: Program;
    private mesh: Mesh;
    private texture: Texture;
    private sampler: Sampler;

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
                { index: 0, length: 2, type: gl.FLOAT, normalized: false },
                { index: 1, length: 2, type: gl.FLOAT, normalized: false }
            ],
            indexed: true
        });
        this.mesh.uploadVertexData(
            // prettier-ignore
            new Float32Array([
                -0.5, 0.5, 0.0, 0.0,
                0.5, 0.5, 4.0, 0.0,
                -0.5, -0.5, 4.0, 4.0,
                0.5, -0.5, 0.0, 4.0
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
    }

    render(delta: number, gl: WebGL2RenderingContext): void {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.program.use();
        this.texture.bind(0);
        this.sampler.bind(0);
        this.program.setUniform("u_sampler", 0);
        this.mesh.draw();
    }
}

var app: App = new App();

new WebGLWrapper("#canvas", {
    resizeCanvasToFitWindow: true,
    onInit: app.setup.bind(app),
    onRender: app.render.bind(app)
}).start();
