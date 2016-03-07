require('isomorphic-fetch')
const parse = require('medium-parser')

const cors = 'https://cors-anywhere.herokuapp.com/'

window.fetchHTML = _ => {
  document.body.className = 'step2'
  const url = document.getElementById('url').value

  Promise.resolve(fetch(`${cors}${url}`, {
    credentials: 'same-origin',
  })).then(response => response.text())
  .then(text => {
    window.markdown = parse(text).markdown
    document.body.className = 'step3'
  })

}

window.reset = _ =>  document.body.className = 'step1'

const parseURL = url => {
  const user = url.match(/\/@([^/]+)\//)[1]
  // We don't use title from medium-parser here because we'd have to replace spaces for _ anyway and this is ready
  const title = url.match(/([^/]+)-.*$/)[1]
  return `${user}-${title}`
}

window.download = type => {
  const filename = parseURL(document.getElementById('url').value) + '.' + type
  const blob = new Blob([window.markdown], {type: 'application/octet-stream'})
  const formData = new FormData()
  formData.append('input_files[]', blob, 'markdown.md')
  formData.append('from', 'markdown')
  formData.append('to', type)
  Promise.resolve(fetch('https://cors-anywhere.herokuapp.com/http://c.docverter.com/convert', {
    method: 'post',
    body: formData,
    credentials: 'same-origin',
  })).then(response => response.blob())
  .then(blob => saveData(blob, filename))
}

const saveData = (blob, filename) => {
  const a = document.createElement("a")
  a.style = "display: none"
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
}
