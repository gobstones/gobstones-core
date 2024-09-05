/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * This module provides the tools to create a CLI application
 * using commander as the background tool, but providing some
 * simple abstractions. The CLI produce may automatically support
 * multiple languages, input and output from and to files as well
 * as stdout, and other perks.
 *
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';

import commander, { program } from 'commander';

import { WithRequired } from './Types';

/**
 * The general texts that a CLI app uses.
 * This include the description texts that are used as the description of the
 * different parts of the CLI.
 * The `name` and the `versionNumber` are expected to be the app name (No translation
 * is used, as the name should be the same through all the app), and the `versionNumber`
 * should be the version in the major.minor.patch format.
 */
export interface CLIGeneralTexts {
    /** The application name */
    name: string;
    /** The application version number in semVer */
    versionNumber: string;
    /** A text displayed when showing the application's help */
    help: string;
    /** The language used by the application */
    language?: string;
    /** The error message displayed when using a wrong language */
    languageError?: string;
    /** Text used by the tool */
    tool: string;
    /** The text displayed when showing the version of the application */
    version: string;
}

/**
 * The general flags that a CLI app accepts, when configured to used them.
 * Note that currently the default flags cannot be changed.
 */
export interface CLIGeneralFlags {
    /** The help flags, both short and long */
    help: { short: string; long: string };
    /** The language set flags, both short and long */
    language: { short: string; long: string };
    /** The version information flags, both short and long */
    version: { short: string; long: string };
    /** The input file flags, both short and long */
    in: { short: string; long: string };
    /** The output file flags, both short and long */
    out: { short: string; long: string };
}

/**
 * A set of options for initially configure a CLI application.
 * If a translation is given
 */
export interface CLIAppOptions {
    /**
     * The description texts that is used as the description of the different parts of the CLI.
     * The `name` and the `versionNumber` are expected to be the app name (No translation
     * is used, as the name should be the same through all the app), and the `versionNumber`
     * should be the version in the major.minor.patch format.
     */
    texts: CLIGeneralTexts;

    /**
     * The flag names to use in this application, if the flags differ in any way from
     * the default ones.
     *
     * The default flags include:
     * * help:  -h, --help
     * * version: -v, --version
     * * language selection: -l, --language
     * * input file for a command: -i, --in
     * * output file for a command: -o, --out
     */
    flags?: CLIGeneralFlags;
}

/**
 * A builder for a CLI command. May be the main command of the app ({@link CLIApp})
 * extends this class) or a sub-command.
 */
export class CLICommandBuilder {
    private static SHORT_HELP_FLAG = '-h';
    private static SHORT_VERSION_FLAG = '-v';
    private static SHORT_LANG_FLAG = '-l';
    private static SHORT_INPUT_FLAG = '-i';
    private static SHORT_OUTPUT_FLAG = '-o';
    private static LONG_HELP_FLAG = '--help';
    private static LONG_VERSION_FLAG = '--version';
    private static LONG_LANG_FLAG = '--language';
    private static LONG_INPUT_FLAG = '--in';
    private static LONG_OUTPUT_FLAG = '--out';

    protected program: commander.Command;
    protected hasAction = false;
    protected currentArgs: unknown[];
    protected currentOptions: unknown;
    protected onReadErrorMsg: string;
    protected options: WithRequired<CLIAppOptions, 'flags'>;
    protected isSubcommand: boolean;

    public constructor(cmdrProgram: commander.Command, options: CLIAppOptions, isSubcommand = false) {
        // Set default flags, or use custom ones
        const defaultFlags = {
            help: {
                short: CLICommandBuilder.SHORT_HELP_FLAG,
                long: CLICommandBuilder.LONG_HELP_FLAG
            },
            version: {
                short: CLICommandBuilder.SHORT_VERSION_FLAG,
                long: CLICommandBuilder.LONG_VERSION_FLAG
            },
            in: {
                short: CLICommandBuilder.SHORT_INPUT_FLAG,
                long: CLICommandBuilder.LONG_INPUT_FLAG
            },
            out: {
                short: CLICommandBuilder.SHORT_OUTPUT_FLAG,
                long: CLICommandBuilder.LONG_OUTPUT_FLAG
            }
        };

        this.program = cmdrProgram;
        this.options = Object.assign({ ...defaultFlags }, options) as WithRequired<CLIAppOptions, 'flags'>;
        this.isSubcommand = isSubcommand;
    }

    /**
     * Make this command to be able to read input from a file.
     *
     * @param description - The input flag description or the translation key if a translator is used.
     * @param onReadErrorMsg - The error message or translation key if a translator is used.
     */
    public input(description: string, onReadErrorMsg: string): this {
        this.onReadErrorMsg = onReadErrorMsg;
        this.program.option(`${this.options.flags.in.short}, ${this.options.flags.in.long}, <filename>`, description);
        return this;
    }

    /**
     * Make this command to be able to write the output to a file.
     *
     * @param description - The output flag description or translation key if a translator is used.
     */
    public output(description: string): this {
        this.program.option(`${this.options.flags.out.short}, ${this.options.flags.out.long}, <filename>`, description);
        return this;
    }

    /**
     * Add a new option to the command.
     *
     * @param flags - The flags to trigger this option
     * @param description - The description or translation key if a translator is used.
     * @param defaultValue - A default value.
     */
    public option(flags: string, description?: string, defaultValue?: string | boolean): this {
        this.program.option(flags, description, defaultValue);
        return this;
    }

    /**
     * Set the action for this command. The action callback receives both the current
     * command, and the arguments (Note this is one or more arguments, depending
     * on the command definition. Mandatory or optional positional arguments are
     * passed first, while the last element consists of the flags passed to the command)
     *
     * @param f - The callback to run when this command is called.
     */
    public action(f: (cliapp: this, ...args: unknown[]) => void): this {
        this.program.action((...options: unknown[]) => {
            this.currentArgs = options.length >= 2 ? options.slice(0, options.length - 2) : [options[0]];
            this.currentOptions = options.length >= 2 ? options[options.length - 2] : options[1];
            f(this, ...options);
        });
        this.hasAction = true;
        return this;
    }

    /**
     * Read the input to this command. The input may be the first arguments passed
     * to a command (without the flags, separated by space) if a mandatory argument
     * or optional argument was given, or the contents of the
     * input file if an input was configured.
     */
    public read(): string {
        if (this.currentOptions && (this.currentOptions as { in: string }).in) {
            return this.readFileInput((this.currentOptions as { in: string }).in);
        }
        return this.currentArgs.join(' ');
    }

    /**
     * Write the given data to the standard output, or, to the expected file,
     * if an output was configured. Note that when outputting to a file, if the
     * file does not exists, it gets created. If it already exists, then the
     * output is appended to the previously defined contents of that file.
     *
     * @param data - The data to output
     */
    public write(data: string): void {
        if (this.currentOptions && (this.currentOptions as { out: string }).out) {
            this.writeToFile((this.currentOptions as { out: string }).out, data);
        } else {
            this.writeToConsole(data);
        }
    }

    /**
     * Read the contents of a file. Throws error if
     * the file does not exist.
     *
     * @param fileName - The file to read.
     */
    public readFileInput(fileName: string): string {
        this.ensureOrFailAndExit(fs.existsSync(fileName), this.onReadErrorMsg);
        return fs.readFileSync(fileName).toString();
    }

    /**
     * Write a set of contents to a given file.
     *
     * @param fileName - The file to write to.
     * @param contents - The contents to write.
     */
    public writeToFile(fileName: string, contents: string): void {
        fs.writeFileSync(fileName, contents, { flag: 'a' });
    }

    /**
     * Write a set of contents to the standard output.
     *
     * @param contents - The contents to write.
     */
    public writeToConsole(contents: string): void {
        // eslint-disable-next-line no-console
        console.log(contents);
    }

    /**
     * Ensure a condition is met, and if not, show the given error message,
     * and exit the application with 1.
     *
     * @param condition - The condition that needs to satisfy
     * @param error -
     */
    public ensureOrFailAndExit(condition: boolean, error: string): void {
        if (!condition) {
            this.writeToConsole(error);
            this.exit(1);
        }
    }

    /**
     * Returns true if the command received no arguments nor flags
     */
    public hasNoArgs(): boolean {
        const sliced = process.argv.slice(this.isSubcommand ? 3 : 2);
        if (sliced.length === 0) return true;
        if (
            sliced.length === 2 &&
            (sliced[0] === this.options.flags.language.short || sliced[0] === this.options.flags.language.long)
        )
            return true;
        return false;
    }

    /**
     * Output the command help.
     */
    public outputHelp(): void {
        this.program.outputHelp();
    }

    /**
     * Output the command's help if no arguments where given,
     * then exit the application with 0.
     */
    public outputHelpOnNoArgs(): void {
        if (this.hasNoArgs()) {
            this.outputHelp();
            this.exit(0);
        }
    }

    /**
     * Exit the application with the given value.
     *
     * @param value - The value to exit with
     */
    public exit(value: number): void {
        process.exit(value);
    }
}

/**
 * The CLIApp class is the class to extend in order to define your CLI based
 * application.
 */
export class CLIApp extends CLICommandBuilder {
    /** The arguments passed to the application */
    private processArgs: string[];

    public constructor(options: CLIAppOptions) {
        super(program, options);
        this.processArgs = process.argv;

        // Set up the program
        this.program.name(this.options.texts.name);
        this.program.version(
            this.options.texts.versionNumber,
            `${this.options.flags.version.short}, ${this.options.flags.version.long}`,
            this.options.texts.version
        );

        this.program.helpOption(
            `${this.options.flags.help.short}, ${this.options.flags.help.long}`,
            this.options.texts.help
        );
        this.program.helpCommand(false);
    }

    /**
     * Run the CLI app.
     * Call when your CLI app has been completely configured over the main app.
     */
    public run(): void {
        if (!this.hasAction) {
            this.program.action((_options: unknown) => {
                this.outputHelpOnNoArgs();
            });
        }
        this.program.parse(this.processArgs);
    }

    /**
     * Define a new sub-command.
     *
     * @param name - The new sub-command name
     * @param description - The sub-command description, or translation key if a translator is used.
     * @param f - A callback to construct the newly defined sub-command.
     */
    public command(name: string, description: string, f: (cmd: CLICommandBuilder) => void): this {
        const newCmd = this.program.command(name).description(description);
        f(new CLICommandBuilder(newCmd, this.options, true));
        return this;
    }
}

/**
 * The Type of a CLI application
 */
export type cli = CLIApp;
/**
 * Create a new CLI application.
 * @param options - The application options.
 *
 * @group API: Main
 */
export const cli = (options: CLIAppOptions): CLIApp => new CLIApp(options);

/**
 * Retrieves an object with the data from a JSON file
 * after reading the same from the command line.
 * This function is useful here as most times you will
 * want to retrieve data from the package.json file.
 *
 * @param fileLocation - The location of the file to read.
 */
export const readJSON = (fileLocation: string): unknown => {
    try {
        const fileContents = fs.readFileSync(fileLocation);
        return JSON.parse(fileContents.toString());
    } catch {
        return {};
    }
};
