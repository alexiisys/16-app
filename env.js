const z = require('zod');

// @ts-ignore
const packageJSON = require('./package.json');
const path = require('path');
const process = require('process');
const APP_ENV = process.env.APP_ENV ?? 'development';
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);

require('dotenv').config({
  path: envPath,
});

/**
 * Add a suffix to variable env based on APP_ENV
 * @param {string} name
 * @returns  {string}
 */
const withEnvSuffix = (name) => {
  return APP_ENV === 'production' ? name : `${name}.${APP_ENV}`;
};

const client = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  NAME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  BUILD_NUMBER: z.string(),
  PRIVACY_POLICY: z.string(),
  FEEDBACK_FORM: z.string(),
  FB_APP_ID: z.string(),
  FB_CLIENT_TOKEN: z.string(),
  IOS_APP_DOMAIN: z.string(),
});

const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
  FB_APP_ID: z.string(),
  FB_CLIENT_TOKEN: z.string(),
  BRANCH_LIVE_KEY: z.string(),
  IOS_URL: z.string(),
  ANDROID_URL: z.string(),
});

/**
 * @type {Record<keyof z.infer<typeof client> , unknown>}
 */
const _clientEnv = {
  APP_ENV,
  NAME: process.env.NAME,
  BUNDLE_ID: process.env.BUNDLE_ID,
  PACKAGE: process.env.BUNDLE_ID, // Same as BUNDLE_ID
  VERSION: process.env.VERSION,
  BUILD_NUMBER: process.env.BUILD_NUMBER,
  PRIVACY_POLICY: process.env.PRIVACY_POLICY,
  FEEDBACK_FORM: process.env.FEEDBACK_FORM,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_CLIENT_TOKEN: process.env.FB_CLIENT_TOKEN,
  IOS_APP_DOMAIN: process.env.IOS_APP_DOMAIN,
};


/**
 * @type {Record<keyof z.infer<typeof buildTime> , unknown>}
 */
const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER: process.env.EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_CLIENT_TOKEN: process.env.FB_CLIENT_TOKEN,
  BRANCH_LIVE_KEY: process.env.BRANCH_LIVE_KEY,
  IOS_URL: process.env.IOS_URL,
  ANDROID_URL: process.env.ANDROID_URL,
};

const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,

    `\n❌ Missing variables in .env.${APP_ENV} file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`
  );
  throw new Error(
    'Invalid environment variables, Check terminal for more details '
  );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = {
  Env,
  ClientEnv,
};
