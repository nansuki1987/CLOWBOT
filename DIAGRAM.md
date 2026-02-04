# Permission Flow Diagram

## Understanding the Feishu Permission Error

This document explains the permission flow and why the `cardkit:card:write` error occurs.

## Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   User Sends Message                         │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│             Feishu Platform Receives Message                 │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│          Webhook Event Sent to Your Application              │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Your Bot (feishu-monitor) Receives Event             │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Bot Processes Message (feishu-message)               │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│     Bot Attempts to Create Streaming Card                    │
│              (feishu-streaming)                              │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
                 ┌─────────┴─────────┐
                 │  Has Permission?  │
                 │ cardkit:card:write│
                 └─────────┬─────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ↓                         ↓
         ┌─────────┐              ┌──────────┐
         │   YES   │              │    NO    │
         └────┬────┘              └─────┬────┘
              │                         │
              ↓                         ↓
    ┌─────────────────┐       ┌─────────────────────┐
    │ Create Streaming│       │  ❌ ACCESS DENIED   │
    │      Card       │       │     ERROR!          │
    │    ✅ SUCCESS   │       └─────────┬───────────┘
    └────────┬────────┘                 │
             │                          ↓
             │              ┌────────────────────────┐
             │              │ Error logged:          │
             │              │ "Failed to create      │
             │              │  streaming card:       │
             │              │  Access denied"        │
             │              └────────────┬───────────┘
             │                           │
             ↓                           ↓
    ┌────────────────┐         ┌─────────────────┐
    │  Card Displayed│         │  User sees no   │
    │   to User      │         │  card or error  │
    └────────────────┘         └─────────────────┘
```

## Permission Request Flow

```
┌──────────────────────────────────────────────────────────┐
│  Step 1: Developer Goes to Feishu Open Platform          │
│          https://open.feishu.cn/app/                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 2: Navigate to Permissions & Scopes                │
│          (权限管理)                                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 3: Search for "cardkit:card:write"                 │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 4: Click "Apply" (申请权限)                         │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 5: Permission Request Submitted                    │
│          ↓ (Usually Instant Approval)                    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 6: Click "Activate" (开通)                          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 7: Permission Status = Active ✅                    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 8: Restart Your Application                        │
│          (Gets new token with permission)                │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│  Step 9: ✅ Streaming Cards Now Work!                    │
└──────────────────────────────────────────────────────────┘
```

## What Happens Without Permission

```
┌────────────────────────────────────────────────┐
│     Bot Tries to Call Feishu Card API          │
│     POST /open-apis/card/v1/cards              │
│     Authorization: Bearer {token}              │
└─────────────────┬──────────────────────────────┘
                  │
                  ↓
┌────────────────────────────────────────────────┐
│     Feishu API Server Checks Token             │
│     - Is token valid? ✅                        │
│     - Does token have cardkit:card:write? ❌    │
└─────────────────┬──────────────────────────────┘
                  │
                  ↓
┌────────────────────────────────────────────────┐
│     API Returns Error 403                      │
│     {                                          │
│       "code": 99991663,                        │
│       "msg": "Access denied. Required scope:   │
│               [cardkit:card:write]"            │
│     }                                          │
└─────────────────┬──────────────────────────────┘
                  │
                  ↓
┌────────────────────────────────────────────────┐
│     Your Application Receives Error            │
│     - feishu-streaming logs error              │
│     - feishu-message logs warning              │
│     - User doesn't see the card                │
└────────────────────────────────────────────────┘
```

## Token Scope Comparison

### Without Permission
```
{
  "access_token": "t-xxxxxxxxxxxxx",
  "tenant_access_token": "t-xxxxxxxxxxxxx",
  "expire": 7200,
  "scopes": [
    "im:message",                  ✅ Can send messages
    "im:message.group_at_msg"      ✅ Can receive @mentions
    // ❌ cardkit:card:write NOT INCLUDED
  ]
}
```

### With Permission
```
{
  "access_token": "t-xxxxxxxxxxxxx",
  "tenant_access_token": "t-xxxxxxxxxxxxx",
  "expire": 7200,
  "scopes": [
    "im:message",                  ✅ Can send messages
    "im:message.group_at_msg",     ✅ Can receive @mentions
    "cardkit:card:write"           ✅ Can create streaming cards!
  ]
}
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    Your CLOWBOT                          │
│                                                          │
│  ┌──────────────┐      ┌───────────────┐               │
│  │   feishu-    │─────→│   feishu-     │               │
│  │   monitor    │      │   message     │               │
│  │              │      │               │               │
│  │ (receives    │      │ (processes    │               │
│  │  events)     │      │  messages)    │               │
│  └──────────────┘      └───────┬───────┘               │
│                                 │                       │
│                                 ↓                       │
│                       ┌─────────────────┐               │
│                       │  feishu-        │               │
│                       │  streaming      │               │
│                       │                 │               │
│                       │ (creates cards) │               │
│                       │     ↓           │               │
│                       │  Needs:         │               │
│                       │  cardkit:       │               │
│                       │  card:write ⚠️   │               │
│                       └────────┬────────┘               │
└──────────────────────────────┼──────────────────────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   Feishu API        │
                    │   Checks Permission │
                    └─────────────────────┘
```

## Decision Tree: Why Is My Card Failing?

```
                    [Card Creation Fails]
                            │
                            ↓
          ┌─────────────────────────────┐
          │ Is application running?      │
          └──────┬─────────────┬────────┘
                 │             │
              NO │             │ YES
                 ↓             ↓
         [Start the app]   [Check permissions]
                                │
                                ↓
              ┌─────────────────────────────────┐
              │ Is cardkit:card:write enabled?  │
              └──────┬──────────────────┬───────┘
                     │                  │
                  NO │                  │ YES
                     ↓                  ↓
         [Enable permission]    [Check token]
         [See QUICKSTART.md]          │
                                      ↓
              ┌──────────────────────────────┐
              │ Did you restart after enable?│
              └──────┬──────────────┬────────┘
                     │              │
                  NO │              │ YES
                     ↓              ↓
              [Restart app]    [Check logs]
                                    │
                                    ↓
                         [See TROUBLESHOOTING.md]
```

## Key Points

1. **Permission is checked server-side**: Feishu's API server validates the token on every request
2. **Token includes permissions**: When you get a new token, it includes currently active permissions
3. **Must restart after enabling**: Your app needs to get a fresh token with the new permission
4. **One-time setup**: Once enabled, the permission stays active unless revoked

## Summary

The error occurs because:
1. Your bot tries to create a streaming card
2. Feishu API checks if your token has `cardkit:card:write` permission
3. Token doesn't have the permission (it wasn't enabled)
4. API returns "Access denied" error
5. Error is logged, user doesn't see the card

The solution is simple:
1. Enable `cardkit:card:write` in Feishu console
2. Restart your application
3. Done! ✅

---

For detailed instructions, see:
- [QUICKSTART.md](QUICKSTART.md) - Fast setup
- [PERMISSIONS.md](PERMISSIONS.md) - Detailed permission guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Error solutions
