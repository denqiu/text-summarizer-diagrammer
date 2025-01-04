from fastapi import FastAPI
import ollama

app = FastAPI()

def summarize_text(text):
    response = ollama.chat(model='mistral', messages=[
        {
            'role': 'system',
            'content': 'Summarize the following text in 2-3 sentences.'
        },
        {
            'role': 'user',
            'content': text
        }
    ])
    return response['message']['content']

@app.post("/summarize")
async def summarize(text: str):
    summary = summarize_text(text)
    return {"summary": summary}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)  # Adjust host/port as needed
