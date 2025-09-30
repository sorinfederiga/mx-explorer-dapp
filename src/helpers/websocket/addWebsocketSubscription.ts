import { WebsocketSubcriptionsEnum } from 'types';

export const addWebsocketSubscription = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  const subscriptionIndex = arr.indexOf(subscription);
  if (subscriptionIndex === -1) {
    arr.push(subscription);
  }
};
