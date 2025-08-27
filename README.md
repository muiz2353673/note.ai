# Noted.AI - AI-Powered Academic Assistant

Noted.AI is a comprehensive academic assistant platform that leverages AI to help students excel in their studies. Our platform provides intelligent note summarization, flashcard generation, assignment assistance, and citation tools.

## 🚀 Features

### Core Features

- **AI Note Summarization**: Transform lengthy notes into concise, organized summaries
- **Flashcard Generation**: Automatically create study flashcards from your notes with interactive study mode
- **Smart Note Editor**: Rich text editor with AI assistance for note creation and enhancement
- **Citation Tool**: Generate proper citations in multiple formats (APA, MLA, Chicago, Harvard)
- **Note Organization**: Tag, categorize, and search through your academic notes
- **Study Progress Tracking**: Monitor your learning progress with flashcards and study sessions

### Premium Features

- **Advanced AI Models**: Access to GPT-4 and specialized academic models
- **Unlimited Processing**: No limits on note processing or flashcard generation
- **Priority Support**: Dedicated customer support
- **University Integration**: Seamless integration with university systems
- **Advanced Analytics**: Detailed insights into study patterns and performance

### Freemium Model

- **Free Tier**: Basic features with limited usage (5 notes, 10 flashcards per month)
- **Student Premium**: Enhanced features for individual students ($9.99/month)
- **University Partnership**: Custom solutions for educational institutions

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** for data storage
- **OpenAI API** for AI features
- **Stripe** for payment processing
- **JWT** for authentication

### Frontend

- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/noted-ai.git
   cd noted-ai
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your API keys and configuration in the `.env` file.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# JWT
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 🚀 Usage

### For Students

1. Sign up for a free account
2. Upload or paste your notes
3. Use AI features to summarize, create flashcards, or get assignment help
4. Upgrade to premium for unlimited access

### For Universities

1. Contact us for partnership opportunities
2. Get custom integration with your LMS
3. Access analytics and student performance data

## 🎯 Demo Features

Noted.AI includes comprehensive demo functionality for presentations and testing:

- **🎮 Demo Mode**: Toggle demo/production modes with sample data
- **🗺️ Interactive Tour**: Guided walkthrough for new users
- **📊 Live Analytics**: Simulated user metrics and engagement data
- **👤 Demo Credentials**: Easy access to test accounts
- **📝 Sample Content**: Pre-loaded academic notes across multiple subjects

See `DEMO_FEATURES_GUIDE.md` for complete demo instructions and scripts.

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Notes

- `POST /api/notes` - Create new note
- `GET /api/notes` - Get user notes
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### AI Features

- `POST /api/ai/summarize` - Summarize notes
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/assignment` - Get assignment help
- `POST /api/ai/cite` - Generate citations

### Subscriptions

- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/subscriptions/cancel` - Cancel subscription

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Email: support@noted.ai
- Documentation: [docs.noted.ai](https://docs.noted.ai)
- Status: [status.noted.ai](https://status.noted.ai)

## 🎯 Roadmap

### Completed ✅

- [x] Core note-taking functionality with AI assistance
- [x] Interactive flashcard generation and study mode
- [x] Citation generator with multiple format support
- [x] University partnership program
- [x] Responsive web application with modern UI
- [x] User authentication and authorization
- [x] Note organization with tags and categories
- [x] Payment processing with Stripe integration
- [x] Subscription management system
- [x] Email notification system
- [x] Real-time notification system
- [x] User profile and settings management
- [x] Backend API integration with OpenAI
- [x] Payment processing with Stripe

### In Progress 🚧

- [x] Database models and data persistence
- [x] Email notifications and user management

### Planned 📋

- [ ] Mobile app (iOS/Android)
- [ ] Integration with popular LMS platforms (Canvas, Blackboard, Moodle)
- [ ] Advanced analytics dashboard
- [ ] Collaborative study groups
- [ ] Voice note processing
- [ ] Multi-language support
- [ ] Real-time collaboration features
- [ ] Advanced AI features (essay writing assistance, plagiarism detection) 