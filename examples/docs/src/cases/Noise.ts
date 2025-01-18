import { ctrl, type Props } from '@tsei/ctrl/src/index'
import glre from 'glre'

const fragment = /* CPP */ `
        precision highp float;
        uniform vec2 iResolution;

        float random (float x) {
                return fract(sin(x) * 1e4);
        }

        float random (vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float pattern(vec2 v, float t) {
                vec2 p = floor(v);
                return step(t, random(100. + p * .000001) + random(p.x) * 0.5);
        }
        void main() {
                vec2 uv = fract(gl_FragCoord.xy / iResolution);
                vec3 c = vec3(random(uv));
                gl_FragColor = vec4(c, 1);
        }
`

const draw = () => {
        requestAnimationFrame(draw)
        glre.render()
        glre.clear()
        glre.viewport()
        glre.drawArrays()
}

const ref = (el: HTMLCanvasElement) => {
        const gl = el.getContext('webgl2')
        glre({ el, gl, fragment })
        glre.init()
        glre.resize()
        draw()
}

const Noise = (props: Props<'canvas'>) => {
        return ctrl.create('canvas', { ...props, ref })
}

export default Noise
