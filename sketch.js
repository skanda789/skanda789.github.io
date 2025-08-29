// sketch.js（インスタンスモード）
(() => {
  const IMG_PATH = 'NASA_earth.png';
  const TILT_DEG = 23.4;

  new p5((p) => {
    let img;

    p.preload = () => {
      img = p.loadImage(IMG_PATH, () => console.log('texture loaded'), (e)=>console.warn('texture load failed', e));
    };

    p.setup = () => {
      const holder = document.getElementById('sketch-holder');
      const w = holder ? Math.max(320, holder.clientWidth) : p.windowWidth;
      const h = holder ? Math.max(280, Math.round(w * 0.56)) : p.windowHeight;

      p.pixelDensity(1);
      const cnv = p.createCanvas(w, h, p.WEBGL);
      if (holder) cnv.parent('sketch-holder');
      p.noStroke();
    };

    p.windowResized = () => {
      const holder = document.getElementById('sketch-holder');
      if (holder) {
        const w = Math.max(320, holder.clientWidth);
        const h = Math.max(280, Math.round(w * 0.56));
        p.resizeCanvas(w, h);
      } else {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      }
    };

    p.draw = () => {
      p.background(8,14,30);
      p.orbitControl(2, 1, 0.2);
      p.noLights();

      if (img && img.width > 0) {
        p.texture(img);
        p.textureWrap(p.CLAMP, p.CLAMP);
      } else {
        p.normalMaterial();
      }

      p.rotateZ(p.radians(TILT_DEG));
      p.sphere(Math.min(p.width, p.height) * 0.45, 64, 64);
    };
  }, 'sketch-holder'); // ← このIDの要素内に埋め込む
})();
