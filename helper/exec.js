const ora = require('ora');
const chalk = require('chalk');
const _exec = require('child-process-promise').exec

module.exports = function exec(options) {
  return new ExecWorker(options).run()
}

class ExecWorker {
  constructor ({
    name,
    cmd,
    cmdOptions,
    limit = 3
  }) {
    this.name = chalk.blue(name);
    this.limit = limit;
    this.cmd = cmd;
    this.cmdOptions = cmdOptions;
    this.counter = 0;
    this.spinner = ora({
      test: `${this.name} running...`
    });
  }
  async run () {
    try {
      this.spinner.start();
      const result = await _exec(this.cmd, this.cmdOptions)
      this.spinner.succeed(`${this.name} finished!`);
      return result
    } catch (err) {
      if (this.isOverTimes()) {
        this.throwError(err);
      } else {
        await this.retry();
      }
    }
  }
  async retry () {
    this.counter++;
    this.spinner.text = chalk.yellow(`${this.name} retry, times: ${this.counter}`);
    await this.run();
  }
  throwError (err) {
    this.spinner.fail(`${this.name} throw some errors: \n\n  ${err.stderr.split('\n').join('\n  ')}`);
    throw err;
  }
  isOverTimes () {
    return this.counter === this.limit;
  }
}