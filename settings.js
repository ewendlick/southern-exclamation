const fetch = require("node-fetch")

const jsonBinUrl = process.env.JSONBIN_ROOT
const jsonBinId = process.env.JSONBIN_BINID
const jsonBinApiKey = process.env.JSONBIN_API_KEY
const settingsCacheExpirationMs = parseInt(process.env.SETTINGS_EXPIRATION_MS, 10)

const settingsCache = {
  lastFetched: 0,
  settings: null,
}

const getSettings = async () => {
  const now = Date.now()

  if (!settingsCache.settings || now > settingsCache.lastFetched) {
    try {
      const response = await fetch(`${jsonBinUrl}/b/${jsonBinId}/latest`, {
        headers: {
          "Content-Type": "application/json",
          "secret-key": jsonBinApiKey,
        },
      })
      const data = await response.json()

      settingsCache.lastFetched = now + settingsCacheExpirationMs
      settingsCache.settings = data

      return data
    } catch (error) {
      return {}
    }
  }

  return settingsCache.settings
}

module.exports = getSettings
