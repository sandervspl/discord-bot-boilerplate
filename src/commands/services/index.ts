import fs from 'fs';
import Container, { Service } from 'typedi';

@Service()
export default class CommandServices {
  bootstrap() {
    const files = fs.readdirSync(__dirname);

    for (const file of files) {
      if (file.startsWith('.')) {
        continue;
      }

      if (file.includes('index')) {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const service = require(`./${file}`).default;
      Container.get(service);
    }
  }
}
