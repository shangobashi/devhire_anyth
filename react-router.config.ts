import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: true,
  presets: [vercelPreset()],
  serverBuildFile: 'index.cjs',
  serverBundles: () => 'main',
  serverModuleFormat: 'cjs',
} satisfies Config;
