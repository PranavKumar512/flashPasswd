import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const urlParams = new URLSearchParams(window.location.search)
const accessToken = urlParams.get('access_token')
const type = urlParams.get('type')

if (accessToken && type === 'recovery') {
  supabase.auth.exchangeCodeForSession(accessToken).then(({ error }) => {
    if (error) {
      showError('Invalid or expired recovery link.')
    } else {
      document.getElementById('form').style.display = 'block'
    }
  })
} else {
  showError('Invalid recovery link.')
}

function showError(message) {
  const div = document.createElement('div')
  div.className = 'error'
  div.textContent = message
  document.body.appendChild(div)
}

function showSuccess(message) {
  document.getElementById('form').style.display = 'none'
  const div = document.createElement('div')
  div.className = 'success'
  div.textContent = message
  document.body.appendChild(div)
}

async function resetPassword(event) {
  event.preventDefault()
  const password = document.getElementById('password').value

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    showError(error.message)
  } else {
    showSuccess('Password updated successfully! You can close this window.')
  }
}

// ✅ Attach the form submission handler here
document.getElementById('form').addEventListener('submit', resetPassword)
