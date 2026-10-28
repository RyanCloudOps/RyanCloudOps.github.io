# Keys the source clip offline: crop/scale -> alpha from green dominance, despill, alpha choke ->
# stacked PNG frames (premultiplied colour on top, alpha below) + transparent poster
import sys, subprocess, os, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 640, 1080
os.makedirs(out, exist_ok=True)
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf",
    f"crop=816:1377:214:160,scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
n = 0
while True:
    buf = p.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    a = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.maximum(r, b)
    k = g - m
    al = np.clip((k - 35) / 50, 0, 1); al = 1 - al * al * (3 - 2 * al)
    # choke: pull the edge in ~1px so no green halo survives
    am = np.asarray(Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))).astype(np.float32) / 255
    al = np.minimum(al, (al + am) / 2)
    g = np.minimum(g, m + 4)   # despill
    c = np.stack([r, g, b], -1) * al[..., None]
    st = np.concatenate([c, np.repeat(al[..., None] * 255, 3, -1)], 0)
    Image.fromarray(st.clip(0, 255).astype(np.uint8)).save(f"{out}/{n:04d}.png", compress_level=1)
    if n == 0:
        rgba = np.dstack([np.stack([r, g, b], -1), al * 255]).clip(0, 255).astype(np.uint8)
        Image.fromarray(rgba, "RGBA").save(f"{out}/poster.webp", quality=90, method=6)
    n += 1
print("frames", n)
