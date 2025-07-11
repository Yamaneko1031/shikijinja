export const postSlackError = async (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    await fetch('/api/slack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  }
};
