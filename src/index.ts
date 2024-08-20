import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from './routes/task';
import userRoutes from './routes/user';

const app = express();
const port = 3000;

app.use(express.json());
// Hata işleme middleware'i
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});