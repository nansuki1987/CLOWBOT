# CLOWBOT

A Feishu (Lark) bot application with advanced features including streaming card support.

## Overview

CLOWBOT is designed to integrate with Feishu (飞书/Lark) to provide interactive bot capabilities with streaming card functionality for real-time updates and rich user interactions.

## Prerequisites

Before deploying CLOWBOT, ensure you have:

1. A Feishu (Lark) application account
2. Access to the Feishu Open Platform console
3. Administrative permissions to configure app scopes

## Required Feishu Permissions

### Critical Permissions

The following permissions (scopes) are **required** for CLOWBOT to function properly:

#### 1. `cardkit:card:write` (Required)
This permission is essential for creating and managing streaming cards. Without this permission, you will encounter errors like:
```
Failed to create streaming card: Access denied. One of the following scopes is required: [cardkit:card:write]
```

**How to enable:**
1. Go to the [Feishu Open Platform](https://open.feishu.cn/)
2. Navigate to your application console
3. Go to **Permissions & Scopes** section
4. Search for `cardkit:card:write`
5. Click **Apply** to request this permission
6. Wait for approval (usually automatic for standard permissions)
7. After approval, click **Activate** to enable the permission

### Other Recommended Permissions

For full functionality, consider enabling:
- `im:message` - Send and receive messages
- `im:message.group_at_msg` - Receive group @ mentions
- `im:resource` - Upload and manage resources (images, files)

## Setup Instructions

### 1. Create Feishu Application

1. Visit [Feishu Open Platform](https://open.feishu.cn/)
2. Click **Create Application**
3. Fill in application details:
   - Application Name: CLOWBOT
   - Description: Your bot description
   - Icon: Upload your bot icon

### 2. Configure Permissions

**Critical Step**: Enable the `cardkit:card:write` permission:

1. In your app console, click **Permissions & Scopes** (权限管理)
2. Find **Card Kit** (卡片) section
3. Enable `cardkit:card:write` permission:
   - Click the **Apply** button
   - If prompted, provide a reason: "Required for streaming card functionality"
   - Wait for approval (typically instant)
   - Click **Activate** once approved

### 3. Configure Event Subscriptions

1. Go to **Event Subscriptions** in your app console
2. Enable **Message Events**
3. Subscribe to necessary events:
   - `im.message.receive_v1` - Receive messages
   - `im.message.message_read_v1` - Message read status

### 4. Get Credentials

1. Navigate to **Credentials & Basic Info**
2. Note down:
   - App ID
   - App Secret
   - Verification Token
   - Encrypt Key (if using encryption)

### 5. Deploy Application

Configure your environment with the credentials:

```bash
export FEISHU_APP_ID="your_app_id"
export FEISHU_APP_SECRET="your_app_secret"
export FEISHU_VERIFICATION_TOKEN="your_verification_token"
export FEISHU_ENCRYPT_KEY="your_encrypt_key"
```

## Troubleshooting

### Error: "Failed to create streaming card: Access denied"

**Problem**: The application doesn't have the `cardkit:card:write` permission.

**Solution**:
1. Go to your [Feishu app console](https://open.feishu.cn/app/)
2. Select your application
3. Navigate to **Permissions & Scopes**
4. Search for `cardkit:card:write`
5. Click **Apply** and then **Activate** after approval
6. Restart your application

**Direct Link**: If you see an error message with a link like:
```
https://open.feishu.cn/app/cli_a9f590bd7a78dcc9/auth?q=cardkit:card:write&op_from=openapi&token_type=tenant
```
Click this link to directly navigate to the permission request page.

### Error: "Failed to start streaming session"

This error is typically related to missing `cardkit:card:write` permission. Follow the steps above to enable it.

### Permission Not Available

If the `cardkit:card:write` permission is not available in your region or plan:
1. Contact Feishu support to request access
2. Check if your application type supports Card Kit features
3. Verify your Feishu plan includes advanced bot features

## Architecture

The bot consists of several modules:
- `feishu-monitor`: Monitors and receives Feishu events
- `feishu-message`: Handles message processing and responses
- `feishu-streaming`: Manages streaming card creation and updates

## Development

(Add your development setup instructions here)

## License

(Add your license information here)

## Support

For issues related to Feishu permissions, refer to:
- [Feishu Open Platform Documentation](https://open.feishu.cn/document/)
- [Card Kit API Reference](https://open.feishu.cn/document/ukTMukTMukTM/uYjNwUjL2YDM14iN2ATN)