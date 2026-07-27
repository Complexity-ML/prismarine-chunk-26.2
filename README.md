# Prismarine Chunk 26.2

Independent Complexity-ML distribution of the Prismarine chunk codec with
Minecraft Java 26.2 support for GAME LAB.

| Package | Minecraft Java | Release |
| --- | --- | --- |
| `prismarine-chunk@1.40.0+complexity.26.2.0` | 26.2 | [`complexity-26.2.0`](https://github.com/Complexity-ML/prismarine-chunk-26.2/releases/tag/complexity-26.2.0) |

Minecraft 26.2 adds a fluid-state count to every chunk section. This
distribution reads and writes that field while preserving the historical Java
and Bedrock codecs inherited from upstream.

## Installation

```bash
npm install "https://github.com/Complexity-ML/prismarine-chunk-26.2/releases/download/complexity-26.2.0/prismarine-chunk-complexity-26.2.0.tgz"
```

## Usage

```js
const registry = require('prismarine-registry')('26.2')
const ChunkColumn = require('prismarine-chunk')(registry)
const { Vec3 } = require('vec3')

const chunk = new ChunkColumn()

for (let x = 0; x < 16;x++) {
  for (let z = 0; z < 16; z++) {
    chunk.setBlockType(new Vec3(x, 50, z), 2)
    for (let y = 0; y < 256; y++) {
      chunk.setSkyLight(new Vec3(x, y, z), 15)
    }
  }
}

console.log(JSON.stringify(chunk.getBlock(new Vec3(3,50,3)),null,2))
```

## Test data

### pc

Test data can be generated with [minecraftChunkDumper](https://github.com/PrismarineJS/minecraft-chunk-dumper).

Install it globally with `npm install minecraft-chunk-dumper -g` then run :

`minecraftChunkDumper saveChunks 1.20 "1_20" 10`

### bedrock

Run tests in [bedrock-provider](https://github.com/PrismarineJS/bedrock-provider/) (which loads chunks through a client as part of its tests) and copy the generated data from `fixtures/$version/pchunk` into `tests/bedrock_$version`.

For the version, copy one chunk column of `level_chunk` without caching, `level_chunk` with caching, `level_chunk CacheMissResponse`, `subchunk` without caching, `subchunk cached` and `subchunk CacheMissResponse` into the test/version folder.

Note: bedrock-provider tests network decoding and loading chunks from a save database. The tests in prismarine-chunk test other parts of the chunk API, such as
setting and getting block light, type, biome, entity and block entity data.

# API

## Chunk

#### Chunk(initData: { minY?: number, worldHeight?: number })

Build a new chunk. initData is only for 1.18+, and if not given or null the world will default to an old-style 0-256 world.

#### Chunk.initialize(iniFunc)

Initialize a chunk.
* `iniFunc` is a function(x,y,z) returning a prismarine-block.

That function is faster than iterating and calling the setBlock* manually. It is useful to generate a whole chunk and load a whole chunk.

#### Chunk.version

returns the version the chunk loader was called with

#### Chunk.section

returns ChunkSection class for version

#### Chunk.getBlock(pos)

Get the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

`.entity` will have entity NBT data for this block, if it exists

#### Chunk.setBlock(pos,block)

Set the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

Set `.entity` property with NBT data for this block to load block entity data for the block

#### Chunk.getBlockType(pos)

Get the block type at `pos`

#### Chunk.getBlockStateId(pos)

Get the block state id at `pos`

#### Chunk.getBlockData(pos)

Get the block data (metadata) at `pos`

#### Chunk.getBlockLight(pos)

Get the block light at `pos`

#### Chunk.getSkyLight(pos)

Get the block sky light at `pos`

#### Chunk.getBiome(pos)

Get the block biome id at `pos`

#### Chunk.getBiomeColor(pos)

Get the block biome color at `pos`. Does nothing for PC.

#### Chunk.setBlockStateId(pos, stateId)

Set the block type `stateId` at `pos`

#### Chunk.setBlockType(pos, id)

Set the block type `id` at `pos`

#### Chunk.setBlockData(pos, data)

Set the block `data` (metadata) at `pos`

#### Chunk.setBlockLight(pos, light)

Set the block `light` at `pos`

#### Chunk.setSkyLight(pos, light)

Set the block sky `light` at `pos`

#### Chunk.setBiome(pos, biome)

Set the block `biome` id at `pos`

#### Chunk.setBiomeColor(pos, biomeColor)

Set the block `biomeColor` at `pos`. Does nothing for PC.

#### Chunk.getBlockEntity(pos)

Returns the block entity data at position if it exists

#### Chunk.setBlockEntity(pos, nbt)

Sets block entity data at position

#### Chunk.loadBlockEntities(nbt)

Loads an array of NBT data into the chunk column

#### Chunk.toJson()

Returns the chunk as json

#### Chunk.fromJson(j)

Load chunk from json

#### Chunk.sections

Available for pc chunk implementation.
Array of y => section
Can be used to identify whether a section is empty or not (will be null if it's the case)
For version >= 1.9, contains a .palette property which contains all the stateId of this section, can be used to check quickly whether a given block
is in this section.

### pc

#### Chunk.getMask()

Return the chunk bitmap 0b0000_0000_0000_0000(0x0000) means no chunks are set while 0b1111_1111_1111_1111(0xFFFF) means all chunks are set

#### Chunk.dump()

Returns the chunk raw data

#### Chunk.load(data, bitmap = 0xFFFF, skyLightSent = true, fullChunk = true)

Load raw `data` into the chunk

#### Chunk.dumpLight()

Returns the chunk raw light data (starting from 1.14)

#### Chunk.loadLight(data, skyLightMask, blockLightMask, emptySkyLightMask = 0, emptyBlockLightMask = 0)

Load lights into the chunk (starting from 1.14)

#### Chunk.loadParsedLight (skyLight, blockLight, skyLightMask, blockLightMask, emptySkyLightMask, emptyBlockLightMask)

Load lights into the chunk (starting from 1.17)

#### Chunk.dumpBiomes()

Returns the biomes as an array (starting from 1.15)

#### Chunk.loadBiomes(biomes)

Load biomes into the chunk (starting from 1.15)

### bedrock

See [index.d.ts](https://github.com/Complexity-ML/prismarine-chunk-26.2/blob/main/types/index.d.ts)

## ChunkSection

### pc

#### static fromJson(j: any): ChunkSection
#### static sectionSize(skyLightSent?: boolean): number
#### constructor(skyLightSent?: boolean)
#### data: Buffer
#### toJson(): { type: "Buffer"; data: number[]; }
#### initialize(iniFunc: any): void
#### getBiomeColor(pos: Vec3): { r: number; g: number; b: number; }
#### setBiomeColor(pos: Vec3, r: number, g: number, b: number): void
#### getBlockStateId(pos: Vec3): number
#### getBlockType(pos: Vec3): number
#### getBlockData(pos: Vec3): number
#### getBlockLight(pos: Vec3): number
#### getSkyLight(pos: Vec3): number
#### setBlockStateId(pos: Vec3, stateId: number): void
#### setBlockType(pos: Vec3, id: number): void
#### setBlockData(pos: Vec3, data: Buffer): void
#### setBlockLight(pos: Vec3, light: number): void
#### setSkyLight(pos: Vec3, light: number): void
#### dump(): Buffer
#### load(data: Buffer, skyLightSent?: boolean): void

### bedrock

See [index.d.ts](https://github.com/Complexity-ML/prismarine-chunk-26.2/blob/main/types/index.d.ts)

#### compact()
Shrinks the size of the SubChunk if possible after setBlock operations are done

#### getPalette()

Returns a list of unique block states that make up the chunk section

## Validation

The complete codec suite passes 309 tests. A dedicated 26.2 regression test
verifies the extra fluid-count field, and the GAME LAB live test loaded 473
chunks from an official Minecraft Java 26.2 server.

## Maintenance

Open Minecraft 26.2 and GAME LAB issues or pull requests in this repository.

## Credits and license

Derived from
[PrismarineJS prismarine-chunk](https://github.com/PrismarineJS/prismarine-chunk).
The upstream history and contributor attribution are retained. Complexity-ML
maintains this 26.2 distribution independently and is not affiliated with
Mojang or Microsoft.

Licensed under the [MIT License](LICENSE).
