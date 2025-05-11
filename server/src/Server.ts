import app from './App';
import { config } from './Config';
import { logger } from './utils/Logger';

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 