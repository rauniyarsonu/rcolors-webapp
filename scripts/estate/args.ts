/** Minimal `--key value` / `--flag` parser for the estate scripts */
export function parseArgs(argv = process.argv.slice(2)): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const [key, inline] = a.slice(2).split("=", 2);
    if (inline !== undefined) out[key] = inline;
    else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[key] = argv[++i];
    else out[key] = true;
  }
  return out;
}

export function requireArg(args: Record<string, string | true>, key: string, usage: string): string {
  const v = args[key];
  if (typeof v !== "string" || !v.trim()) fail(`Missing --${key}\n\nUsage: ${usage}`);
  return (v as string).trim();
}

export function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}
