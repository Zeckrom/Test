import axios from 'axios'

const URL = 'http://www.mocky.io/v2/5d9c5d85310000759e2fc50d'

export const fetchData = async () => {
  const result = await axios.get(URL)
  return result
}
