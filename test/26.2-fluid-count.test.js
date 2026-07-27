/* global describe it */

const assert = require('assert')
const SmartBuffer = require('smart-buffer').SmartBuffer
const ChunkSection = require('../src/pc/common/PaletteChunkSection')

describe('pc 26.2 ChunkSection', () => {
  it('round-trips the fluid count before the block palette', () => {
    const section = new ChunkSection({
      hasFluidCount: true,
      fluidCount: 37,
      noSizePrefix: true,
      singleValue: 0,
      maxBitsPerBlock: 15
    })
    const writer = new SmartBuffer()

    section.write(writer)

    const encoded = writer.toBuffer()
    assert.strictEqual(encoded.readInt16BE(0), 0)
    assert.strictEqual(encoded.readInt16BE(2), 37)

    const decoded = ChunkSection.read(SmartBuffer.fromBuffer(encoded), 15, true, true)
    assert.strictEqual(decoded.fluidCount, 37)
    assert.strictEqual(decoded.hasFluidCount, true)
    assert.strictEqual(decoded.get({ x: 0, y: 0, z: 0 }), 0)
  })
})
