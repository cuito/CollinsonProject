import app from './app'; // Import the configured Express app
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 4000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/api`);
});