import express, { json } from 'express';
import path from 'path'

import router from './routes'

const app = express();

app.use(json());
app.use(router);

app.get('/', (req, res) => {
    res.json({ message: "Ola API" });
})

app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

app.listen(3333, () => console.log('Server ON'));