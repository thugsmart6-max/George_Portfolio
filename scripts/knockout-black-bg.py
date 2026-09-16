"""Flood-fill near-black backgrounds to transparency, keeping interior black shapes."""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def inspect(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    points = [
        (0, 0),
        (w // 2, h // 2),
        (w // 3, h // 2),
        (int(w * 0.62), int(h * 0.55)),
    ]
    samples = {f"{x},{y}": px[x, y] for x, y in points}
    opaque_black = 0
    for y in range(0, h, 8):
        for x in range(0, w, 8):
            r, g, b, a = px[x, y]
            if a > 10 and r <= 22 and g <= 22 and b <= 22:
                opaque_black += 1
    print(f"inspect {path.name}: {w}x{h} samples={samples} opaque_black~={opaque_black}")


def is_bg(pixel: tuple[int, int, int, int], thresh: int) -> bool:
    r, g, b, a = pixel
    if a == 0:
        return False
    return r <= thresh and g <= thresh and b <= thresh


def knockout(path: Path, thresh: int = 22) -> None:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    seeds = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (w // 2, h - 1),
        (0, h // 2),
        (w - 1, h // 2),
    ]
    for x, y in seeds:
        q.append((x, y))

    cleared = 0
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_bg(px[x, y], thresh):
            continue
        px[x, y] = (0, 0, 0, 0)
        cleared += 1
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    dest = path.with_name(path.stem + "-clear.png") if path.suffix.lower() == ".png" else path
    im.save(dest)
    print(f"knockout {path.relative_to(ROOT)} -> {dest.name} cleared={cleared}")


def main() -> None:
    inspect(ROOT / "public/images/logo/logo.png")
    inspect(ROOT / "public/images/Doodle/Doodle/Black Doodle/Untitled-2-01.png")
    inspect(ROOT / "public/images/Doodle/Doodle/White/For white-01.png")
    inspect(ROOT / "public/images/site-image/indian-money-removebg-preview.png")

    files = [
        ROOT / "public/images/logo/logo.png",
        ROOT / "public/images/logo/RKR-removebg-preview.png",
        ROOT / "public/company-logo/Rafzon.png",
        ROOT / "public/company-logo/RKR.png",
        ROOT / "public/company-logo/jaxpat.png",
        ROOT / "public/images/other-company-logo/Thanith Logo Final.png",
    ]
    for path in files:
        if path.exists():
            knockout(path)

    thanith_clear = ROOT / "public/images/other-company-logo/Thanith Logo Final-clear.png"
    thanith_dst = ROOT / "public/company-logo/thanith.png"
    src = thanith_clear if thanith_clear.exists() else ROOT / "public/images/other-company-logo/Thanith Logo Final.png"
    if src.exists():
        Image.open(src).save(thanith_dst)
        print(f"copied {thanith_dst.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
