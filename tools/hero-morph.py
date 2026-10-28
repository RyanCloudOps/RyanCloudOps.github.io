# Linear loop whose last N frames morph (optical flow warp + blend) into frames 0..N-1, so the clip
# returns to the opening arms-crossed pose without a double image. Works on stacked colour/alpha frames.
import sys, os, glob, numpy as np, cv2
src, out, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
fr = sorted(glob.glob(f"{src}/[0-9]*.png")); L = len(fr)
os.makedirs(out, exist_ok=True)
ld = lambda p: cv2.imread(p, cv2.IMREAD_COLOR).astype(np.float32)
H = ld(fr[0]).shape[0] // 2
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
def gray(st):   # colour over mid grey so dark trousers and white shirt both have contrast
    c, a = st[:H], st[H:, :, :1] / 255
    return cv2.cvtColor((c + 128 * (1 - a)).clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
gx, gy = np.meshgrid(np.arange(st_w := ld(fr[0]).shape[1], dtype=np.float32), np.arange(H, dtype=np.float32))
def warp(st, f, t):
    mx, my = gx - t * f[..., 0], gy - t * f[..., 1]
    return np.concatenate([cv2.remap(st[:H], mx, my, cv2.INTER_LINEAR, borderValue=0),
                           cv2.remap(st[H:], mx, my, cv2.INTER_LINEAR, borderValue=0)], 0)
k = 0
for i in range(N, L):
    a = ld(fr[i]); j = i - (L - N)
    if j >= 0:
        b = ld(fr[j]); ga, gb = gray(a), gray(b)
        fab = dis.calc(ga, gb, None); fba = dis.calc(gb, ga, None)
        t = (j + 1) / (N + 1); t = t * t * (3 - 2 * t)
        a = warp(a, fab, t) * (1 - t) + warp(b, fba, 1 - t) * t
    cv2.imwrite(f"{out}/{k:04d}.png", a.round().clip(0, 255).astype(np.uint8), [cv2.IMWRITE_PNG_COMPRESSION, 1]); k += 1
print("out frames", k, "loop s", k / 24)
