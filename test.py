import ollama

# Generate an embedding
response = ollama.embeddings(
    model="nomic-embed-text",
    prompt="Hello world"
)
print("Embedding length:", len(response["embedding"]))

# Do a simple chat
chat_resp = ollama.chat(
    model="llama3.1",
    messages=[{"role": "user", "content": "Say hello in a friendly way."}]
)
print("Chat response:", chat_resp["message"]["content"])
