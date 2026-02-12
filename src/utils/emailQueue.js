// Simple serial email queue — only 1 email sends at a time

class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(emailFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ emailFn, resolve, reject });
      this._process();
    });
  }

  async _process() {
    if (this.processing) return;
    if (this.queue.length === 0) return;

    this.processing = true;
    const { emailFn, resolve, reject } = this.queue.shift();

    try {
      const result = await emailFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      this._process();
    }
  }
}

export const emailQueue = new EmailQueue();
