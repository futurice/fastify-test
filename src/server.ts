import { build } from './app';
import config from './config';

const app = build({ logger: true });

app.listen(config.PORT, (err, address) => {
  if (err) {
    console.log(err.message);
    process.exit(1)
  }
});