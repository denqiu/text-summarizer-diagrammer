import { Client } from "@gradio/client";
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
});

class TextSummarizer {
    constructor() {
        this.client = null;
    }

    async connect() {
        try {
            this.client = await Client.connect("http://127.0.0.1:8000");
            console.log("Connected to FastAPI server");
        } catch (error) {
            console.error("Failed to connect to server:", error);
            throw error;
        }
    }

    async summarizeAndVisualize(text, outputElementId) {
        try {
            // Get summary from API
            const result = await this.client.predict("/summarize", { text });
            
            // Create diagram definition
            const diagramDefinition = `
            graph TD
                A[Original Text] --> B[Summary]
                B --> C[${result.summary.replace(/\n/g, '<br/>')}]
            `;

            // Render diagram
            const { svg } = await mermaid.render('summary-diagram', diagramDefinition);
            
            // Display the diagram
            const outputElement = document.getElementById(outputElementId);
            if (outputElement) {
                outputElement.innerHTML = svg;
            } else {
                console.error(`Element with id ${outputElementId} not found`);
            }

            return result.summary;
        } catch (error) {
            console.error("Error in summarization process:", error);
            throw error;
        }
    }
}

// Usage example
async function main() {
    const summarizer = new TextSummarizer();
    await summarizer.connect();

    const sampleText = "Artificial Intelligence (AI) is a broad field of computer science focused on creating intelligent machines that can perform tasks that typically require human intelligence.";
    
    try {
        const summary = await summarizer.summarizeAndVisualize(sampleText, 'mermaid-output');
        console.log("Summary:", summary);
    } catch (error) {
        console.error("Failed to process text:", error);
    }
}

// Execute the main function
main().catch(console.error);