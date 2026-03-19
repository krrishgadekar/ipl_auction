# Player Images Folder

Place player headshot images here. One file per player.

## Naming Convention

`{player-name-slug}.png`

The slug is the player's name:
- All **lowercase**
- Spaces → **hyphens**
- Dots removed (M.S. → ms)
- No special characters

## Examples

| Player Name       | File Name               |
|-------------------|-------------------------|
| Virat Kohli       | `virat-kohli.png`       |
| M.S. Dhoni        | `ms-dhoni.png`          |
| Jasprit Bumrah    | `jasprit-bumrah.png`    |
| Shubman Gill      | `shubman-gill.png`      |
| Arjun Tendulkar   | `arjun-tendulkar.png`   |
| Sunil Narine      | `sunil-narine.png`      |
| KL Rahul          | `kl-rahul.png`          |

## Image Requirements

- **Format**: PNG preferred (transparent backgrounds look best with the glow effect)
- **Orientation**: Portrait / full-body or chest-up
- **Background**: Transparent PNG gives the best result — the colored glow underlayer shows through
- **Resolution**: 400–600px wide is fine; Next.js will optimize automatically

## How it Works

Once you set `imageUrl: '/players/player-name.png'` in the player data,
the card uses **Next.js `<Image priority />`** which:
1. Starts loading the image as soon as the player data arrives
2. Has zero FOUC (flash of unstyled content)
3. The NEXT 2 players' images are also preloaded in the background via `<link rel=preload>`
   so by the time they are announced, the image is already in cache.

## Fallback

If a file is missing, the card gracefully shows the player's initial letter
in a glowing circle — grade-themed color.
