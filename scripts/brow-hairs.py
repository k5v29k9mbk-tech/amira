import math, random
random.seed(1177)

# viewBox 0 0 520 190. Brow length ~440, body ~60 at its fullest: about 1:7,
# which is the proportion a groomed brow actually holds.

def spine(t):
    x = 42 + t * 436
    arch = math.sin(math.pi * (t ** 0.80)) ** 0.95
    y = 118 - 46 * arch + 30 * (t ** 4.0)
    return x, y

def half_up(t):
    if t < 0.10:
        return 14 + 18 * (t / 0.10)
    if t < 0.52:
        return 32
    return max(2.0, 32 * (1 - ((t - 0.52) / 0.48) ** 1.15))

def half_dn(t):
    if t < 0.10:
        return 14 + 14 * (t / 0.10)
    if t < 0.52:
        return 28
    return max(1.5, 28 * (1 - ((t - 0.52) / 0.48) ** 1.05))

def growth(t):
    x1, y1 = spine(max(0.0, t - 0.008))
    x2, y2 = spine(min(1.0, t + 0.008))
    base = math.atan2(y2 - y1, x2 - x1)
    if t < 0.15:
        lift = math.radians(-80 + 54 * (t / 0.15))
    elif t < 0.58:
        lift = math.radians(-26 + 20 * ((t - 0.15) / 0.43))
    else:
        lift = math.radians(-6 + 9 * ((t - 0.58) / 0.42))
    return base + lift

hairs = []
N = 150
for i in range(N):
    u = (i + 0.5) / N
    t = min(1.0, u ** 1.10)

    cx, cy = spine(t)
    up, dn = half_up(t), half_dn(t)

    r = random.random()
    across = -up * (r ** 0.8) if random.random() < 0.56 else dn * (r ** 0.85)

    sx = cx + random.uniform(-4, 4)
    sy = cy + across

    ang = growth(t) + math.radians(random.uniform(-7, 7))
    length = (up + dn) * random.uniform(0.42, 0.78) + 7

    ex = sx + math.cos(ang) * length
    ey = sy + math.sin(ang) * length

    mx, my = (sx + ex) / 2, (sy + ey) / 2
    bow = random.uniform(0.8, 2.6) * (1 if i % 2 else -1)
    bx = mx + math.cos(ang + math.pi / 2) * bow
    by = my + math.sin(ang + math.pi / 2) * bow

    hairs.append({
        "d": f"M{sx:.1f} {sy:.1f}Q{bx:.1f} {by:.1f} {ex:.1f} {ey:.1f}",
        "t": round(t, 3),
        "w": round(random.uniform(1.0, 2.0), 2),
    })

hairs.sort(key=lambda h: h["t"])
print("export const browHairs = [")
for h in hairs:
    print(f'  {{ d: "{h["d"]}", t: {h["t"]}, w: {h["w"]} }},')
print("] as const;")
