import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info({ port: PORT }, `Backend running on port ${PORT}`);
});
