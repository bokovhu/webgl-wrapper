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

}

if (!window.glUtil) {
    window.glUtil = new GLUtilImpl ();
}

export default window.glUtil;