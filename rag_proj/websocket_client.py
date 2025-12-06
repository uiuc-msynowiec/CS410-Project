import asyncio
import websockets
import sys

async def websocket_client():
    uri = "ws://localhost:32001"  # Replace with your server's WebSocket URL
    async with websockets.connect(uri,
            ping_interval=90,
            ping_timeout=90,
            close_timeout=20) as websocket:
        # Send a message
        await websocket.send(sys.argv[1])
        print(f"Message sent to server: {sys.argv[1]}")

        # Receive a response
        response = await websocket.recv()
        print(f"Received from server: {response}")

# Run the client
if __name__ == "__main__":
    asyncio.run(websocket_client())