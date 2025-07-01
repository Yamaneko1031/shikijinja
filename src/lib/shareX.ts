export const shareX = async (shareText: string, shareUrl?: string, hashtags?: string) => {
  let url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  if (shareUrl) {
    url += `&url=${encodeURIComponent(shareUrl)}`;
  }

  if (hashtags) {
    url += `&hashtags=${encodeURIComponent(hashtags)}`;
  }

  window.open(url, '_blank', 'width=550,height=420');
};
