const tg = window.Telegram.WebApp;

export function useTelegram() {

  return {
    tg,
    chat: tg.initDataUnsafe?.chat,
    user: tg.initDataUnsafe?.user,
    queryId: tg.initDataUnsafe?.query_id,
  }
}