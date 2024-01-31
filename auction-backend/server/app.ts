import 'reflect-metadata';
import http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from '@mikro-orm/core';
import { AuctionEntity, BidEntity, UserEntity } from '../database/entities';
import { AuctionController, BidController, UserController } from './routes';
import 'dotenv/config';
import { startScheduledTasks } from './Tasks/scheduleTasks'; // Adjust the path as necessary

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<UserEntity>;
  auctionRepository: EntityRepository<AuctionEntity>;
  bidRepository: EntityRepository<BidEntity>;
  io: SocketIOServer;
};

export const app = express();
const port = process.env.SERVER_PORT || 3001;

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(UserEntity);
  DI.auctionRepository = DI.orm.em.getRepository(AuctionEntity);
  DI.bidRepository = DI.orm.em.getRepository(BidEntity);

  app.use(express.json());
  app.use(cors());
  app.use((req: Request, res: Response, next: NextFunction) =>
    RequestContext.create(DI.orm.em, next)
  );
  app.get('/', (req: Request, res: Response) =>
    res.json({
      message:
        'Welcome to MikroORM express TS example, try CRUD on /author and /book endpoints!',
    })
  );
  app.use('/auctions', AuctionController);
  app.use('/users', UserController);
  app.use('/bids', BidController);
  app.use((req, res) => res.status(404).json({ message: 'No route found' }));

  DI.server = http.createServer(app);
  DI.io = new SocketIOServer(DI.server, {
    cors: {
      origin: '*', //! Just for demonstration reasons, this would not go into production
      methods: ['GET', 'POST'],
    },
  });

  DI.io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  DI.server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    startScheduledTasks();
  });
})();
