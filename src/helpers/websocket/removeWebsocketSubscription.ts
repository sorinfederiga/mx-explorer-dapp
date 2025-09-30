import { WebsocketSubcriptionsEnum } from 'types';

export const removeWebsocketSubscription = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  const subscriptionIndex = arr.indexOf(subscription);
  if (subscriptionIndex !== -1) {
    arr.splice(subscriptionIndex, 1);
  }
};
