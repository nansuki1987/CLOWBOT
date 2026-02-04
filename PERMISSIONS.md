# Feishu Permissions Configuration Guide

## Overview

This guide provides detailed information about configuring permissions (scopes) for your Feishu bot application. Proper permission configuration is critical for CLOWBOT to function correctly.

## Understanding Feishu Permissions

Feishu uses an OAuth-style permission system where applications must explicitly request and be granted permissions before accessing specific APIs or features.

### Permission Types

1. **Required Permissions**: Must be enabled for core functionality
2. **Optional Permissions**: Enhance functionality but not critical
3. **Sensitive Permissions**: May require additional approval process

## Required Permissions for CLOWBOT

### 1. Card Kit Write (`cardkit:card:write`)

**Priority**: **CRITICAL** ⚠️

**Purpose**: 
- Create streaming cards
- Update card content in real-time
- Display rich, interactive content to users

**Without this permission, you will see**:
```
Failed to create streaming card: Access denied. 
One of the following scopes is required: [cardkit:card:write]
应用尚未开通所需的应用身份权限：[cardkit:card:write]
```

**How to Enable**:

#### Method 1: Via Console (Recommended)
1. Open [Feishu Open Platform Console](https://open.feishu.cn/app/)
2. Select your application
3. Navigate to **Permissions & Scopes** (权限管理)
4. Search for `cardkit:card:write`
5. Click **Apply** (申请权限)
6. After approval, click **Activate** (开通)

#### Method 2: Via Direct Link
When you see the error, it includes a direct link:
```
https://open.feishu.cn/app/[YOUR_APP_ID]/auth?q=cardkit:card:write&op_from=openapi&token_type=tenant
```
Click this link to go directly to the permission request page.

#### Method 3: Via API (Advanced)
You cannot programmatically enable permissions via API. All permission changes must be done through the console.

**Approval Process**:
- **Type**: Standard permission
- **Approval Time**: Usually instant
- **Requirements**: Valid bot application

**Verification**:
```bash
# Check if permission is active by attempting to create a card
# If successful, permission is properly configured
```

### 2. Instant Messaging (`im:message`)

**Priority**: Required

**Purpose**:
- Send messages to users
- Receive messages from users
- Basic bot communication

**How to Enable**:
1. Go to **Permissions & Scopes**
2. Find **Instant Messaging** section
3. Enable `im:message`

### 3. Group Messages (`im:message.group_at_msg`)

**Priority**: Required for group interactions

**Purpose**:
- Receive @ mentions in groups
- Respond to group messages
- Participate in group chats

**How to Enable**:
1. Go to **Permissions & Scopes**
2. Find `im:message.group_at_msg`
3. Enable the permission

## Optional Permissions

### Resource Management (`im:resource`)

**Priority**: Optional but recommended

**Purpose**:
- Upload images and files
- Share rich media content
- Enhanced user experience

### User Information (`contact:user.base:readonly`)

**Priority**: Optional

**Purpose**:
- Get user profile information
- Personalize responses
- User identification

## Permission Configuration Checklist

Use this checklist when setting up a new CLOWBOT instance:

- [ ] Application created in Feishu Open Platform
- [ ] **`cardkit:card:write` permission applied** (CRITICAL)
- [ ] **`cardkit:card:write` permission activated** (CRITICAL)
- [ ] `im:message` permission enabled
- [ ] `im:message.group_at_msg` permission enabled (if using groups)
- [ ] `im:resource` permission enabled (if sharing media)
- [ ] Event subscriptions configured
- [ ] Webhook URL verified
- [ ] Application credentials configured in environment
- [ ] Application restarted after permission changes
- [ ] Test message sent successfully
- [ ] Streaming card test successful

## Permission Best Practices

### 1. Request Only What You Need
- Only enable permissions that your application actually uses
- This reduces security risk and approval complexity
- Users are more likely to trust apps with minimal permissions

### 2. Enable Permissions Before Deployment
- Configure all required permissions during setup
- Avoid runtime permission errors
- Test thoroughly before going live

### 3. Handle Permission Errors Gracefully
- Check for permission errors in your code
- Provide helpful error messages to users
- Log permission issues for debugging

### 4. Document Permission Requirements
- List all required permissions in documentation
- Explain why each permission is needed
- Update documentation when requirements change

### 5. Monitor Permission Status
- Regularly verify permissions are still active
- Check for permission deprecations or changes
- Update SDK/API versions as needed

## Troubleshooting Permission Issues

### Permission Not Available in Console

**Possible Causes**:
1. Application type doesn't support the permission
2. Geographic restrictions
3. Plan/tier limitations

**Solutions**:
1. Verify application is configured as "Bot" type
2. Check Feishu plan includes advanced features
3. Contact Feishu support for access

### Permission Request Denied

**Possible Causes**:
1. Invalid reason provided
2. Account verification issues
3. Policy violations

**Solutions**:
1. Provide detailed, valid use case
2. Verify developer account status
3. Review Feishu developer policies
4. Resubmit request with more information

### Permission Active But Still Getting Errors

**Possible Causes**:
1. Token not refreshed
2. Permission not propagated yet
3. Using cached token without new scope

**Solutions**:
1. Restart application to get new token
2. Wait 5-10 minutes for propagation
3. Clear token cache
4. Request new `tenant_access_token`

### Code Example: Checking Permissions

```javascript
// Example: Graceful permission error handling
async function createStreamingCard(content) {
  try {
    const card = await feishuClient.createCard(content);
    return { success: true, card };
  } catch (error) {
    if (error.code === 99991663) { // Permission denied error code
      console.error('Missing cardkit:card:write permission');
      console.error('Please enable at: https://open.feishu.cn/app/');
      return { 
        success: false, 
        error: 'Permission denied',
        message: 'Please enable cardkit:card:write permission in Feishu console'
      };
    }
    throw error;
  }
}
```

## Getting Permission Help

### Official Resources
- [Feishu Permission Documentation](https://open.feishu.cn/document/ukTMukTMukTM/uQjN3QjL0YzN04CN2cDN)
- [Card Kit Guide](https://open.feishu.cn/document/ukTMukTMukTM/uYjNwUjL2YDM14iN2ATN)
- [API Authentication](https://open.feishu.cn/document/ukTMukTMukTM/uMTNz4yM1MjLzUzM)

### Support Channels
- **Email**: support@feishu.cn
- **Console**: Submit ticket via Open Platform console
- **Forum**: [Feishu Developer Community](https://open.feishu.cn/community)

## FAQ

### Q: How long does permission approval take?
**A**: Standard permissions like `cardkit:card:write` are usually approved instantly. Custom or sensitive permissions may take 1-3 business days.

### Q: Can I enable permissions programmatically?
**A**: No, all permissions must be enabled through the Feishu Open Platform console.

### Q: Do I need to restart my app after enabling permissions?
**A**: Yes, the application needs to obtain a new access token that includes the new permissions.

### Q: What if my permission request is rejected?
**A**: Review the rejection reason, address any issues, and resubmit. If unclear, contact Feishu support.

### Q: Are there permission quotas or limits?
**A**: Some permissions may have rate limits on API calls, but there's no limit on the number of permissions you can enable.

### Q: Can permissions be revoked?
**A**: Yes, Feishu may revoke permissions if:
- Application violates policies
- Permission is misused
- Application is reported by users
- Account verification issues

### Q: Do permissions expire?
**A**: No, once granted, permissions remain active unless explicitly revoked or the app is deleted.
