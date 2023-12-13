import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import listEndpoints from 'express-list-endpoints';

// import { todo, lists, todolist, user, reset } from './routes';
import { router as register } from './routes/register';
import { router as reset } from './routes/reset';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

console.log(process.env.MY_SECRET);

const PORT = 3000 as const;

app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

app.use(register);

// app.use(todo);
// app.use(lists);
// app.use(todolist);
// app.use(user);
app.use(reset);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
