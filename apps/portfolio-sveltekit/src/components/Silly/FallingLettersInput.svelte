<script>
  let inputValue = ''
  const maxChars = 10

  // Array to store the falling letters
  let fallingLetters = []

  // Function to handle input change
  function handleInput(event) {
    const value = event.target.value

    if (value.length > maxChars) {
      const fallingLetter = value[0]
      inputValue = value.substring(1)

      // Add the falling letter to the array
      fallingLetters = [...fallingLetters, fallingLetter]

      // Remove the letter after the animation ends
      setTimeout(() => {
        fallingLetters = fallingLetters.slice(1)
      }, 2000) // 2s for the animation
    } else {
      inputValue = value
    }
  }
</script>

<div class="input-container">
  <input
    type="text"
    bind:value={inputValue}
    on:input={handleInput}
    placeholder="Type here..."
  />
  <div class="falling-letters">
    {#each fallingLetters as letter, i (i)}
      <span class="fallen-letter" style="left: 0px;">{letter}</span>
    {/each}
  </div>
  <div class="character-count">
    {inputValue.length}/{maxChars} characters
  </div>
</div>

<style>
  .input-container {
    position: relative;
    text-align: center;
    margin-bottom: 20px;
  }

  input {
    width: 150px;
    padding: 8px;
    font-size: 16px;
    font-family: monospace;
    border: 2px solid #007bff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
  }

  .falling-letters {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
  }

  .fallen-letter {
    position: absolute;
    font-size: 16px;
    color: #ff6347;
    font-family: monospace;
    animation: funnyFall 2s forwards;
  }

  @keyframes funnyFall {
    0% {
      transform: translateY(0) rotate(0deg) scale(1);
    }
    50% {
      transform: translateY(30px) rotate(180deg) scale(1.2);
    }
    100% {
      transform: translateY(80px) rotate(360deg) scale(0.8);
    }
  }

  .character-count {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
  }
</style>
