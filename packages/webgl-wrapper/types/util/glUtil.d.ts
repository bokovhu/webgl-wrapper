import { CubemapFaceID } from "../types";
declare class GLUtil {
    private reverseGLEnumMap;
    constructor();
    nameOfGLEnum(v: GLenum): string;
    cubemapFaceIDValue(faceID: CubemapFaceID): GLenum;
}
declare global {
    interface Window {
        glUtil?: GLUtil;
    }
}
declare const _default: GLUtil;
export default _default;
