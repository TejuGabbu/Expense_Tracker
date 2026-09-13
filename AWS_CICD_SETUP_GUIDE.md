# Complete AWS CI/CD Pipeline Setup Guide for Expense Tracker

This guide explains how to set up an automated CI/CD pipeline on AWS for the React Expense Tracker application (`TejuGabbu/Expense_Tracker`). Whenever you push code to the `master` branch on GitHub, the pipeline automatically compiles the React application and deploys the production files to your AWS S3 static website bucket (`luv-kush`).

---

## 📐 Architecture Overview

```
 [GitHub Repository]
 (TejuGabbu/Expense_Tracker)
         │
         ▼ (Webhook on push to 'master')
 [AWS CodePipeline]
         │
         ├─► [1. Source Stage]  : CodeStar GitHub v2 Connection
         ├─► [2. Build Stage]   : AWS CodeBuild (runs buildspec.yml)
         └─► [3. Deploy Stage]  : Amazon S3 (extracts build/ to 'luv-kush')
                                         │
                                         ▼
                             [Static Website Hosting]
                  http://luv-kush.s3-website.eu-north-1.amazonaws.com
```

---

## 🛠️ Step 1: Configure S3 Static Website Hosting (One-time Setup)

Make sure your target S3 bucket (`luv-kush`) is configured to host static websites and allows public read access for web visitors.

### 1.1 Disable "Block all public access"
1. In the **AWS Management Console**, navigate to **Amazon S3** -> select your bucket `luv-kush`.
2. Open the **Permissions** tab.
3. Under **Block public access (bucket settings)**, click **Edit**.
4. Uncheck **Block *all* public access** and save changes (type `confirm`).

### 1.2 Enable Static Website Hosting
1. Switch to the **Properties** tab of the `luv-kush` bucket.
2. Scroll to the bottom to **Static website hosting** and click **Edit**.
3. Select **Enable**.
4. Hosting type: **Host a static website**.
5. **Index document**: `index.html`.
6. **Error document**: `index.html` *(essential for Single Page Applications)*.
7. Click **Save changes**. Note down your Bucket website endpoint (e.g., `http://luv-kush.s3-website.eu-north-1.amazonaws.com`).

### 1.3 Add Bucket Policy for Public Read
1. Go back to the **Permissions** tab -> **Bucket policy** -> click **Edit**.
2. Paste the following JSON policy (replace `luv-kush` if your bucket name differs):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::luv-kush/*"
        }
    ]
}
```
3. Click **Save changes**.

---

## 🚀 Step 2: Choose Your CI/CD Deployment Method

Choose either **Method A** (Automated CloudFormation), **Method B** (AWS Console UI), or **Method C** (GitHub Actions).

---

### 🔹 Method A: 1-Click Automated Setup using CloudFormation (Recommended)

The repository includes [`aws-cicd-pipeline.yml`](./aws-cicd-pipeline.yml). This template automatically provisions the entire pipeline, IAM roles, CodeBuild project, and S3 deployment action.

#### Step A.1: Create GitHub Connection in AWS (1-minute step)
1. Go to **AWS CodePipeline Console** in `eu-north-1` (or your preferred region).
2. In the left sidebar, expand **Settings** -> click **Connections**.
3. Click **Create connection**.
4. Provider: **GitHub**. Connection name: `github-tejugabbu`.
5. Click **Connect to GitHub** -> follow prompt to authorize AWS and select your repository `TejuGabbu/Expense_Tracker`.
6. Once connected, copy the **Connection ARN** (looks like: `arn:aws:codestar-connections:eu-north-1:123456789012:connection/xxx-xxx`).

#### Step A.2: Launch the CloudFormation Stack
1. In the AWS Console, open **CloudFormation** -> click **Create stack** (With new resources).
2. Select **Upload a template file** -> click **Choose file** -> select [`aws-cicd-pipeline.yml`](./aws-cicd-pipeline.yml) from your project folder.
3. Click **Next**.
4. Specify Stack Details:
   - **Stack name**: `expense-tracker-cicd`
   - **GitHubRepoOwner**: `TejuGabbu`
   - **GitHubRepoName**: `Expense_Tracker`
   - **GitHubBranch**: `master`
   - **TargetS3Bucket**: `luv-kush`
   - **CodeStarConnectionArn**: Paste the Connection ARN from Step A.1.
5. Click **Next**, leave default options, click **Next**.
6. Under **Capabilities**, check **"I acknowledge that AWS CloudFormation might create IAM resources"**.
7. Click **Submit**.

CloudFormation will automatically provision your pipeline within 2 minutes!

---

### 🔹 Method B: Manual Setup via AWS Management Console

If you prefer building the pipeline visually using the AWS Web Console:

#### 1. Navigate to AWS CodePipeline
1. Go to **AWS Management Console** -> **CodePipeline** -> click **Create pipeline**.
2. **Pipeline settings**:
   - Pipeline name: `Expense-Tracker-Pipeline`
   - Pipeline type: **V2**
   - Execution mode: **Queued** (or Superseded)
   - Service role: **New service role** (allows AWS to create the necessary role automatically).
   - Click **Next**.

#### 2. Source Stage
1. Source provider: **GitHub (Version 2)**.
2. Connection: Select your GitHub connection (or click **Connect to GitHub** to link your account).
3. Repository name: `TejuGabbu/Expense_Tracker`.
4. Branch name: `master`.
5. Trigger: **Start the pipeline on source code change** (checked).
6. Output artifact format: **CodePipeline default**.
7. Click **Next**.

#### 3. Build Stage
1. Build provider: **AWS CodeBuild**.
2. Region: `eu-north-1` (same as your bucket).
3. Project name: Click **Create project** (opens a popup):
   - **Project name**: `expense-tracker-build`
   - **Environment image**: Managed image
   - **Operating system**: `Ubuntu`
   - **Runtime(s)**: `Standard`
   - **Image**: `aws/codebuild/standard:7.0`
   - **Environment type**: `Linux`
   - **Service role**: New service role
   - **Buildspec**: Choose **Use a buildspec file** -> Buildspec name: `buildspec.yml` (already created in the repository root).
   - Click **Continue to CodePipeline**.
4. Back in the CodePipeline tab, click **Next**.

#### 4. Deploy Stage
1. Deploy provider: **Amazon S3**.
2. Region: `eu-north-1` (or your bucket's region).
3. Bucket: `luv-kush`.
4. **IMPORTANT**: Check **Extract file before deploy**. *(This extracts the files from the build zip directly into the root of your S3 bucket!)*
5. Click **Next**.

#### 5. Review & Create
1. Review all configurations.
2. Click **Create pipeline**.

---

### 🔹 Method C: Alternative Direct GitHub Actions Pipeline

If you want GitHub to deploy directly to S3 without using CodePipeline:

1. Go to your GitHub repository: `https://github.com/TejuGabbu/Expense_Tracker`.
2. Navigate to **Settings** -> **Secrets and variables** -> **Actions** -> click **New repository secret**.
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: IAM user access key with S3 upload permissions.
   - `AWS_SECRET_ACCESS_KEY`: IAM user secret key.
   - `AWS_REGION`: `eu-north-1`
   - `S3_BUCKET_NAME`: `luv-kush`
4. The workflow in [`.github/workflows/aws-deploy.yml`](./.github/workflows/aws-deploy.yml) will trigger automatically on every push to `master`.

---

## 🔍 How to Test the Pipeline

1. Make any change in the repository (for example, edit a title in `src/components/Header.js` or update `README.md`).
2. Commit and push the change to GitHub:
   ```bash
   git add .
   git commit -m "Testing AWS CI/CD pipeline"
   git push origin master
   ```
3. Open **AWS CodePipeline Console**:
   - You will see the pipeline trigger in real time.
   - **Source stage**: turns blue, then green (code fetched from GitHub).
   - **Build stage**: CodeBuild runs `npm ci` and `npm run build` using Node 18.
   - **Deploy stage**: CodePipeline extracts the build files into `luv-kush`.
4. Open your browser and refresh:
   ```
   http://luv-kush.s3-website.eu-north-1.amazonaws.com
   ```
   Your updated app will be live immediately!

---

## 💡 Troubleshooting & Tips

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **403 Forbidden on website** | S3 bucket permissions | Ensure "Block all public access" is OFF and the bucket policy from Step 1.3 is applied. |
| **Build fails on CodeBuild** | Missing dependencies or Node flag | `buildspec.yml` is preconfigured with `npm ci --legacy-peer-deps` and `CI=false` to avoid build failure on warnings. |
| **Only a .zip appears in S3** | Extract setting not enabled | In CodePipeline Deploy stage, ensure the checkbox **"Extract file before deploy"** is enabled. |
| **Blank page on deep routes** | React Router 404 | Set S3 website hosting **Error document** to `index.html`. |
