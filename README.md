# Panda Quant Trading Platform

A comprehensive quantitative trading platform with multi-chain support, strategy hosting, and automated trading capabilities.

## 🌟 Features

- **Multi-Chain Support**: BSC, TRC, ARB chain integration
- **Strategy Hosting**: SuperTrend and other trading strategies
- **Automated Trading**: Real-time market analysis and execution
- **User Management**: Registration, authentication, and profile management
- **Asset Management**: Deposit, withdrawal, and balance tracking
- **Referral System**: Multi-level commission structure
- **Multi-language Support**: EN, ZH, KO, JA
- **Responsive Design**: Mobile and desktop compatible

## 📁 Project Structure

```
panda-quant/
├── user-ui/           # React frontend application
├── user-api/          # Node.js backend API
├── admin-ui/          # Admin dashboard frontend
├── admin-api/         # Admin backend API
├── strategy-engine/   # Trading strategy implementation
└── deploy/            # Deployment configurations
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/panda-quant.git
   cd panda-quant
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd user-ui
   npm install

   # Install backend dependencies
   cd ../user-api
   npm install

   # Install admin dependencies
   cd ../admin-ui
   npm install
   cd ../admin-api
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example env files
   cp .env.example .env
   cp user-api/.env.example user-api/.env
   cp admin-api/.env.example admin-api/.env
   ```

4. **Start development servers**
   ```bash
   # Start user frontend
   cd user-ui
   npm start

   # Start user backend
   cd ../user-api
   npm run dev

   # Start admin frontend
   cd ../admin-ui
   npm start

   # Start admin backend
   cd ../admin-api
   npm run dev
   ```

## 🛠 Development

### Frontend Development
- React with TypeScript
- Material-UI components
- i18n for internationalization
- Chart.js for data visualization

### Backend Development
- Node.js with Express
- PostgreSQL for data storage
- JWT for authentication
- WebSocket for real-time updates

### Strategy Development
- TypeScript-based strategy engine
- Technical indicators library
- Backtesting framework
- Real-time market analysis

## 📦 Deployment

See [deploy/README.md](deploy/README.md) for detailed deployment instructions.

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Strategy Development Guide](docs/strategy-development.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Email: support@panda-quant.com
- Website: https://panda-quant.com 