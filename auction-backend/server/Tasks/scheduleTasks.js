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

  let updated = false;
  for (const auction of auctionsToUpdate) {
    auction.status = AuctionStatus.FINISHED;
    updated = true;
  }
  await DI.auctionRepository.flush();

  // If any status updated Emit an event to all connected clients to indicate that auction data has been updated
  if (updated) {
    DI.io.emit('auctionsUpdated');
  }

  console.log(
    `Updated ${auctionsToUpdate.length} auction(s) to FINISHED status.`
  );
};

//Updates the auctions statuses in the DB every minute
//TODO: This should ideally run in a worker to not overload the main server
//? But I suspect this would be out of the scope of the project
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
