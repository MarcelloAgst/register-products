import axios from 'axios'

// Platform é para identificar em qual ambiente estamos excutando
import { Platform } from 'react-native'

// IP LOCAL PADRÃO do Android é 10.0.2.2
export const API_BASE_URL = Platform.OS === 'android' ? 
'http://10.0.2.2:3000' : 'http://localhost:3000'

const api = axios.create({
  baseURL : API_BASE_URL,
  timeout: 10000, // define que a requisição pode esperar no máximo 10 segundos
  headers: {
    'Content-Type': 'application/json', // enviando json
    Accept: 'application/json' // esperando a resposta em json
  }
})

export default api