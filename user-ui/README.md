# User Interface

The frontend application for the Panda Quant platform, built with React and TypeScript.

## 📋 Features

- **User Authentication**: Login and registration
- **Asset Management**: Deposit and withdrawal
- **Strategy Management**: Strategy selection and hosting
- **Profit Tracking**: Real-time profit charts
- **Multi-language Support**: EN, ZH, KO, JA
- **Responsive Design**: Mobile and desktop compatible

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI
- **State Management**: React Context + Hooks
- **Routing**: React Router
- **Internationalization**: i18next
- **Charts**: Chart.js
- **HTTP Client**: Axios

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/      # API services
├── utils/         # Utility functions
├── i18n/          # Internationalization
└── types/         # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 7.x

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📦 Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm lint`: Run linter
- `npm format`: Format code

## 🎨 UI Components

### Common Components

- `Button`: Custom button component
- `Card`: Content container
- `Table`: Data table
- `Chart`: Data visualization
- `Form`: Form inputs and validation

### Page Components

- `Dashboard`: Overview and statistics
- `AssetCenter`: Asset management
- `StrategyCenter`: Strategy selection
- `ProfitCenter`: Profit tracking
- `Profile`: User settings

## 🌐 Internationalization

### Supported Languages

- English (en)
- Chinese (zh)
- Korean (ko)
- Japanese (ja)

### Adding New Language

1. Add translation file in `src/i18n/locales/`
2. Update `src/i18n/config.ts`
3. Add language selector in UI

## 📱 Responsive Design

### Breakpoints

- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

### Media Queries

```typescript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
```

## 🔧 Development

### Component Development

```typescript
import { Button, Card } from '@mui/material';

const MyComponent: React.FC = () => {
  return (
    <Card>
      <Button variant="contained">
        Click Me
      </Button>
    </Card>
  );
};
```

### State Management

```typescript
const MyComponent: React.FC = () => {
  const [state, setState] = useState<StateType>(initialState);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return (
    // JSX
  );
};
```

## 📚 Documentation

- [Component Library](docs/components.md)
- [API Integration](docs/api.md)
- [State Management](docs/state.md)
- [Styling Guide](docs/styling.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 