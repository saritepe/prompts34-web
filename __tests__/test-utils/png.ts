const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export function readPngDimensions(buffer: Buffer) {
  if (buffer.length < 24) {
    throw new Error('PNG file is too small');
  }

  if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error('File is not a PNG');
  }

  if (buffer.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error('PNG file is missing an IHDR chunk');
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}
