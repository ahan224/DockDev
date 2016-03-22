import { join } from 'path';

const config = {
  // main config infomration
  configFolder: '.dockdevConfig',
  configFile: 'dockdevConfig.json',
  defaultPath: process.env.HOME,
  configPath(path = this.defaultPath) {
    return join(path, this.configFolder, this.configFile);
  },

  // individual project infomration
  projFolder: '.dockdev',
  projFile: 'dockdev.json',
  projWriteParams: ['uuid', 'projectName', 'containers', 'machine'],
  projPath() {
    return join(this.projFolder, this.projFile);
  }
};

export default config;
