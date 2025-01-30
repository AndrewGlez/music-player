import { Client } from '@stomp/stompjs'
import { config } from '@/config'

const WS_URL = `ws://${config.BACKEND_URL}:${config.BACKEND_PORT}/online-users`

class WebSocketClient {
  constructor() {
    this.client = null
    this.connected = false
    this.subscriptions = new Map()
  }

  async connect(clientId) {
    if (this.client && this.connected) return

    this.client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: { 'client-id': clientId }
    })

    // Setup connection lifecycle handlers
    this.client.onConnect = this.handleConnect.bind(this)
    this.client.onStompError = this.handleError.bind(this)
    this.client.onWebSocketClose = this.handleClose.bind(this)

    try {
      await this.client.activate()
    } catch (error) {
      console.error('Connection error:', error)
      this.connected = false
      throw error
    }
  }

  handleConnect() {
    this.connected = true
    console.log('Connected to WebSocket')

    // Subscribe to default topic
    //this.client.subscribe('/topic/online', this.onmessage)
  }

  handleError(frame) {
    console.error('STOMP error:', frame.headers.message)
    this.connected = false
  }

  handleClose(event) {
    console.log('WebSocket closed:', event)
    this.connected = false
  }

  async subscribeTo(topic, callback = this.onmessage) {
    if (!this.client || !this.connected) {
      await this.connect()
    }

    if (!this.subscriptions.has(topic)) {
      const sub = this.client.subscribe(topic, callback)
      this.subscriptions.set(topic, sub)
    }
  }

  async subscribeToCallback(topic, callback) {
    if (!this.client || !this.connected) {
      await this.connect()
    }

    if (!this.subscriptions.has(topic)) {
      const sub = this.client.subscribe(topic, callback)
      this.subscriptions.set(topic, sub)
    }
  }

  unsubscribeFrom(topic) {
    if (this.subscriptions.has(topic)) {
      const sub = this.subscriptions.get(topic)
      sub.unsubscribe()
      this.subscriptions.delete(topic)
    }
  }

  sendTo(topic, message) {
    if (!this.connected) {
      console.error('Not connected to WebSocket')
      return
    }

    this.client.publish({
      destination: topic,
      body: JSON.stringify(message)
    })
  }

  async disconnect() {
    if (this.client && this.connected) {
      await this.client.deactivate()
      this.connected = false
      this.subscriptions.clear()
      console.log('Disconnected from WebSocket')
    }
  }

  onmessage = (message) => {
    console.log('Received message:', JSON.parse(message.body))
  }
}

const wsClient = new WebSocketClient()
export default wsClient
