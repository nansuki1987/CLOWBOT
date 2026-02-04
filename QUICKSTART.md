# Quick Setup Guide

Get CLOWBOT up and running in 5 minutes!

## Prerequisites
- [ ] Feishu (Lark) developer account
- [ ] Access to Feishu Open Platform console

## Step-by-Step Setup

### 1. Create Application (2 minutes)

1. Go to [Feishu Open Platform](https://open.feishu.cn/)
2. Click **Create Application** → **Bot**
3. Fill in:
   - **Name**: CLOWBOT
   - **Description**: AI-powered Feishu bot
   - **Icon**: (upload your icon)
4. Click **Create**

### 2. Enable Required Permission (1 minute) ⚠️ CRITICAL

**You MUST enable this permission or the bot will not work!**

1. In your app console, click **Permissions & Scopes** (权限管理)
2. Search: `cardkit:card:write`
3. Click **Apply** (申请权限)
4. Click **Activate** (开通) after approval
5. ✅ Verify status shows as **Active** (已开通)

**Why is this needed?**
Without `cardkit:card:write`, you'll see this error:
```
Failed to create streaming card: Access denied
```

### 3. Enable Additional Permissions (1 minute)

Search and enable these permissions:

- [ ] `im:message` - Send/receive messages
- [ ] `im:message.group_at_msg` - Group @ mentions
- [ ] `im:resource` - Upload images/files (optional)

### 4. Configure Events (30 seconds)

1. Click **Event Subscriptions** (事件订阅)
2. Enter your webhook URL: `https://your-domain.com/webhook`
3. Subscribe to events:
   - [ ] `im.message.receive_v1`
   - [ ] `im.message.message_read_v1`
4. Click **Save**

### 5. Get Credentials (30 seconds)

1. Go to **Credentials & Basic Info** (凭证与基础信息)
2. Copy these values:
   - App ID
   - App Secret
   - Verification Token
   - Encrypt Key

### 6. Configure Environment

Create a `.env` file or set environment variables:

```bash
export FEISHU_APP_ID="cli_xxxxxxxxxxxxxxxx"
export FEISHU_APP_SECRET="your_app_secret_here"
export FEISHU_VERIFICATION_TOKEN="your_verification_token"
export FEISHU_ENCRYPT_KEY="your_encrypt_key"
```

### 7. Deploy & Test

```bash
# Start your application
npm start
# or
docker-compose up
# or
./start.sh

# Test by sending a message to your bot in Feishu
```

## Verification Checklist

✅ **Verify your setup is complete:**

- [ ] Application created successfully
- [ ] **`cardkit:card:write` permission is ACTIVE** (most important!)
- [ ] `im:message` permission enabled
- [ ] Event subscriptions configured
- [ ] Webhook URL accessible from internet
- [ ] Environment variables set correctly
- [ ] Application started without errors
- [ ] Bot responds to test messages
- [ ] Streaming cards work correctly (no access denied errors)

## Common Issues

### ❌ "Access denied" error

**Problem**: Missing `cardkit:card:write` permission

**Fix**: 
1. Go to your app console → **Permissions & Scopes**
2. Enable `cardkit:card:write`
3. Restart your application

**Direct link** (replace with your app ID):
```
https://open.feishu.cn/app/cli_YOUR_APP_ID/auth?q=cardkit:card:write
```

### ❌ Bot doesn't respond

**Check**:
1. Application is running (check logs)
2. Webhook URL is correct and accessible
3. `im:message` permission is enabled
4. Bot is added to the chat/group

### ❌ "Permission not found" error

**Fix**: 
- Make sure your app type is "Bot"
- Check your Feishu plan supports Card Kit
- Contact support if permission is unavailable

## Next Steps

- [ ] Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed error solutions
- [ ] Review [PERMISSIONS.md](PERMISSIONS.md) for complete permission guide
- [ ] Check [README.md](README.md) for full documentation
- [ ] Test all bot features
- [ ] Deploy to production

## Need Help?

- **Quick issue?** → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Permission problems?** → See [PERMISSIONS.md](PERMISSIONS.md)
- **Feishu support**: support@feishu.cn
- **Documentation**: https://open.feishu.cn/document/

---

⚠️ **Remember**: The most common issue is forgetting to enable `cardkit:card:write` permission!
