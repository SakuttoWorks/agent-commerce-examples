# Agent-Commerce-OS MCP Server

**The Official Model Context Protocol (MCP) Server for Sakutto Works Data Normalization Infrastructure.**

## 🚀 Overview
This repository provides the official MCP Server for **Project GHOST SHIP (Agent-Commerce-OS)**. It allows AI agents (like Claude Desktop) to autonomously connect to our Zero-Trust, metered-billing (Polar.sh) API to extract and normalize unstructured web data into clean Markdown or JSON formats.

---

## 🏗️ Architecture
- **Layer C (This Repo)**: Stateless MCP Server bridging the AI agent and the network.
- **Layer A (Proxy)**: Cloudflare edge network handling Polar.sh API key validation and metered billing.
- **Layer B (Core)**: GCP Cloud Run engine performing advanced RAG-optimized data normalization.

---

## ⚙️ Prerequisites
- An active **Polar.sh API Key** (for metered billing: $0.10 / request).
- **Claude Desktop** or any standard MCP-compatible client.
- Node.js or Python environment (depending on the client execution context).

---

## 🔌 Setup & Configuration (Claude Desktop)
To grant your AI agent access to the normalization tools, add the following configuration to your `claude_desktop_config.json`:

### macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
`%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "agent-commerce-os": {
      "command": "npx",
      "args": [
        "-y",
        "@sakuttoworks/agent-commerce-mcp"
      ],
      "env": {
        "POLAR_API_KEY": "polar_..."
      }
    }
  }
}
```

*(Note: Replace `polar_...` with your actual Polar.sh API key. The exact `command` and `args` are placeholders. Depending on the final implementation, this will be updated to use `npx` (Node.js) or `uvx` / `python -m` (Python) upon package publication.)*

---

## 🤖 Tools Available

Once connected, the AI agent will automatically discover tools exposed dynamically by the MCP server. (These are also cataloged in our `mcp.json` manifest for external registries):

- `normalize_web_data`: Extract semantic Markdown from any target URL.

---

## 💖 Support the Project

If this infrastructure helped you save time or scale your AI agents, consider supporting the development! Your support helps keep this project highly maintained and secure.

[![Support via Polar.sh](https://img.shields.io/badge/Support_via-Polar.sh-blue?style=for-the-badge)](https://buy.polar.sh/polar_cl_ZI9H5fL8dQqcormOadiGDFDpS2Sxd1jT05jTX1vStWi)
[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github)](https://github.com/sponsors/SakuttoWorks)


© 2026 Sakutto Works - Enabling the Semantic Web through Reliable Data Normalization.
