dice-roller
===========

Dice Rolling API

All rolls must follow the format below

http://en.wikipedia.org/wiki/Dice_notation

`AdX(kY)-LxCM`


- `A` - the number of dice to be rolled (default: 1)
- `d` - separator that stands for die or dice
- `X` - the number of face of each die
- `(kY)` - number of dice to keep from roll (optional)
- `-L` - take the lowest dice from all the rolls (optional)
- `-H` - take the highest dice from all the rolls (optional)
- `C` - the multiplier, must be a natural number (optional, default: 1)
- `B` - the modifier, must be an integer (optional, default: 0)

## Examples

4d6x10+3 "roll 4 6 sided dice, add together, multiply by 10 and add 3
