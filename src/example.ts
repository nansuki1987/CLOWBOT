import { ClowBot } from './index';

/**
 * Example demonstrating the streaming card permission error handling
 * This simulates the scenario from the error logs
 */
async function runExample() {
  console.log('=== ClowBot Streaming Card Error Handling Demo ===\n');

  // Create bot instance with streaming enabled (default)
  const bot = new ClowBot({
    enableStreamingCard: true,
    maxStreamingRetries: 3,
    silentFallback: false
  });

  await bot.start();

  const monitor = bot.getMonitor();

  // Simulate multiple message events that will trigger streaming card creation attempts
  // This will demonstrate the error handling and automatic fallback behavior
  console.log('\n--- Simulating message events (will fail due to missing permissions) ---\n');

  for (let i = 1; i <= 5; i++) {
    console.log(`\nAttempt ${i}:`);
    const event = monitor.simulateEvent();
    await monitor.processEvent(event);
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Check status after errors
  const status = bot.getStatus();
  console.log('\n--- Bot Status After Errors ---');
  console.log(`Streaming Enabled: ${status.streaming.enabled}`);
  console.log(`Permission Errors: ${status.streaming.permissionErrorCount}`);
  console.log(`Active Sessions: ${status.streaming.activeSessions}`);
  console.log(`Config Streaming Enabled: ${status.config.enableStreamingCard}`);

  // Try more messages after streaming is disabled
  console.log('\n--- Attempting more messages (should use fallback silently) ---\n');
  
  for (let i = 6; i <= 8; i++) {
    console.log(`\nAttempt ${i}:`);
    const event = monitor.simulateEvent();
    await monitor.processEvent(event);
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await bot.stop();

  console.log('\n=== Demo Complete ===');
  console.log('\nKey Features Demonstrated:');
  console.log('1. First permission error is logged prominently');
  console.log('2. Subsequent errors are logged at debug level to reduce noise');
  console.log('3. After 3 errors, streaming is automatically disabled');
  console.log('4. Further messages use fallback without attempting streaming');
  console.log('5. Error messages are informative and include solution links');
}

// Run the example
runExample().catch(error => {
  console.error('Example failed:', error);
  process.exit(1);
});
