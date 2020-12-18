const getSettings = async () => {
  try {
    const response = await fetch("/settings/read", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return {}
  }
}

;(async () => {
  const $app = document.getElementById("app")
  const settings = await getSettings()

  $app.innerHTML = `<pre class="code"><code>${JSON.stringify(settings, null, 2)}</code></pre>`
})()
