# THOTfs - A smaller JSON.

## Goals
Store JSON in a smaller format using fewer bits to descriminate data and use Huffman coding to store strings in less bytes than unicode, ASCII, etc.

## Bits
|Bits | Meaning       |
|-----|---------------|
|001  | Begin Tree    |
|010  | Begin String  |
|011  | Begin Number  |
|100  | Begin Boolean |
|101  | End Vaule     |
|110  | Sep. Value    |
|111  | End Tree      |

