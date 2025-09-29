# 🚀 ReactChain Solana- Decentralized Storage Platform

[![NextJS](https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-black?style=for-the-badge&logo=solana&logoColor=14F195)](https://solana.com/)
[![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)](https://ipfs.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 About

DecentralStore is a revolutionary decentralized storage platform that connects storage providers with users seeking secure, distributed storage solutions. Built on Solana's high-performance blockchain and leveraging IPFS for distributed storage, our platform offers a seamless marketplace for decentralized storage services.

### 🌟 Key Features

- 🔐 Decentralized file storage using IPFS
- ⚡ Lightning-fast transactions on Solana blockchain
- 💼 Marketplace for storage providers and renters
- 🔒 End-to-end encryption
- 🌐 Global network of storage providers
- 💰 Flexible pricing models
- 📊 Real-time analytics and monitoring

## 🏗️ Project Structure

```
.
├── apps/
│   ├── docs/            # Documentation site
│   └── web/            # Main web application
├── packages/
│   ├── config-eslint/   # ESLint configurations
│   ├── config-tailwind/ # Tailwind CSS configurations
│   ├── config-typescript/ # TypeScript configurations
│   └── ui/             # Shared UI components
```

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - TailwindCSS
  - shadcn/ui components

- **Backend**

  - Postgres Database
  - Prisma ORM
  - IPFS
  - Solana Blockchain

- **DevOps**
  - Turborepo
  - Docker
  - GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL
- Solana CLI tools
- IPFS daemon
- npm (recommended)

### Installation

1. Clone the repository:

```bash
https://github.com/kushwahramkumar2003/MetaStor
cd MetaStor
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp apps/web/.env.example apps/web/.env
```

4. Set up the database:

```bash
cd apps/web
npx prisma migrate dev
```

5. Start the development servers:

```bash
npm run dev
```

## 🔧 Development

### Commands

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications and packages
- `npm run lint` - Lint all applications and packages
- `npm run test` - Run tests across applications
- `npm run clean` - Clean all builds

### Working with Turborepo

This project uses Turborepo for efficient build system and monorepo management. The workspace is structured as follows:

- `apps/*` - Application code
- `packages/*` - Shared packages
- `config/*` - Shared configurations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Roadmap

- [ ] AI-driven storage optimization
- [ ] Cross-chain integration
- [ ] Mobile applications
- [ ] Enhanced provider reputation system
- [ ] Advanced analytics dashboard

## 🌟 Acknowledgements

- [Solana](https://solana.com/)
- [IPFS](https://ipfs.tech/)
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Turborepo](https://turborepo.org/)

---

<p align="center">Built with ❤️ by the ReactChain SolanaTeam</p>
# ReactChain-Solana
