# CDK Infrastructure for Long-Running Test Execution

This project uses AWS CDK to deploy SQS + Lambda infrastructure for handling long-running test executions that exceed Amplify's 30-second timeout.

## Architecture

```
API Route (Amplify) → SQS Queue → Lambda Function (15min timeout) → Database Update
```

## Setup

### 1. Install AWS CLI and Configure
```bash
aws configure
# Enter your AWS Access Key ID, Secret, Region, and Output format
```

### 2. Bootstrap CDK (one-time setup)
```bash
cd infrastructure
npx cdk bootstrap
```

### 3. Set Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - Your RDS connection string
- `OPENAI_API_KEY` - Your OpenAI API key
- `AWS_REGION` - AWS region (e.g., us-west-2)
- `CDK_DEFAULT_ACCOUNT` - Your AWS account ID
- `CDK_DEFAULT_REGION` - Same as AWS_REGION

### 4. Deploy Infrastructure
```bash
# Build Lambda function and deploy CDK stack
npm run cdk:deploy

# Or deploy both CDK and Amplify
npm run deploy:all
```

### 5. Update Amplify Environment Variables
After deployment, add the SQS queue URL to your Amplify app:

1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add: `TEST_RUN_QUEUE_URL` = `<queue-url-from-cdk-output>`
4. Add: `AWS_REGION` = `<your-aws-region>`
5. Redeploy your Amplify app

## How It Works

### Without SQS (Direct Execution)
- API route calls `executeTestRun()` directly
- Limited to ~30 seconds by Amplify
- Test runs get stuck in "pending" status

### With SQS + Lambda
- API route sends message to SQS queue
- Lambda function processes the message
- Lambda has 15-minute timeout for long test runs
- Test runs complete successfully

### Fallback Behavior
The API route automatically falls back to direct execution if:
- `TEST_RUN_QUEUE_URL` is not set
- SQS is unavailable
- Message sending fails

## Monitoring

### CloudWatch Logs
- Lambda logs: `/aws/lambda/mercury-test-runner`
- SQS dead letter queue for failed messages

### SQS Monitoring
- Queue depth and message processing rates
- Dead letter queue for debugging failed executions

## Commands

```bash
# Build Lambda function only
npm run cdk:build

# Deploy CDK infrastructure only
npm run cdk:deploy

# Deploy both CDK and Amplify
npm run deploy:all

# Destroy CDK infrastructure
npm run cdk:destroy
```

## Cost Optimization

- Lambda only runs when processing test runs
- SQS charges per message (~$0.0000004 per message)
- Dead letter queue prevents infinite retries
- 15-minute Lambda timeout prevents runaway costs

## Troubleshooting

### Test runs still stuck in pending?
1. Check Amplify environment variables are set
2. Check CloudWatch logs for Lambda function
3. Check SQS queue for messages in dead letter queue
4. Verify RDS connectivity from Lambda

### SQS permissions error?
1. Ensure your AWS credentials have SQS permissions
2. Check Lambda execution role has SQS access
3. Verify queue URL is correct in environment variables