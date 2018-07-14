let huffman = {
  tree: function (input) {
    // D=Frequency dictionary, T=tree, B=Branches, r=for first sort after repetition, a+b=register, l=r.length, m=mix, R=Tree output Array
    // build dictionary (D) and key table for sort order
    let frecTree = {}
    let tree = {}
    let branches = {}
    let firstSort = []
    let registerA
    let registerB
    let rLength
    let mix

    input.replace(/[\x00-\xff]/g, function (char) {
      if (!frecTree[char]) {
        firstSort.push(char)
        frecTree[char] = 1
      } else {
        frecTree[char]++
      }
    })

    // extract most used item
    rLength = firstSort.shift()

    // create balanced tree of the rest
    while (firstSort.sort(function (x, y) { return frecTree[x] - frecTree[y] }) && (registerA = firstSort.shift()) && (registerB = firstSort.shift())) {
      branches[mix = (registerB || '') + registerA] = [registerA.length > 1 ? branches[registerA] : registerA, registerB.length > 1 ? branches[registerB] : registerB]
      frecTree[mix] = (frecTree[registerB] || 0) + frecTree[registerA]
      firstSort.unshift(mix)
    }

    // create final Tree recursively
    (firstSort = function (D, m, l) {
      if (l == 1) { firstSort(D, m, 0) }
      if (D[l]) { if (typeof D[l] === 'string') { tree[D[l]] = m + l } else { firstSort(D[l], m + l, 1) } }
    })([rLength, branches[mix]], '', 1)

    // return length of tree in words (2bytes each character), tree, length of padding in bits and compressed data
    return tree
    // String.fromCharCode(treeOut.length) + treeOut.join('') + String.fromCharCode(8 - (mix = input.replace(/[\x00-\xff]/g, function (c) { return tree[c] })).length & 7) + mix.replace(/[01]{1,8}/g, function (x) { return String.fromCharCode(parseInt(('0000000' + x).substr(-8), 2)) })
  },
  encode: function (tree, data) {
    return data.replace(/[\x00-\xff]/g, function (c) { return tree[c] })
  },
  decode: function (tree, data) {
    let sortedTree = Object.keys(tree).map(function (key) {
      return { char: key, path: tree[key] }
    })

    sortedTree.sort(function (a, b) {
      // ASC  -> a.length - b.length
      // DESC -> b.length - a.length
      return b.path.length - a.path.length
    })


    let string = ''

    while (data.length > 0) {
      for (let i = 0; i < sortedTree.length; i++) {
        const length = sortedTree[i].path.length
        if (data.slice(0, length) === sortedTree[i].path) {
          string += sortedTree[i].char
          data = data.slice(length)
          continue
        }
      }
    }

    return string
  }
}

module.exports = huffman
