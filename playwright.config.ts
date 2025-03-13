import { PlaywrightTestConfig, devices } from '@playwright/test';
import { qpmnconfig } from './config/envConfig';

const config: PlaywrightTestConfig = {
  // Timeout, default 1 minute, DON'T change this setting. Please set timeout in test case level for slow test.
  timeout: 1*60*1000,

  reporter: [
    ['junit', { outputFile: 'playwright-report/testingresults.xml' }],
    ['html', { outputFolder: 'playwright-report/' + (new Date()).valueOf() + '/', open:"never"}],
  ],
  workers: 3,

  use: {
    // Browser options
    headless: true,
    
    // Context options Defaults to an 1280x720
    viewport: { width: 1920, height: 1080 },

    // Artifacts
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,

  },

  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'iPad Chrome',
      use: {
        ...devices['iPad Pro 11'],
         browserName: 'chromium',
         viewport:{width:1024,height:1366},
      },      
    },
    {
      name: 'iPad Safari',
      use: {
        ...devices['iPad Pro 11'],
         browserName: 'webkit',
         viewport:{width:1024,height:1366},
      },      
    },
    {
      name: 'iPhone Chrome',
      use: {
        ...devices['iPhone 13 Pro Max'],
         browserName: 'chromium',
         viewport:{width:428,height:926},
      },      
    },
    {
      name: 'iPhone Safari',
      use: {
        ...devices['iPhone 13 Pro Max'],
         browserName: 'webkit',
         viewport:{width:428,height:926},
      },      
    },
  ],
};

export default config;
