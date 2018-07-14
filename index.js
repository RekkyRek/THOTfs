const bits = require('@thi.ng/bitstream')

let out = new bits.BitOutputStream()

out.writeBit(0)
out.writeBit(1)
out.writeBit(0)
out.writeBit(0)
out.writeBit(1)

console.log([...out.reader()].join(''))
