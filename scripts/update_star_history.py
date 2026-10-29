"""Render the project's public GitHub star history without third-party embeds."""
import datetime as dt
import html
import json
import math
import os
from pathlib import Path
import urllib.request

REPO = "Axion1-0/axion1-0.github.io"
ROOT = Path(__file__).resolve().parents[1]
UTC = dt.timezone.utc


def api(path):
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10"}
    if os.environ.get("GH_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GH_TOKEN"]
    request = urllib.request.Request("https://api.github.com" + path, headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def main():
    metadata = api("/repos/" + REPO)
    weeks = []
    for page in range(1, 101):
        batch = api(f"/repos/{REPO}/stargazers/history?per_page=30&page={page}")
        weeks.extend(batch)
        if len(batch) < 30:
            break
    count = api("/repos/" + REPO + "/stargazers/count")["count"]
    now = dt.datetime.now(UTC)
    created = dt.datetime.fromisoformat(metadata["created_at"].replace("Z", "+00:00"))
    days = sorted((week["week"] + i * 86400, n) for week in weeks for i, n in enumerate(week["days"]))
    points = [(created.timestamp(), 0)]
    cumulative = 0
    for stamp, number in days:
        end = dt.datetime.fromtimestamp(stamp, UTC) + dt.timedelta(days=1)
        if end < created or stamp > now.timestamp():
            continue
        cumulative += number
        points.append((min(end.timestamp(), now.timestamp()), cumulative))
    # The current official count remains authoritative, including unstars.
    points.append((now.timestamp(), count))
    points = sorted(dict(points).items())
    data = {"repository": REPO, "stars": count, "updated_at": now.isoformat(),
            "daily_points": [{"date": dt.datetime.fromtimestamp(t, UTC).isoformat(), "stars": n} for t, n in points]}
    (ROOT / "assets/star-history.json").write_text(json.dumps(data, indent=2) + "\n")

    width, height = 880, 390
    left, right, top, bottom = 64, 840, 100, 324
    start = points[0][0]
    end = max(now.timestamp(), start + 3600)
    ceiling = max(5, math.ceil(max(n for _, n in points) / 5) * 5)
    x = lambda t: left + (t - start) / (end - start) * (right - left)
    y = lambda n: bottom - n / ceiling * (bottom - top)
    path = "M " + " L ".join(f"{x(t):.1f} {y(n):.1f}" for t, n in points)
    grid = []
    for i in range(6):
        value = ceiling * i / 5
        row = y(value)
        grid.append(f'<path d="M{left} {row:.1f}H{right}" stroke="#e5e9e3"/><text x="48" y="{row+4:.1f}" text-anchor="end" fill="#69746d" font-size="12">{value:g}</text>')
    ticks = []
    for i in range(4):
        stamp = start + (end - start) * i / 3
        date = dt.datetime.fromtimestamp(stamp, UTC)
        label = date.strftime("%b %d") if end - start > 172800 else date.strftime("%b %d, %H:%M")
        ticks.append(f'<text x="{x(stamp):.1f}" y="350" text-anchor="middle" fill="#69746d" font-size="11">{label}</text>')
    dots = ''.join(f'<circle cx="{x(t):.1f}" cy="{y(n):.1f}" r="4" fill="#2358d4" stroke="white" stroke-width="2"/>' for t, n in points)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">Axion Star History</title><desc id="desc">{count} stars for {html.escape(REPO)}. Daily GitHub star history, updated {now.date()}.</desc>
<rect width="880" height="390" rx="12" fill="#f8f9f6"/>
<g font-family="Arial,Helvetica,sans-serif"><text x="32" y="40" fill="#19251e" font-size="22" font-weight="600">Star History</text>
<text x="32" y="65" fill="#69746d" font-size="12">{REPO}</text><text x="840" y="43" text-anchor="end" fill="#2358d4" font-size="20" font-weight="600">{count} stars</text>
{''.join(grid)}{''.join(ticks)}<path d="{path}" fill="none" stroke="#2358d4" stroke-width="3" stroke-linejoin="round"/>{dots}
<text x="64" y="378" fill="#69746d" font-size="10">Source: GitHub · Updated {now.date()} UTC</text></g></svg>'''
    (ROOT / "assets/star-history.svg").write_text(svg + "\n")
    print(f"Updated {REPO}: {count} stars")


if __name__ == "__main__":
    main()
