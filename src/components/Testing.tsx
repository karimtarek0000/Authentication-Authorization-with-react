import { use, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom' // من react-dom مش react!

// Component منفصل — ما يعرفش عن الـ form إلا عن طريق الـ hook
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <div>
      <button type="submit" disabled={pending}>
        {pending ? '⏳ جاري الإرسال...' : '📤 إرسال'}
      </button>
      <p>{data ? `${data?.get('name')}` : ''}</p>
    </div>
  )
}

const sendMessage = async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const json = await data.json()

  await new Promise(resolve => setTimeout(resolve, 5000))
  console.log(json)
}

function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="name" />
      <SubmitButton />
    </form>
  )
}

export default ContactForm
