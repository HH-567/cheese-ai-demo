class QishiVoiceCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffers = [];
    this.offset = 0;
    this.finished = false;
    this.port.onmessage = () => {
      this.flush();
      this.finished = true;
      this.port.postMessage({ done: true });
    };
  }

  flush() {
    if (!this.offset) return;
    let strongest = this.buffers[0];
    let power = -1;
    for (const channel of this.buffers) {
      let sum = 0;
      let squareSum = 0;
      for (let index = 0; index < this.offset; index++) {
        const value = channel[index];
        sum += value;
        squareSum += value * value;
      }
      const variance = squareSum / this.offset - (sum / this.offset) ** 2;
      if (variance > power) {
        strongest = channel;
        power = variance;
      }
    }
    const samples = strongest.slice(0, this.offset);
    this.port.postMessage({ samples, level: Math.sqrt(Math.max(power, 0)) }, [samples.buffer]);
    this.offset = 0;
  }

  process(inputs) {
    if (this.finished) return false;
    const channels = inputs[0];
    if (!channels?.length) return true;
    if (this.buffers.length !== channels.length) {
      this.flush();
      this.buffers = channels.map(() => new Float32Array(4096));
    }
    for (let start = 0; start < channels[0].length;) {
      const length = Math.min(4096 - this.offset, channels[0].length - start);
      channels.forEach((channel, index) => this.buffers[index].set(channel.subarray(start, start + length), this.offset));
      start += length;
      this.offset += length;
      if (this.offset === 4096) this.flush();
    }
    return true;
  }
}

registerProcessor('qishi-voice-capture', QishiVoiceCapture);
