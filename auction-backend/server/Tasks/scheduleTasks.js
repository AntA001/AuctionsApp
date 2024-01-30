const cron = require('node-cron');
import { AuctionStatus } from '../../database/types/types';
import { DI } from '../app';

const updateAuctionStatuses = async () => {
  console.log('Running scheduled task to update auction statuses...');
  const now = new Date();
  const auctionsToUpdate = await DI.auctionRepository.find({
    terminateAt: { $lt: now },
    status: { $ne: AuctionStatus.FINISHED },
  });

  for (const auction of auctionsToUpdate) {
    auction.status = AuctionStatus.FINISHED;
  }
  await DI.auctionRepository.flush();
  console.log(
    `Updated ${auctionsToUpdate.length} auction(s) to FINISHED status.`
  );
};

//Updates the auctions statuses in the DB every minute
//This should ideally run in a worker to not overload the main server
export const startScheduledTasks = () => {
  const task = cron.schedule(
    '*/1 * * * *',
    updateAuctionStatuses,
    null,
    true,
    'Europe/Athens'
  );
  task.start();
};
