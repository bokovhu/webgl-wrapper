import { CubemapFaceID } from "../@types/webgl-wrapper";

class GLUtilImpl {

    private reverseGLEnumMap: { [key: number]: string } = {}

    constructor () {
        let glContext: any = WebGL2RenderingContext.prototype;
        Object.keys (WebGL2RenderingContext.prototype)
            .forEach (
                prop => {
                    if (/^[A-Z0-9_]+$/.test (prop)) {
                        this.reverseGLEnumMap [
                            glContext [prop]
                        ] = prop;
                    }
                }
            )
    }

    nameOfGLEnum(v: GLenum): string {
        return this.reverseGLEnumMap[v] || 'Unknown enum';
    }

    cubemapFaceIDValue (faceID: CubemapFaceID): GLenum {
        switch (faceID) {
            case "+x": return WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X;
            case "-x": return WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case "+y": return WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case "-y": return WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case "+z": return WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z;
            default: return WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        }
    }

}

if (!window.glUtil) {
    window.glUtil = new GLUtilImpl ();
}

export default window.glUtil;