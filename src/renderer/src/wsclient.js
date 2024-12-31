import Stomp from 'stompjs'
import { config } from '@/config'

class WebSocketClient {
  constructor() {
    this.client = undefined
  }

  connect(clientId) {
    this.client = Stomp.overWS(`ws://${config.BACKEND_URL}:${config.BACKEND_PORT}/online-users`)

    var headers = {
      'client-id': 'client1'
    }
    this.client.connect(
      {
        clientId: clientId
      },
      () => {
        console.log('Connected to STOMP broker')
      }
    )
  }
  suscribeTo(topic) {
    this.client.subscribe(topic, (message) => {})
  }
  sendTo(topic, message) {
    const m = this.client.send(topic, {}, 'Hello, STOMP!')
  }
}

const wsclient = new WebSocketClient()
export default wsclient
