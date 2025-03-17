# Weather-App
```markdown
# Weather API with Redis Caching 🌦️

A REST API that fetches weather data from Visual Crossing's 3rd party service, implements Redis caching, rate limiting, and environment-based configuration.

## Features ✨
- ⚡ **Redis Caching** - 12-hour cache expiration for frequently requested locations
- 🛑 **Rate Limiting** - Configurable request throttling
- 🔒 **Environment Variables** - Secure API key management
- 🚦 **Error Handling** - Clear error messages for invalid requests
- 🌐 **Third-Party Integration** - Visual Crossing Weather API integration

## Installation 📦

### Prerequisites
- Node.js v16+
- Redis Server
- [Visual Crossing API Key](https://www.visualcrossing.com/weather-api)

1. Clone repository:
```bash
git clone https://github.com/yourusername/weather-api.git
cd weather-api
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
API_KEY=your_visualcrossing_api_key
REDIS_URL=redis://localhost:6379
PORT=3000
RATE_LIMIT_WINDOW=15  # Minutes
RATE_LIMIT_MAX=100    # Requests per window
```

## API Endpoints 📡

### Get Weather Data
`GET /weather/:location`

**Example:**
```bash
curl http://localhost:3000/weather/London
```

**Response:**
```json
{
  "address": "London",
  "days": [
    {
      "datetime": "2023-08-15",
      "temp": 22.5,
      "conditions": "Partly cloudy"
    }
  ]
}
```

## Rate Limiting ⏱️
Default configuration:
- 100 requests per 15 minutes
- Configure via `.env`:
  ```env
  RATE_LIMIT_WINDOW=15
  RATE_LIMIT_MAX=100
  ```

## Caching Strategy 🗄️
- Redis-backed cache
- Location-based keys (e.g., "London")
- 12-hour automatic expiration (43,200 seconds)
- Cache miss flow:
  1. Check Redis → 2. API Call → 3. Cache Result

## Error Handling ❌
| Status | Description                  |
|--------|------------------------------|
| 404    | Location not found           |
| 429    | Too many requests            |
| 500    | Internal server error        |

Sample error response:
```json
{
  "error": "Location not found",
  "status": 404
}
```

## Running the Application 🚀

1. Start Redis server:
```bash
redis-server
```

2. Start API in development mode:
```bash
node app.js
```

3. Test with curl:
```bash
curl http://localhost:3000/weather/Paris
```

## Deployment Considerations ☁️
- Use HTTPS in production
- Implement process manager (PM2/Nodemon)
- Add logging (Winston/Morgan)
- Containerize with Docker
- Monitor Redis memory usage

## Contributing 🤝
1. Fork the repository
2. Create feature branch (`git checkout -b feature/foo`)
3. Commit changes (`git commit -am 'Add foo'`)
4. Push to branch (`git push origin feature/foo`)
5. Create new Pull Request

## License 📄
MIT License - see [LICENSE](LICENSE) for details

---

Made with ❤️ by [Your Name] | [Visual Crossing API Documentation](https://www.visualcrossing.com/resources/documentation/weather-api/)
```
