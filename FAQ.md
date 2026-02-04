# Frequently Asked Questions (FAQ)

## General Questions

### What is CLOWBOT?

CLOWBOT is a Feishu (Lark) bot application that provides advanced bot capabilities including streaming card support for real-time, interactive content delivery.

### What is Feishu?

Feishu (飞书, also known as Lark internationally) is an enterprise collaboration platform by ByteDance. It provides messaging, video conferencing, calendar, and other productivity tools.

### Is CLOWBOT free to use?

This depends on your implementation. The documentation provided is open-source, but Feishu may have usage fees depending on your organization's plan.

## Setup and Configuration

### How do I get started with CLOWBOT?

Follow the [QUICKSTART.md](QUICKSTART.md) guide. It takes about 5 minutes to set up a basic bot.

### What are the minimum requirements?

- A Feishu developer account
- Access to Feishu Open Platform console
- A server or hosting platform to run your bot
- Internet connectivity

### Do I need a paid Feishu account?

A standard Feishu developer account is sufficient for development and testing. Production deployments may require a paid plan depending on usage volume.

## Permission Issues

### Why am I getting "Access denied" errors?

The most common cause is missing the `cardkit:card:write` permission. This permission is **required** for creating streaming cards.

**Solution**: Enable `cardkit:card:write` in your Feishu app console → Permissions & Scopes

### How do I enable the cardkit:card:write permission?

1. Go to [Feishu Open Platform](https://open.feishu.cn/)
2. Open your application
3. Navigate to **Permissions & Scopes**
4. Search for `cardkit:card:write`
5. Click **Apply**, then **Activate** after approval
6. Restart your application

See [PERMISSIONS.md](PERMISSIONS.md) for detailed instructions.

### My permission request was approved, but I still get errors. Why?

**Common causes**:
1. Application hasn't been restarted (required to get new token with updated permissions)
2. Permission hasn't propagated yet (wait 5-10 minutes)
3. Cached token doesn't include the new permission (clear cache)

**Solution**: Restart your application and wait a few minutes.

### Can I use CLOWBOT without the cardkit:card:write permission?

Not fully. Streaming cards are a core feature and require this permission. Without it, the bot will fail when trying to create interactive cards.

### What if the cardkit:card:write permission is not available?

**Possible reasons**:
- Your application type doesn't support it
- Geographic or plan restrictions
- Account verification issues

**Solutions**:
- Verify your app is configured as a "Bot" type
- Check your Feishu plan
- Contact Feishu support: support@feishu.cn

### How long does permission approval take?

Standard permissions like `cardkit:card:write` are usually **approved instantly**. Sensitive or custom permissions may take 1-3 business days.

## Technical Issues

### The bot doesn't respond to messages. What should I check?

1. **Application is running**: Check logs for errors
2. **Webhook URL is correct**: Verify in Feishu console
3. **Permissions enabled**: Ensure `im:message` is active
4. **Bot is added**: The bot must be added to the chat/group
5. **Events subscribed**: Check event subscriptions in console

### How do I test if my webhook is working?

1. Use a tool like ngrok to expose your local server
2. Test the webhook URL manually with curl:
   ```bash
   curl -X POST https://your-domain.com/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```
3. Check application logs for incoming requests

### Where can I see detailed error logs?

Set `LOG_LEVEL=debug` in your environment to see detailed logs. Monitor these modules:
- `feishu-monitor`: Event reception
- `feishu-streaming`: Streaming card operations  
- `feishu-message`: Message processing

### My streaming cards aren't updating in real-time. Why?

**Common causes**:
1. Missing `cardkit:card:write` permission
2. Network connectivity issues
3. Incorrect card ID or token
4. Rate limiting

**Debug steps**:
1. Check logs for update errors
2. Verify permission is active
3. Test with a simple card update
4. Check API rate limits

## Development

### What programming languages are supported?

The documentation is language-agnostic. You can implement CLOWBOT in any language that supports:
- HTTP/HTTPS requests
- Webhook handling
- JSON processing

Popular choices: Node.js, Python, Go, Java

### Is there sample code available?

The current repository contains documentation. Sample code implementation depends on your chosen technology stack. Refer to [Feishu API documentation](https://open.feishu.cn/document/) for API examples.

### Can I use existing Feishu SDKs?

Yes! Feishu provides official SDKs for several languages:
- Node.js: [@larksuiteoapi/node-sdk](https://www.npmjs.com/package/@larksuiteoapi/node-sdk)
- Python: [lark-oapi](https://pypi.org/project/lark-oapi/)
- Go: [lark](https://github.com/larksuite/oapi-sdk-go)
- Java: [oapi-sdk-java](https://github.com/larksuite/oapi-sdk-java)

### How do I handle webhook verification?

Feishu sends a verification challenge when you configure the webhook URL:

```javascript
// Example verification handling
if (event.type === 'url_verification') {
  return {
    challenge: event.challenge
  };
}
```

### How do I secure my bot?

1. **Never commit credentials**: Use environment variables
2. **Validate requests**: Check verification token
3. **Use HTTPS**: Always use encrypted connections
4. **Enable encryption**: Use Feishu message encryption
5. **Principle of least privilege**: Only enable needed permissions
6. **Monitor access**: Check logs for suspicious activity

## Production and Deployment

### What are the deployment requirements?

- Publicly accessible HTTPS endpoint
- Reliable server/hosting (99.9% uptime recommended)
- SSL certificate (required for webhooks)
- Sufficient resources (depends on usage volume)

### Can I deploy CLOWBOT on serverless platforms?

Yes! CLOWBOT can run on:
- AWS Lambda
- Google Cloud Functions
- Azure Functions
- Vercel
- Netlify Functions

Note: Configure webhook URLs appropriately for your platform.

### How do I handle high traffic?

- Use load balancing
- Implement caching (Redis recommended)
- Queue long-running tasks
- Monitor performance metrics
- Scale horizontally as needed

### What about rate limits?

Feishu API has rate limits:
- Generally: 50-100 requests/second per app
- Check specific API documentation for exact limits
- Implement exponential backoff for retries
- Cache frequently accessed data

## Troubleshooting

### Where can I get help?

1. **Quick issues**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Permission problems**: [PERMISSIONS.md](PERMISSIONS.md)
3. **Setup help**: [QUICKSTART.md](QUICKSTART.md)
4. **Feishu docs**: [https://open.feishu.cn/document/](https://open.feishu.cn/document/)
5. **Feishu support**: support@feishu.cn

### How do I report a bug?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
2. Gather relevant information:
   - Error messages
   - Logs (with sensitive data removed)
   - Steps to reproduce
   - Environment details
3. Open an issue in the GitHub repository

### The documentation doesn't cover my use case. What should I do?

1. Check [Feishu Open Platform documentation](https://open.feishu.cn/document/)
2. Search Feishu developer community
3. Ask in developer forums
4. Contact Feishu support
5. Contribute to this documentation!

## Contributing

### Can I contribute to this documentation?

Yes! Contributions are welcome:
- Fix typos or errors
- Add examples
- Improve explanations
- Translate to other languages
- Share solutions to common problems

### How do I suggest improvements?

Open an issue or pull request on GitHub with your suggestions.

## Miscellaneous

### Does CLOWBOT support multiple languages?

The bot can be configured to support multiple languages. Implementation depends on your code.

### Can I customize the bot's responses?

Yes, absolutely! This documentation provides the foundation. You can customize:
- Response messages
- Card designs
- Interaction flows
- Business logic

### Is there a demo or live example?

Contact the repository maintainer for demo access or deployment examples.

### What's the difference between Feishu and Lark?

They are the same product:
- **Feishu (飞书)**: Used in China
- **Lark**: International version
- APIs and functionality are nearly identical

### How often is this documentation updated?

Documentation is maintained alongside the project. Check the repository for the latest updates.

### Can I use CLOWBOT for commercial purposes?

Check the repository license. For Feishu-specific terms, review the [Feishu Developer Agreement](https://www.feishu.cn/developer/terms).

## Still Have Questions?

- 📧 Email: (add your support email)
- 💬 Feishu Support: support@feishu.cn  
- 📚 Documentation: [Feishu Open Platform](https://open.feishu.cn/document/)
- 🐛 Issues: [GitHub Issues](https://github.com/nansuki1987/CLOWBOT/issues)

---

**Pro Tip**: 90% of issues are resolved by ensuring `cardkit:card:write` permission is properly enabled! ⚠️
