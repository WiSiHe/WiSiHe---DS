<script>
  import { onMount } from 'svelte'

  let today = new Date()
  let selectedDate = ''

  // Format today's date to yyyy-mm-dd
  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Set the date picker to today's date
  onMount(() => {
    selectedDate = formatDate(today)
  })

  function handleChange(event) {
    // Only allow today's date
    if (event.target.value === selectedDate) {
      selectedDate = event.target.value
    } else {
      alert("You can only select today's date!")
      event.target.value = selectedDate
    }
  }
</script>

<div class="datepicker-container">
  <input
    type="date"
    value={selectedDate}
    min={selectedDate}
    max={selectedDate}
    on:change={handleChange}
  />
  <div class="message">Only today's date is selectable.</div>
</div>

<style>
  .datepicker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }

  input[type='date'] {
    padding: 8px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  input[type='date']:focus {
    border-color: #0056b3;
  }

  .message {
    margin-top: 10px;
    color: #555;
    font-size: 14px;
  }
</style>
