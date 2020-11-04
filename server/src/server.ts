import express, { json } from 'express';
import path from 'path'
import 'express-async-errors';

import router from './routes'
import errorHandle from './errors/handle'

const app = express();

app.use(json());

app.use(router);
app.use(errorHandle)

app.get('/', (req, res) => {
    res.json({ message: "Ola API" });
})

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/assets', express.static(path.resolve(__dirname, 'assets')));


app.listen(3333, () => console.log('Server ON'));