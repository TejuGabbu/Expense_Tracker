# Expense Tracker (React)

This is a React version of the [vanilla JS Expense Tracker](https://github.com/bradtraversy/vanillawebprojects/tree/master/expense-tracker). It uses functional components with hooks and the context API

## Usage
```
npm install

# Run on http://localhost:3000
npm start

# Build for prod
npm run build
```
## Live Demo & AWS Hosting
- **Live S3 Website URL**: [http://luv-kush.s3-website.eu-north-1.amazonaws.com](http://luv-kush.s3-website.eu-north-1.amazonaws.com)

## AWS CI/CD Pipeline
This project is equipped with automated CI/CD for AWS:
- **Build Specification**: [`buildspec.yml`](./buildspec.yml)
- **Infrastructure as Code (CloudFormation)**: [`aws-cicd-pipeline.yml`](./aws-cicd-pipeline.yml)
- **GitHub Actions Workflow**: [`.github/workflows/aws-deploy.yml`](./.github/workflows/aws-deploy.yml)
- **Step-by-Step Setup Guide**: See [**AWS_CICD_SETUP_GUIDE.md**](./AWS_CICD_SETUP_GUIDE.md) for full instructions on setting up AWS CodePipeline, S3 static hosting, and automatic triggers.
