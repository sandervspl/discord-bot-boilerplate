import fs from 'fs';
import Container, { Service } from 'typedi';

@Service()
export default class CommandsModule {
  bootstrap() {
    const files = fs.readdirSync('./src/modules/commands');

    for (const file of files) {
      if (file.startsWith('.')) {
        continue;
      }

      if (file.includes('index')) {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const service = require(`modules/commands/${file}`).default;
      Container.get(service);
    }
  }
}
