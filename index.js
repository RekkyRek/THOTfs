const fs = require('fs')
const bits = require('@thi.ng/bitstream')

class THOTfs {
  constructor () {
    this.out = new bits.BitOutputStream()

    this.length = 0

    this.refs = {
      'BEGIN_TREE': 0x1,
      'BEGIN_STRING': 0x2,
      'BEGIN_NUMBER': 0x3,
      'BEGIN_BOOLEAN': 0x4,
      'END_VALUE': 0x5,
      'SEP_VALUE': 0x6,
      'END_TREE': 0x7
    }
  }

  write (input) {
    let lastChar = ''
    let data = input.split('')

    let readingString = false

    data.forEach(char => {
      if (lastChar !== '\\' && char === '"') {
        readingString = !readingString
        this.out.write(this.refs[readingString ? 'BEGIN_STRING' : 'END_VALUE'], 3)
        //console.log(`wrote ${readingString ? 'BEGIN_STRING' : 'END_VALUE'} to the bitstream`)
        lastChar = char
        return
      }

      if (readingString) {
        let charhex = char.charCodeAt(0).toString(16)

        this.out.write(char.charCodeAt(0), 8)

        //console.log(`wrote CHAR_${char.charCodeAt(0)} to the bitstream`)

        lastChar = char
        return
      }

      let toWrite
      if (char === '{') { toWrite = 'BEGIN_TREE' }
      if (char === ':') { toWrite = 'SEP_VALUE' }
      if (char === '}') { toWrite = 'END_TREE' }

      this.out.write(this.refs[toWrite], 3)

      //console.log(`wrote ${toWrite} to the bitstream`)
      lastChar = char
    })
  }
}

const tfs = new THOTfs()

const testData = JSON.stringify(require('./test.json'))
tfs.write(testData)

console.log([...tfs.out.reader()].join(''))

fs.writeFileSync('./helloworld.tfs', tfs.out.bytes(), { encoding: 'binary' })

let read = new bits.BitInputStream(fs.readFileSync('./helloworld.tfs'))
console.log([...read].join(''))



//let tree = huffman.tree('Hello, World!')
//let he = huffman.enc(tree, 'Hello, World!')
//console.log(`encoded 'Hello, World!' to ${he}`)
//let hd = huffman.dec(tree, he)
//console.log(`decoded ${he} to ${hd}`)

/* JSON Version */ let a = { "a": "\"b\"" }

// TFS Version
001          // { Begin Tree
  010        // " Begin String
    0101     // a Some Huffman Tree Location
    011      // " Huffman path for End Of String
  100        // : Sep. Value
  010        // " Begin String
    101      // \ Some Huffman Tree Location
    00101010 // " Some Huffman Tree Location
    1010     // b Some Huffman Tree Location
    101      // \ Some Huffman Tree Location
    00101010 // " Some Huffman Tree Location
    011      // " Huffman path for End Of String
111          // } End Tree
