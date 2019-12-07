import { Compiler, Stats } from 'webpack';
import * as fs from 'fs';

class WatchWaiterWebpackPlugin {
    private outputDirectory: string | undefined;

    constructor(outputDirectory?: string) {
        this.outputDirectory = outputDirectory;

        this.apply = this.apply.bind(this);
        this.append = this.append.bind(this);
    }

    private append(data: string): void {
        const path = this.outputDirectory + '/.webpackWatchWaiter.txt';
        console.log('appending: ' + data);
        fs.appendFile(path, data, () => { });
    }
    private appendLine(data: string): void {
        this.append(data + '\n');
    }
    private watchRun(compiler: Compiler, arg: any): void {
        this.appendLine(String(compiler.hooks.watchRun.taps.length || ''));
        this.appendLine('watchRun');
    }
    private watchClose(arg: any): void {
        this.appendLine('watchRun');
    }
    private failed(error: Error, arg: any): void {
        this.appendLine('failed');
    }
    private additionalPass(arg: any): void {
        this.appendLine('additionalPass');
    }
    private done(stats: Stats, arg: any): void {
        this.appendLine('done. ' + stats.hasErrors() ? 'has errors' : 'has no errors');
    }
    private beforeRun(): void {
        this.appendLine('beforeRun');
    }
    private beforeCompile(): void {
        this.appendLine('beforeCompile');
    }
    private invalid(): void {
        this.appendLine('invalid');
    }
    apply(compiler: Compiler) {
        if (!compiler.options.output || !compiler.options.output.path) {
            // eslint-disable-next-line no-console
            console.warn(
                'clean-webpack-plugin: options.output.path not defined. Plugin disabled...',
            );

            return;
        }

        this.outputDirectory = compiler.options.output.path + '/' + this.outputDirectory;

        /**
         * webpack 4+ comes with a new plugin system.
         *
         * Check for hooks in-order to support old plugin system
         */
        const hooks = compiler.hooks;

        this.appendLine('original length: ' + compiler.hooks.watchRun.taps.length);

        if (hooks) {
            hooks.watchRun.tap('watchRun', this.watchRun.bind(this));
            hooks.watchClose.tap('watchClose', this.watchClose.bind(this));
            hooks.failed.tap('failed', this.failed.bind(this));
            hooks.additionalPass.tap('additionalPass', this.additionalPass.bind(this));
            hooks.done.tap('done', this.done.bind(this));
            hooks.beforeRun.tap('beforeRun', this.beforeRun.bind(this));
            hooks.beforeCompile.tap('beforeCompile', this.beforeCompile.bind(this));
            hooks.invalid.tap('invalid', this.invalid.bind(this));
            hooks.entryOption
        }
        else {
            compiler.plugin('watchRun', this.watchRun.bind(this));
            compiler.plugin('watchClose', this.watchClose.bind(this));
            compiler.plugin('failed', this.failed.bind(this));
            compiler.plugin('additionalPass', this.additionalPass.bind(this));
            compiler.plugin('done', this.done.bind(this));
            compiler.plugin('beforeRun', this.beforeRun.bind(this));
            compiler.plugin('beforeCompile', this.beforeCompile.bind(this));
            compiler.plugin('invalid', this.invalid.bind(this));
        }
    }
}

export { WatchWaiterWebpackPlugin };