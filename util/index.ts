export const maskValue = (value: number) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const maskDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const maskTime = (date: Date) => {
  const time = `${date.getHours()}:${date.getMinutes()}`;

  return time;
}

export const removeSpecialCharacters = (word: string) => {
  let wordHandled = word.replace(/[^\w\s]/gi, "");
  wordHandled = wordHandled.replace(/_/g, "");

  return wordHandled;
};