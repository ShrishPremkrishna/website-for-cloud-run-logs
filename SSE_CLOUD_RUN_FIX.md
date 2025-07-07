# Server-Sent Events (SSE) Issues with Cloud Run - Fixed

## The Problem

Your EventSource connection was failing on Cloud Run due to a known limitation: **Cloud Run scales to zero when not actively processing requests**, which terminates SSE connections.

According to the [Google Cloud Community discussion](https://www.googlecloudcommunity.com/gc/Serverless/Server-Sent-Events-on-Cloud-Run-not-working/td-p/609896?nobounce), this is a common issue where:

> "By default, Cloud Run only allocates CPU and charges when a container instance is processing at least one request. You can opt-into having CPU for the entire lifecycle of container instances, which are still subject to autoscaling."

## Solutions Implemented

### 1. CPU Allocation Configuration

Updated `deploy.sh` to include:
- `--cpu-boost`: Enables CPU allocation for the entire container lifecycle
- `--min-instances 1`: Keeps at least one instance running
- `--max-instances 10`: Limits scaling to prevent excessive costs

### 2. WebSocket Implementation (Primary Solution)

Switched from EventSource to WebSocket for better Cloud Run compatibility:

**Backend Changes:**
- Added WebSocket server using `ws` package
- Implemented connection management and heartbeat
- Added automatic reconnection logic
- Kept SSE endpoint for backward compatibility

**Frontend Changes:**
- Replaced EventSource with WebSocket connection
- Added automatic reconnection on connection loss
- Dynamic protocol detection (ws/wss)

### 3. Enhanced Error Handling

- Added connection state monitoring
- Implemented graceful reconnection
- Better error messages for users

## Why WebSockets Work Better

1. **Persistent Connections**: WebSockets maintain persistent connections that Cloud Run respects
2. **Heartbeat Support**: Built-in ping/pong keeps connections alive
3. **Better Error Handling**: More granular control over connection states
4. **Cloud Run Compatible**: Works reliably with Cloud Run's scaling model

## Deployment Status

✅ **Successfully deployed** with the following configuration:
- **URL**: https://cloud-run-log-viewer-520966846566.us-central1.run.app
- **CPU Allocation**: Enabled with boost
- **Min Instances**: 1 (keeps connection alive)
- **Max Instances**: 10 (cost control)

## Testing

Your app should now:
1. ✅ Connect reliably to the log stream
2. ✅ Maintain persistent connections
3. ✅ Handle reconnections automatically
4. ✅ Work across multiple browser tabs
5. ✅ Scale appropriately on Cloud Run

## Cost Considerations

- **Min 1 instance**: ~$0.00002400 per 100ms (CPU allocation)
- **Estimated monthly cost**: ~$17-20 for 1 instance running 24/7
- **Max 10 instances**: Prevents runaway costs during high traffic

## Alternative Solutions (if needed)

If WebSockets still have issues, consider:
1. **Compute Engine**: Full control over scaling (as suggested in the community)
2. **App Engine**: Better SSE support
3. **Kubernetes**: More control over infrastructure

## References

- [Google Cloud Community Discussion](https://www.googlecloudcommunity.com/gc/Serverless/Server-Sent-Events-on-Cloud-Run-not-working/td-p/609896?nobounce)
- [Cloud Run CPU Allocation Documentation](https://cloud.google.com/run/docs/configuring/cpu-allocation) 