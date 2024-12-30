import Stomp from 'stompjs'
import BACKEND_URL from './config'

class WebSocketClient {
  constructor() {
    this.client = undefined
  }

  connect(clientId) {
    this.client = Stomp.overWS(`ws://${BACKEND_URL}:8080/online-users`)

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
