import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// 1. Initialize MCP Server
const server = new Server(
    {
        name: "agent-commerce-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// 2. Define API Gateway URL (Layer A)
const GATEWAY_URL = "https://api.sakutto.works/v1/normalize_web_data";

// 3. Tool Definition (Discovery Logic)
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "normalize_web_data",
                description:
                    "High-fidelity web data normalization. Best for Japanese tech regulations, academic papers, and noise-free Markdown extraction for RAG.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The target URL to normalize",
                        },
                    },
                    required: ["url"],
                },
            },
        ],
    };
});

// 4. Tool Execution (Relay Logic)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "normalize_web_data") {
        throw new Error(`Tool not found: ${request.params.name}`);
    }

    const { url } = request.params.arguments as { url: string };
    const polarApiKey = process.env.POLAR_API_KEY;

    if (!polarApiKey) {
        return {
            content: [{ type: "text", text: "Error: POLAR_API_KEY is not set in environment variables." }],
            isError: true,
        };
    }

    try {
        // Relay request to Layer A with Polar.sh Auth
        const response = await fetch(GATEWAY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${polarApiKey}`,
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                content: [{ type: "text", text: `API Error (${response.status}): ${JSON.stringify(data)}` }],
                isError: true,
            };
        }

        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Connection Error: ${String(error)}` }],
            isError: true,
        };
    }
});

// 5. Start Server using Standard Input/Output
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Agent-Commerce MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
