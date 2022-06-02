function arrayCopy(src, srcPos, dest, destPos, length) {
    for (let i = 0; i < length; i++) {
        dest[i + destPos] = src[i + srcPos]
    }
}

class ByteArrayInputStream {

    constructor(array) {
        const count = array.byteLength
        let pos = 0

        this.read = function (b, off = 0, len = b.byteLength) {
            if (pos >= count) {
                return -1
            }

            let avail = count - pos
            if (len > avail) {
                len = avail
            }
            if (len <= 0) {
                return 0
            }

            arrayCopy(array, pos, b, off, len)
            pos += len
            return len
        }

        this.readUByte = function () {
            return (pos < count) ? (array[pos++] & 0xff) : -1
        }

        this.readBytes = function (len) {
            let retLen = Math.min(this.available(), len)
            let ret = new Int8Array(retLen)
            this.read(ret)
            return ret
        }

        this.available = function () {
            return count - pos
        }

        this.reset = function () {
            pos = 0
        }
    }
}


class ByteArrayOutputStream {
    constructor(size = 32) {
        let buf = new Int8Array(size)
        let count = 0

        function ensureCapacity(minCapacity) {
            let oldCapacity = buf.length
            let minGrowth = minCapacity - oldCapacity
            if (minGrowth > 0) {
                let newBuf = new Int8Array(oldCapacity * 2)
                arrayCopy(buf, 0, newBuf, 0, buf.length)
                buf = newBuf
            }
        }

        this.writeByte = function (b) {
            ensureCapacity(count + 1)
            buf[count] = b
            count += 1
        }

        this.write = function (b, off = 0, len = b.byteLength) {
            ensureCapacity(count + len)
            arrayCopy(b, off, buf, count, len)
            count += len
        }

        this.reset = function () {
            count = 0
        }

        this.size = function () {
            return count
        }

        this.toByteArray = function () {
            let ret = new Int8Array(count)
            arrayCopy(buf, 0, ret, 0, count)
            return ret
        }
    }
}
