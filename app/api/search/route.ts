import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, params } = await request.json()

    if (!endpoint || !params) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    let result

    switch (endpoint) {
      case "personal":
        result = await handlePersonal(params)
        break
      case "email":
        result = await handleEmail(params)
        break
      case "username":
        result = await handleUsername(params)
        break
      case "vehicle":
        result = await handleVehicle(params)
        break
      case "ip":
        result = await handleIp(params)
        break
      case "postal":
        result = await handlePostal(params)
        break
      case "mac":
        result = await handleMac(params)
        break
      case "ifsc":
        result = await handleIfsc(params)
        break
      case "bin":
        result = await handleBin(params)
        break
      case "github":
        result = await handleGithub(params)
        break
      case "ban":
        result = await handleBan(params)
        break
      case "domain":
        result = await handleDomain(params)
        break
      case "crypto":
        result = await handleCrypto(params)
        break
      case "weather":
        result = await handleWeather(params)
        break
      case "url":
        result = await handleUrl(params)
        break
      default:
        return NextResponse.json({ error: "Unknown endpoint" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 })
  }
}

async function handlePersonal(params: any) {
  const { type, query } = params

  try {
    if (type === "phone") {
      const [response1, response2] = await Promise.all([
        fetch(`https://yahu.site/api/?number=${query}&key=The_ajay`).catch(() => null),
        fetch(`https://ox.taitaninfo.workers.dev/?mobile=${query}`).catch(() => null),
      ])

      const data1 = response1 ? await response1.json() : null
      const data2 = response2 ? await response2.json() : null

      if (data1 && data1.remarks) {
        delete data1.remarks
      }
      if (data2 && data2.remarks) {
        delete data2.remarks
      }

      const result: any = {}
      if (data1) result["Source 1"] = data1
      if (data2) result["Source 2"] = data2

      return Object.keys(result).length > 0 ? result : { error: "No data found" }
    }

    if (type === "aadhaar") {
      const response = await fetch(`https://ox.taitaninfo.workers.dev/?aadhar=${query}`)
      return await response.json()
    }

    if (type === "family") {
      const response = await fetch(`https://ox.taitaninfo.workers.dev/?family=${query}`)
      return await response.json()
    }

    if (type === "mobile") {
      const response = await fetch(`https://ox.taitaninfo.workers.dev/?mobile=${query}`)
      return await response.json()
    }
  } catch (error) {
    return { error: "No data found" }
  }

  return {}
}

async function handleEmail(params: any) {
  const { query } = params
  try {
    const [emailResponse, smtpResponse, domainResponse] = await Promise.all([
      fetch(`https://api.hunter.io/v2/email-finder?domain=${query.split("@")[1]}&limit=10`).catch(() => null),
      fetch(`https://api.smtp-validator.com/validate?email=${query}`).catch(() => null),
      fetch(`https://dns.google/resolve?name=${query.split("@")[1]}&type=MX`).catch(() => null),
    ])

    const result: any = {
      email: query,
      timestamp: new Date().toISOString(),
    }

    if (emailResponse) {
      try {
        const data = await emailResponse.json()
        result.hunter_data = data
      } catch (e) {}
    }

    if (smtpResponse) {
      try {
        const data = await smtpResponse.json()
        result.smtp_validation = data
      } catch (e) {}
    }

    if (domainResponse) {
      try {
        const data = await domainResponse.json()
        result.domain_records = data
      } catch (e) {}
    }

    return result
  } catch (error) {
    return { error: "No email data found" }
  }
}

async function handleUsername(params: any) {
  const { query } = params
  try {
    const [githubResponse, twitterResponse, redditResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${query}`).catch(() => null),
      fetch(`https://api.twitter.com/2/users/by/username/${query}`).catch(() => null),
      fetch(`https://www.reddit.com/user/${query}/about.json`).catch(() => null),
    ])

    const result: any = {
      username: query,
      timestamp: new Date().toISOString(),
      found_on: [],
    }

    if (githubResponse?.ok) {
      try {
        const data = await githubResponse.json()
        result.github = data
        result.found_on.push("GitHub")
      } catch (e) {}
    }

    if (redditResponse?.ok) {
      try {
        const data = await redditResponse.json()
        result.reddit = data.data
        result.found_on.push("Reddit")
      } catch (e) {}
    }

    return result
  } catch (error) {
    return { error: "No username data found" }
  }
}

async function handleVehicle(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://vehicke-info.vercel.app/?rc_number=${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No vehicle data found" }
  }
}

async function handleIp(params: any) {
  const { query } = params
  try {
    const response = await fetch(
      `https://api.ipdata.co/${query}/?api-key=e242255b22e54690bb6db2fe327f7e5dfe850ec444fbf924d20ba943`,
    )
    return await response.json()
  } catch (error) {
    return { error: "No IP data found" }
  }
}

async function handlePostal(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No postal data found" }
  }
}

async function handleMac(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://api.maclookup.app/v2/macs/${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No MAC data found" }
  }
}

async function handleIfsc(params: any) {
  const { type, query } = params
  try {
    if (type === "razorpay") {
      const response = await fetch(`https://ifsc.razorpay.com/${query}`)
      return await response.json()
    } else {
      const response = await fetch(`https://ifsc.taitaninfo.workers.dev/?code=${query}`)
      const data = await response.json()

      if (data) {
        delete data.developer
        delete data.telegram_channel
      }

      return data
    }
  } catch (error) {
    return { error: "No IFSC data found" }
  }
}

async function handleBin(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://lookup.binlist.net/${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No BIN data found" }
  }
}

async function handleGithub(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://api.github.com/users/${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No GitHub user found" }
  }
}

async function handleBan(params: any) {
  const { query } = params
  try {
    const response = await fetch(`https://duranto-ban-check.vercel.app/bancheck?uid=${query}`)
    return await response.json()
  } catch (error) {
    return { error: "No ban data found" }
  }
}

async function handleDomain(params: any) {
  const { query } = params
  try {
    // Using DNS lookup for domain information
    const response = await fetch(`https://dns.google/resolve?name=${query}&type=A`)
    const data = await response.json()

    if (data.Answer) {
      return {
        domain: query,
        status: "Active",
        records: data.Answer,
        timestamp: new Date().toISOString(),
      }
    }

    return { error: "No domain data found" }
  } catch (error) {
    return { error: "No domain data found" }
  }
}

async function handleCrypto(params: any) {
  const { query } = params
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${query.toLowerCase()}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
    )
    const data = await response.json()

    if (data[query.toLowerCase()]) {
      return {
        name: query,
        price_usd: data[query.toLowerCase()].usd,
        market_cap_usd: data[query.toLowerCase()].usd_market_cap,
        volume_24h_usd: data[query.toLowerCase()].usd_24h_vol,
        change_24h: data[query.toLowerCase()].usd_24h_change,
      }
    }

    return { error: "Cryptocurrency not found" }
  } catch (error) {
    return { error: "No crypto data found" }
  }
}

async function handleWeather(params: any) {
  const { query } = params
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`,
    )
    const geoData = await geoResponse.json()

    if (geoData.results && geoData.results.length > 0) {
      const { latitude, longitude, name, country } = geoData.results[0]
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`,
      )
      const weatherData = await weatherResponse.json()

      return {
        location: `${name}, ${country}`,
        latitude,
        longitude,
        temperature: weatherData.current.temperature_2m,
        weather_code: weatherData.current.weather_code,
        wind_speed: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
        timestamp: new Date().toISOString(),
      }
    }

    return { error: "Location not found" }
  } catch (error) {
    return { error: "No weather data found" }
  }
}

async function handleUrl(params: any) {
  const { query } = params
  try {
    // Using TinyURL API for URL shortening
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(query)}`)
    const shortUrl = await response.text()

    return {
      original_url: query,
      short_url: shortUrl,
    }
  } catch (error) {
    return { error: "Failed to shorten URL" }
  }
}
