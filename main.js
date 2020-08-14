/* global createREGL, mat2, vec2 */

/* if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(res => console.log('service worker registered'))
      .catch(err => console.log('service worker not registered', err))
  })
} */

let x, y

document.addEventListener('mousemove', (event) => {
  x = event.clientX / window.innerWidth
  y = event.clientY / window.innerHeight
  // console.log(x, y)
})

const regl = createREGL()
const draw = regl({
  frag: `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    
    float mandelbrot(vec2 z, vec2 c, float maxIteration) {
      for(float i = 0.0; i < 1e3; i++) {
        if (i == maxIteration) break;
        float xx = z.x*z.x, yy = z.y*z.y, zz = xx + yy;
        if(zz > 16.0) return i - log2(log2(zz)) + 4.0;
        z = vec2(xx - yy, z.x*z.y*2.0) + c;
      }
    }
    
    uniform vec2 c;
    uniform float maxIteration;
    varying vec2 z;
    void main() {
      float m = mandelbrot(z, c, maxIteration);
      vec3 rgb = 0.5 + 0.5*cos(3.0 + 0.15*m + vec3(0.0, 0.6, 1.0));
      gl_FragColor = vec4(rgb, 1.0);
    }
  `,
  vert: `
    attribute vec2 position;
    uniform mat2 transform;
    varying vec2 z;
    void main() {
      z = transform * position;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,
  uniforms: {
    transform: ({ viewportWidth: w, viewportHeight: h }) => {
      return mat2.fromScaling([], [w / h, 1])
    },
    c: ({ time: t }) => {
      // const a = [-0.765, 0.153]
      const a = [(x - 0.5) * 2, (y - 0.5) * 2]
      // const b = [Math.sin(t / 5), Math.cos(t / 5)]
      const b = [0, 0]
      return vec2.scaleAndAdd([], a, b, 2e-2)
    },
    maxIteration: 1e3
  },
  attributes: {
    position: [1, 1, -1, 1, 1, -1, -1, -1]
  },
  primitive: 'triangle strip',
  count: 4
})

regl.frame(draw)
