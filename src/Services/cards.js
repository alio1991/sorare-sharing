

export const getCardsByUser = (user)=>{
  const url = new URL("http://localhost:8080/playerCards"),
  params = {user:user}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return fetch(url).then((res) => res.json());
}