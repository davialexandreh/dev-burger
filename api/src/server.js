import 'dotenv/config';
import app from './app.js';

// PaaS (Render, Railway) injetam a porta em PORT; local vem do .env
const port = Number(process.env.PORT || process.env.APP_PORT) || 3001;

app.listen(port, () => console.log(`🚀 App is running at port ${port}...`));
