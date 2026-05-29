/**
 * Notification Service
 * MVP: Console logging. Future: OneSignal push notifications
 */

export async function sendPushNotification(userId, title, message, data = {}) {
  // MVP: Log to console
  console.log(`📱 Push Notification to user ${userId}:`);
  console.log(`   Title: ${title}`);
  console.log(`   Message: ${message}`);
  console.log(`   Data:`, data);

  // TODO: Integrate OneSignal
  // await OneSignal.createNotification({
  //   include_external_user_ids: [userId],
  //   headings: { en: title },
  //   contents: { en: message },
  //   data: data
  // });
}

export async function notifyBetPlaced(userId, matchTitle, amount, odds) {
  await sendPushNotification(
    userId,
    'Bet Placed!',
    `You bet ${amount} ApeXCoins on ${matchTitle} at ${odds}x odds`,
    { type: 'bet_placed', matchTitle, amount, odds }
  );
}

export async function notifyMatchStarting(userId, matchTitle, minutesUntil) {
  await sendPushNotification(
    userId,
    'Match Starting Soon!',
    `${matchTitle} starts in ${minutesUntil} minutes. Good luck!`,
    { type: 'match_starting', matchTitle, minutesUntil }
  );
}

export async function notifyBetResult(userId, matchTitle, won, amount) {
  const title = won ? '🎉 You Won!' : 'Match Finished';
  const message = won 
    ? `You won ${amount} ApeXCoins on ${matchTitle}!` 
    : `Your bet on ${matchTitle} didn't win this time.`;

  await sendPushNotification(
    userId,
    title,
    message,
    { type: won ? 'bet_won' : 'bet_lost', matchTitle, amount, won }
  );
}

export async function notifyDailyCoinsAvailable(userId) {
  await sendPushNotification(
    userId,
    'Daily Coins Available!',
    'Your 300 ApeXCoins are ready to claim. Don't miss out!',
    { type: 'daily_coins' }
  );
}
