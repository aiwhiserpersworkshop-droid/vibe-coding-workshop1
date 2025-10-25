# Ratio Machina Starter - Next.js App Router + AWS Amplify Starter

A comprehensive starter template for building scalable web applications with Next.js App Router, Vercel Compute, and PostgreSQL database.

## 🚀 Features

- **Next.js 15** with App Router for modern React development
- **Vercel** deployment for scalable hosting
- **PostgreSQL** database with **Prisma ORM** for type-safe data access
- **Dark theme UI** with Tailwind CSS
- **TypeScript** throughout for type safety
- **Comprehensive testing** with Jest integration tests
- **Example CRUD** implementation demonstrating best practices

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── examples/      # Example CRUD API
│   │   ├── example-job/   # SQS job queuing API
│   │   └── og/           # Open Graph image generation
│   ├── examples/          # Example pages (list, create, view, edit)
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx          # Home page
│   └── not-found.tsx     # 404 error page
├── lib/                   # Shared utilities
│   └── prisma.ts         # Prisma client instance
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migration files
├── tests/                 # Integration tests
│   ├── example-api.test.ts # API endpoint tests
│   └── setup.ts          # Test configuration
├── ui/                    # Reusable UI components
│   ├── boundary.tsx      # Container component
│   ├── button.tsx        # Button component
│   ├── byline.tsx        # Footer component
│   └── global-nav.tsx    # Navigation component
├── docker-compose.yml     # Local PostgreSQL setup
└── package.json          # Dependencies and scripts
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Infrastructure**: AWS Amplify, AWS SQS, AWS Lambda, AWS CDK
- **Testing**: Jest, TypeScript
- **Development**: Docker Compose, ESLint, Prettier

## 📖 Application Overview

### Core Features

**Example Management System**
- Create, read, update, and delete examples
- Rich text content support
- Metadata storage with JSON fields
- Automatic timestamp tracking

**Background Job Processing**
- Queue examples for background processing via AWS SQS
- Lambda function processes jobs with detailed logging
- Scalable architecture bypassing Amplify's 30-second timeout

**Modern UI**
- Dark theme with professional styling
- Responsive design for desktop and mobile
- Intuitive navigation and user experience

### Database Schema

The application uses a simple but flexible `Example` model:

```prisma
model Example {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String   @db.Text
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API Endpoints

**Example CRUD Operations:**
- `GET /api/examples` - List examples with pagination
- `POST /api/examples` - Create a new example
- `GET /api/examples/:id` - Get a specific example
- `PUT /api/examples/:id` - Update an example (full update)
- `PATCH /api/examples/:id` - Partially update an example
- `DELETE /api/examples/:id` - Delete an example

**Background Job Processing:**
- `POST /api/example-job` - Queue an example for background processing

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** 
- **Docker and Docker Compose** (for local database)
- **AWS CLI configured** (for deployment)
- **Git** for version control

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ratiomachina-starter
npm install
```

### 2. Environment Setup

Copy the environment template and configure:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/example"

# AWS (for SQS + Lambda background processing)
AWS_REGION="us-west-2"
EXAMPLE_QUEUE_URL="https://sqs.region.amazonaws.com/account/example-sqs-queue"

# CDK Deployment
CDK_DEFAULT_ACCOUNT="your-aws-account-id"
CDK_DEFAULT_REGION="us-west-2"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Database Setup

Start PostgreSQL with Docker Compose:

```bash
docker-compose up -d
```

Run Prisma commands to set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Deploy AWS Infrastructure (Optional)

Deploy the SQS + Lambda infrastructure for background processing:

```bash
cd cdk
npm install
npx cdk deploy
```

After deployment, update your `.env.local` with the queue URL from the CDK outputs.

## 🧪 Testing

The starter includes comprehensive integration tests covering all API endpoints.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Run CDK infrastructure tests
cd cdk && npm test
```

### Test Coverage

**Integration Tests** (`tests/example-api.test.ts`):
- ✅ `GET /api/examples` - List and pagination functionality
- ✅ `POST /api/examples` - Create examples with validation
- ✅ `GET /api/examples/:id` - Retrieve specific examples
- ✅ `PUT /api/examples/:id` - Full example updates
- ✅ `PATCH /api/examples/:id` - Partial example updates  
- ✅ `DELETE /api/examples/:id` - Example deletion
- ✅ `POST /api/example-job` - SQS job queuing

**CDK Tests** (`cdk/test/cdk.test.ts`):
- ✅ SQS queue creation and configuration
- ✅ Lambda function deployment
- ✅ IAM permissions and policies
- ✅ Event source mapping
- ✅ CloudFormation outputs

### Test Features

- **Automatic cleanup** prevents database pollution between tests
- **Resource tracking** ensures proper test isolation
- **Comprehensive validation** of API responses and error states
- **Edge case coverage** for missing fields and invalid requests

## 🌐 Deployment

### Local Development

```bash
# Start database
docker-compose up -d

# Start development server
npm run dev
```

### AWS Amplify Deployment

1. **Connect Repository**: Link your Git repository to AWS Amplify
2. **Configure Environment**: Set environment variables in Amplify Console
3. **Deploy**: Amplify will automatically build and deploy your application

Required Amplify environment variables:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
AWS_REGION=us-west-2
EXAMPLE_QUEUE_URL=https://sqs.region.amazonaws.com/account/example-sqs-queue
NEXTAUTH_SECRET=your-secret-key
```

### CDK Infrastructure Deployment

Deploy the background processing infrastructure:

```bash
cd cdk
npm install
npx cdk bootstrap  # First time only
npx cdk deploy
```

**Infrastructure Components:**
- **example-sqs-queue**: SQS queue for processing example jobs
- **example-lambda-function**: Lambda function that processes examples
- **IAM Policies**: Permissions for Lambda to consume SQS messages
- **Event Source Mapping**: Connects SQS queue to Lambda function

### Testing Background Processing

1. Deploy the CDK stack and update your environment variables
2. Create an example via the web interface
3. View the example and click "Process Example"
4. Check AWS CloudWatch logs for the Lambda function to see processed data

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create and apply new migration
npx prisma migrate deploy # Apply existing migrations
npx prisma studio       # Open database GUI

# Testing
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode

# CDK Infrastructure
cd cdk && npx cdk deploy    # Deploy infrastructure
cd cdk && npx cdk destroy   # Remove infrastructure
cd cdk && npm test          # Test CDK configuration

# Code Quality
npm run prettier        # Format code
```

## 📚 Development Guide

### Adding New Features

1. **Database Changes**:
   ```bash
   # Update prisma/schema.prisma
   npx prisma migrate dev --name descriptive_name
   npx prisma generate
   ```

2. **API Endpoints**: Add new routes in `app/api/`
3. **Pages**: Create new pages in `app/`
4. **Components**: Add reusable components in `ui/`
5. **Tests**: Add tests in `tests/`

### Styling Guidelines

The project uses Tailwind CSS with a consistent dark theme:

- **Background**: `gray-950` / `black`
- **Text**: `white` / `gray-400` / `gray-300`
- **Borders**: `gray-800` / `gray-700`
- **Buttons**: `white` text on dark backgrounds
- **Hover States**: Consistent across components

### Code Organization

- **API Routes**: Follow RESTful conventions
- **Components**: Use TypeScript interfaces for props
- **Database**: Use Prisma for all database operations
- **Error Handling**: Consistent error responses across APIs
- **Testing**: Write integration tests for all new features

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**:
```bash
# Ensure PostgreSQL is running
docker-compose up -d

# Check connection
npx prisma studio
```

**CDK Deployment Failures**:
```bash
# Ensure AWS credentials are configured
aws configure

# Bootstrap CDK (first time only)
npx cdk bootstrap
```

**Test Failures**:
```bash
# Ensure database is running and migrations applied
docker-compose up -d
npx prisma migrate deploy
```

**Environment Variables**:
- Verify all required environment variables are set
- Check `.env.local` file exists and is properly configured
- Ensure AWS credentials have necessary permissions

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the test files for usage examples
- Open an issue in the repository

---

Built with ❤️ using Next.js, AWS, and modern web technologies.