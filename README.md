# THOTfs - A smaller JSON.

## Goals
Store JSON in a smaller format using fewer bits to descriminate data and use Huffman coding to store strings in less bytes than unicode, ASCII, etc.

## Bits
|Bits | Meaning      |
|-----|--------------|
|001  | Begin Tree   |
|010  | Begin String |
|011  | End String   |
|100  | Sep. Value   |
|101  | Empty - fExp |
|110  | Empty - fExp |
|111  | End Tree     |