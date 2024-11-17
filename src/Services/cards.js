

export const getCardsByUser = (user)=>{
  const url = new URL("http://localhost:8080/playerCards"),
  params = {user:user}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return fetch(url).then((res) => res.json());
}

export const getRandomCardFromPlayerSlug = (slug)=>{
  const url = new URL("http://localhost:8080/randomCardFromPlayerSlug"),
  params = {slug:slug}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return fetch(url).then((res) => res.json());
}

export const getCardsOnSaleByPlayerSlug = (slug, inSeasonEligible)=>{
  const url = new URL("http://localhost:8080/onSaleCardsByPlayerSlug"),
  params = {slug:slug, inSeasonEligible:inSeasonEligible}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return fetch(url).then((res) => res.json());
}

export const getNextGameWeek = ()=>{
  const url = new URL("http://localhost:8080/getNextGameWeek");
  return fetch(url).then((res) => res.json());
}