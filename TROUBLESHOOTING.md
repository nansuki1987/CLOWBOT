# Troubleshooting Guide

## Common Issues and Solutions

### 1. Access Denied Error for Streaming Cards

#### Symptoms
```
error feishu-streaming {"module":"feishu-streaming"} Failed to start streaming session: 
Error: Failed to create streaming card: Access denied. 
One of the following scopes is required: [cardkit:card:write]
```

```
warn feishu-message {"module":"feishu-message"} Failed to start streaming card: 
Error: Failed to create streaming card: Access denied.
```

#### Root Cause
The Feishu application does not have the `cardkit:card:write` permission enabled.

#### Solution Steps

**Step 1: Access Your Application Console**
1. Navigate to [Feishu Open Platform](https://open.feishu.cn/)
2. Log in with your developer account
3. Click on your application (CLOWBOT)

**Step 2: Enable Card Kit Write Permission**
1. In the left sidebar, click **Permissions & Scopes** (权限管理)
2. In the search box, type: `cardkit:card:write`
3. Locate the **Card Kit Write** permission
4. Click the **Apply** (申请) button
5. If prompted for a reason, enter: "Required for streaming card functionality in bot responses"
6. Submit the request

**Step 3: Activate the Permission**
1. Most permissions are automatically approved
2. Once approved, you'll see an **Activate** (开通) button
3. Click **Activate** to enable the permission
4. Confirm the activation

**Step 4: Verify Permission Status**
1. Refresh the permissions page
2. Verify that `cardkit:card:write` shows as **Active** (已开通)
3. The status should be green/enabled

**Step 5: Restart Your Application**
1. Restart your CLOWBOT application
2. The error should no longer occur

#### Quick Fix Link
If you received an error message with a direct link like:
```
https://open.feishu.cn/app/cli_a9f590bd7a78dcc9/auth?q=cardkit:card:write&op_from=openapi&token_type=tenant
```

Click this link to go directly to the permission request page for your application.

### 2. Permission Request Not Approved

#### Symptoms
- Permission status shows "Pending" for extended period
- Unable to activate the permission

#### Solution
1. Check your application type:
   - Ensure it's configured as a bot application
   - Verify the application is not in sandbox mode
2. Contact Feishu support:
   - Email: support@feishu.cn
   - Provide your App ID
   - Explain the need for `cardkit:card:write` permission
3. Check your account status:
   - Ensure your developer account is verified
   - Verify your organization has appropriate Feishu plan

### 3. Streaming Card Creation Still Fails After Permission Enabled

#### Symptoms
- Permission shows as active
- Still getting access denied errors
- Errors persist after restart

#### Solution
1. **Verify Token Refresh**:
   ```bash
   # The app needs to obtain a new access token after permission changes
   # Force token refresh by restarting the application
   ```

2. **Check Token Scopes**:
   - The access token must include the new permission
   - Clear any cached tokens
   - Request a fresh tenant_access_token

3. **Verify Permission Propagation**:
   - Permissions may take a few minutes to propagate
   - Wait 5-10 minutes after activation
   - Try again

4. **Check API Version**:
   - Ensure you're using the correct Card Kit API version
   - Update to the latest Feishu SDK if applicable

### 4. Other Feishu Integration Issues

#### Message Events Not Received

**Check Event Subscriptions**:
1. Go to **Event Subscriptions** in app console
2. Verify webhook URL is correct
3. Ensure URL is accessible from Feishu servers
4. Check that events are subscribed:
   - `im.message.receive_v1`
   - `im.message.message_read_v1`

**Verify Verification Token**:
1. Check that `FEISHU_VERIFICATION_TOKEN` matches the console
2. Ensure webhook endpoint validates the token correctly

#### Bot Not Responding

**Common Causes**:
1. Application not started or crashed
2. Network connectivity issues
3. Incorrect credentials (App ID, Secret)
4. Missing permissions for `im:message`

**Solutions**:
1. Check application logs for errors
2. Verify environment variables are set correctly
3. Test webhook URL manually
4. Ensure bot is added to the chat/group

### 5. Debugging Tips

#### Enable Detailed Logging
Set log level to debug to see detailed information:
```bash
export LOG_LEVEL=debug
```

#### Check Application Status
Monitor the following logs:
- `feishu-monitor`: Event reception
- `feishu-streaming`: Streaming card operations
- `feishu-message`: Message processing

#### API Testing
Test the Card Kit API directly:
```bash
# Get access token
curl -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "YOUR_APP_ID",
    "app_secret": "YOUR_APP_SECRET"
  }'

# Test card creation (replace TOKEN with actual token)
curl -X POST "https://open.feishu.cn/open-apis/card/v1/cards" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card": {
      "header": {"title": {"content": "Test Card"}}
    }
  }'
```

## Getting Help

If you continue to experience issues:

1. **Check Logs**: Review application logs for specific error messages
2. **Feishu Documentation**: [https://open.feishu.cn/document/](https://open.feishu.cn/document/)
3. **Community Forums**: Search for similar issues in Feishu developer community
4. **Support Ticket**: Submit a ticket through Feishu Open Platform console
5. **GitHub Issues**: Report bugs or request features in this repository

## Additional Resources

- [Feishu Open Platform](https://open.feishu.cn/)
- [Card Kit Documentation](https://open.feishu.cn/document/ukTMukTMukTM/uYjNwUjL2YDM14iN2ATN)
- [Permission Management Guide](https://open.feishu.cn/document/ukTMukTMukTM/uQjN3QjL0YzN04CN2cDN)
- [API Reference](https://open.feishu.cn/document/ukTMukTMukTM/uYjMwUjL2IDM14iNyATN)
